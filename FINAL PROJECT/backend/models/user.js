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
    }
        
    },
{
    timestamps: true
}
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);