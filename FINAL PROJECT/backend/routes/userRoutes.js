const express = require("express");
const authLimiter = require("../middleware/rateLimiter");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updateProfile,
    uploadAvatar,
    searchUsers,
    checkUsernameAvailability
} = require("../controllers/userControllers");


router.post(
    "/login",
    authLimiter,
    loginUser
);

router.post(
    "/register",
    authLimiter,
    registerUser
);

router.post(
    "/check-username",
    checkUsernameAvailability
);

router.post(
    "/forgotpassword",
    authLimiter,
    forgotPassword
);
router.post("/refresh", refreshAccessToken);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/resetpassword/:token", resetPassword);
router.post("/reset/:token", resetPassword);
router.post("/reset", resetPassword);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateProfile);
router.get("/search", protect, searchUsers);

router.put(
    "/avatar",
    protect,
    upload.single("avatar"),
    uploadAvatar
);

router.post(
    "/logout",
    protect,
    logoutUser
);

module.exports = router;