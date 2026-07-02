const User = require("../models/user");
const Friend = require("../models/friend");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/generateTokens");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");


const checkUsernameAvailability = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || username.length < 3) {
            return res.status(400).json({
                available: false,
                message: "Username must be at least 3 characters"
            });
        }

        // Check if username contains only alphanumeric characters and underscores
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                available: false,
                message: "Username can only contain letters, numbers, and underscores"
            });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            // Generate suggestions
            const suggestions = [];
            const baseUsername = username.toLowerCase();
            
            // Add numbers to the end
            for (let i = 1; i <= 5; i++) {
                suggestions.push(`${baseUsername}${i}`);
            }
            
            // Add underscore and numbers
            for (let i = 1; i <= 3; i++) {
                suggestions.push(`${baseUsername}_${i}`);
            }

            // Check which suggestions are available
            const availableSuggestions = [];
            for (const suggestion of suggestions) {
                const exists = await User.findOne({ username: suggestion });
                if (!exists) {
                    availableSuggestions.push(suggestion);
                }
                if (availableSuggestions.length >= 5) break;
            }

            return res.status(200).json({
                available: false,
                message: "Username is already taken",
                suggestions: availableSuggestions
            });
        }

        res.status(200).json({
            available: true,
            message: "Username is available"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Validate username format
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                message: "Username can only contain letters, numbers, and underscores"
            });
        }

        if (username.length < 3 || username.length > 30) {
            return res.status(400).json({
                message: "Username must be between 3 and 30 characters"
            });
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            if (userExists.email === email) {
                return res.status(400).json({
                    message: "Email already registered"
                });
            }
            if (userExists.username === username) {
                return res.status(400).json({
                    message: "Username is already taken"
                });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await User.create({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000,
            isVerified: false
        });

        try {
            await sendEmail(
                email,
                "Account Verification OTP",
                `
                <h2>Your OTP is:</h2>
                <h1>${otp}</h1>
                <p>This OTP expires in 10 minutes.</p>
                `
            );
        } catch (err) {
            console.log(err.message);
        }

        res.status(201).json({
            message:
                "Registration successful. OTP sent to your email.",
            email
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "Account already verified"
            });
        }

        if (
            user.otp !== otp ||
            user.otpExpires < Date.now()
        ) {
            return res.status(400).json({
                message: "Invalid or expired OTP"
            });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.json({
            message:
                "Account verified successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.otp = otp;
        user.otpExpires =
            Date.now() + 10 * 60 * 1000;

        await user.save();

        await sendEmail(
            email,
            "New Verification OTP",
            `
            <h2>Your new OTP:</h2>
            <h1>${otp}</h1>
            <p>Expires in 10 minutes.</p>
            `
        );

        res.json({
            message: "OTP sent successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.isVerified) {
                return res.status(403).json({ message: "Please verify your email before logging in." });
            }

            if (user.isBanned) {
                return res.status(403).json({ message: "Your account has been banned. Please contact support." });
            }

            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);
            user.refreshToken = refreshToken;
            await user.save();

            return res.json({
                message: "Login successful",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar || "",
                    banner: user.banner || "",
                    bio: user.bio || "",
                    accentColor: user.accentColor || "#5865F2",
                    pronouns: user.pronouns || "",
                    customStatus: user.customStatus || { emoji: "", text: "" },
                    socialLinks: user.socialLinks || {}
                },
                accessToken,
                refreshToken
            });
        } else {
            return res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const clientUrl = process.env.CLIENT_URL || "https://synthplay.vercel.app";
        const resetLink = `${clientUrl.replace(/\/$/, "")}/reset-password/${resetToken}`;

        await sendEmail(
            user.email,
            "Password Reset Request",
            `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
        );

        res.json({ message: "Password reset email sent. Please check your inbox." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const resetToken = token || req.body.token || req.body.resetToken || req.query.token;
        const newPassword = req.body.newPassword || req.body.password;

        if (!resetToken) {
            return res.status(400).json({ message: "Reset token required" });
        }

        if (!newPassword) {
            return res.status(400).json({ message: "New password required" });
        }

        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful. You can now log in with your new password." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get any user's public profile by ID
const getUserProfileById = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId).select("-password -email -refreshToken -otp -otpExpires -resetPasswordToken -resetPasswordExpires");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { 
            username, 
            email, 
            currentPassword, 
            newPassword,
            bio,
            accentColor,
            pronouns,
            customStatus,
            socialLinks
        } = req.body;
        
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username) {
            // Validate username format
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            if (!usernameRegex.test(username)) {
                return res.status(400).json({
                    message: "Username can only contain letters, numbers, and underscores"
                });
            }

            if (username.length < 3 || username.length > 30) {
                return res.status(400).json({
                    message: "Username must be between 3 and 30 characters"
                });
            }

            // Check if username is already taken by another user
            const existingUser = await User.findOne({ 
                username, 
                _id: { $ne: user._id } 
            });
            
            if (existingUser) {
                return res.status(400).json({
                    message: "Username is already taken"
                });
            }
            
            user.username = username;
        }

        if (email) {
            const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }

        if (bio !== undefined) {
            if (bio.length > 160) {
                return res.status(400).json({ message: "Bio must be 160 characters or less" });
            }
            user.bio = bio;
        }

        if (accentColor !== undefined) {
            // Validate hex color format
            const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            if (!hexColorRegex.test(accentColor)) {
                return res.status(400).json({ message: "Invalid accent color format" });
            }
            user.accentColor = accentColor;
        }

        if (pronouns !== undefined) {
            user.pronouns = pronouns;
        }

        if (customStatus !== undefined) {
            if (customStatus.text && customStatus.text.length > 128) {
                return res.status(400).json({ message: "Custom status must be 128 characters or less" });
            }
            user.customStatus = {
                emoji: customStatus.emoji || "",
                text: customStatus.text || ""
            };
        }

        if (socialLinks !== undefined) {
            user.socialLinks = {
                twitter: socialLinks.twitter || "",
                instagram: socialLinks.instagram || "",
                youtube: socialLinks.youtube || "",
                twitch: socialLinks.twitch || "",
                github: socialLinks.github || "",
                linkedin: socialLinks.linkedin || "",
                website: socialLinks.website || ""
            };
        }

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required to set a new password" });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ message: "New password must be at least 6 characters" });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        const updatedUser = await user.save();
        res.json({
            id: updatedUser._id,
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar || "",
            banner: updatedUser.banner || "",
            bio: updatedUser.bio || "",
            accentColor: updatedUser.accentColor || "#5865F2",
            pronouns: updatedUser.pronouns || "",
            customStatus: updatedUser.customStatus || { emoji: "", text: "" },
            socialLinks: updatedUser.socialLinks || {}
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.refreshToken = null;
        await user.save();

        res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token required"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({
                message: "Invalid refresh token"
            });
        }

        const accessToken = generateAccessToken(user._id);
        res.json({ accessToken });

    } catch (error) {
        res.status(403).json({
            message: "Token expired"
        });
    }
};

// Search users
const searchUsers = async (req, res) => {
    try {
        const { search } = req.query;
        const userId = req.user._id;
        
        if (!search) {
            return res.json([]);
        }

        // Find all accepted friendships where user is either requester or recipient
        const acceptedFriendships = await Friend.find({
            status: "accepted",
            $or: [
                { requester: userId },
                { recipient: userId }
            ]
        });

        // Get IDs of existing friends
        const friendIds = acceptedFriendships.map(friendship => 
            friendship.requester.toString() === userId.toString() 
                ? friendship.recipient.toString() 
                : friendship.requester.toString()
        );

        // Find all pending friend requests where user is either requester or recipient
        const pendingRequests = await Friend.find({
            status: "pending",
            $or: [
                { requester: userId },
                { recipient: userId }
            ]
        });

        // Get IDs of users with pending requests
        const pendingUserIds = pendingRequests.map(request => 
            request.requester.toString() === userId.toString() 
                ? request.recipient.toString() 
                : request.requester.toString()
        );

        // Combine IDs to exclude (friends + pending requests + current user)
        const excludeIds = [...friendIds, ...pendingUserIds, userId.toString()];

        // Search for users excluding the above IDs
        const users = await User.find({
            _id: { $nin: excludeIds },
            username: { $regex: search, $options: "i" }
        }).select("-password -email -refreshToken -otp -otpExpires -resetPasswordToken -resetPasswordExpires");

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please select an image."
            });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "gaming-platform/avatars",
            },
            async (error, result) => {
                if (error) {
                    return res.status(500).json({
                        message: "Cloudinary upload failed.",
                        error,
                    });
                }

                const user = await User.findById(req.user._id);

                if (!user) {
                    return res.status(404).json({
                        message: "User not found",
                    });
                }

                user.avatar = result.secure_url;

                await user.save();

                res.status(200).json({
                    message: "Avatar uploaded successfully",
                    avatar: user.avatar,
                });
            }
        );

        streamifier
            .createReadStream(req.file.buffer)
            .pipe(uploadStream);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const uploadBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please select an image."
            });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "gaming-platform/banners",
            },
            async (error, result) => {
                if (error) {
                    return res.status(500).json({
                        message: "Cloudinary upload failed.",
                        error,
                    });
                }

                const user = await User.findById(req.user._id);

                if (!user) {
                    return res.status(404).json({
                        message: "User not found",
                    });
                }

                user.banner = result.secure_url;

                await user.save();

                res.status(200).json({
                    message: "Banner uploaded successfully",
                    banner: user.banner,
                });
            }
        );

        streamifier
            .createReadStream(req.file.buffer)
            .pipe(uploadStream);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
 registerUser,
 verifyOtp,
 resendOtp,
 loginUser,
 refreshAccessToken,
 forgotPassword,
 resetPassword,
 logoutUser,
 getUserProfile,
 getUserProfileById,
 updateProfile,
 uploadAvatar,
 uploadBanner,
 searchUsers,
 checkUsernameAvailability
};
