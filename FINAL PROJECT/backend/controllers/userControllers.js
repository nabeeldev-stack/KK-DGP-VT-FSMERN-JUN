const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/generateTokens");

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

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
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
                    role: user.role
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

        const resetLink = `http://localhost:${process.env.PORT || 5000}/reset-password/${resetToken}`;

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
        user.restPasswordToken = undefined;
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

module.exports = {
 registerUser,
 verifyOtp,
 resendOtp,
 loginUser,
 refreshAccessToken,
 forgotPassword,
 resetPassword,
 logoutUser,
 getUserProfile
};