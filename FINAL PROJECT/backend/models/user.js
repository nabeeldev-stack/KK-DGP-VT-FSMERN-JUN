const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
{
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
},

totalScore: {
    type: Number,
    default: 0
},

isVerified: {
    type: Boolean,
    default: false
},

isBanned: {
    type: Boolean,
    default: false
},

otp: String,
otpExpires: Date,

resetPasswordToken: String,
restPasswordToken: String,
resetPasswordExpires: Date,
    refreshToken: String,
    
    avatar: {
        type: String,
        default: ""
    },

    banner: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: "",
        maxlength: 160
    },

    accentColor: {
        type: String,
        default: "#5865F2" // Discord blurple
    },

    pronouns: {
        type: String,
        default: ""
    },

    customStatus: {
        emoji: {
            type: String,
            default: ""
        },
        text: {
            type: String,
            default: "",
            maxlength: 128
        }
    },

    socialLinks: {
        twitter: {
            type: String,
            default: ""
        },
        instagram: {
            type: String,
            default: ""
        },
        youtube: {
            type: String,
            default: ""
        },
        twitch: {
            type: String,
            default: ""
        },
        github: {
            type: String,
            default: ""
        },
        linkedin: {
            type: String,
            default: ""
        },
        website: {
            type: String,
            default: ""
        }
    },

    profileBadges: [{
        type: String,
        enum: ["early_adopter", "verified", "premium", "gamer", "streamer"],
        default: []
    }],

    status: {
        type: String,
        enum: ["online", "idle", "dnd", "offline"],
        default: "offline"
    }
        
    },
{
    timestamps: true
}
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);