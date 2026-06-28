const express = require("express");
const router = express.Router();

const {
  getSiteStats,
  getFeatures
} = require("../controllers/siteController");

// Public routes
router.get("/stats", getSiteStats);
router.get("/features", getFeatures);

module.exports = router;