const express = require("express");
const authLimiter =
require("../middleware/rateLimiter");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    getUserProfile
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

router.post(
    "/logout",
    protect,
    logoutUser
);

module.exports = router;