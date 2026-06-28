const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const { admin } = require("../middleware/adminMiddleware");

const {
    getAllUsers
} = require("../controllers/adminController");

router.get(
    "/users",
    protect,
    admin,
    getAllUsers
);

const { getStats } = require("../controllers/adminController");
router.get(
    "/stats",
    protect,
    admin,
    getStats
);

const { deleteUser } = require("../controllers/adminController");
router.delete(
    "/users/:id",
    protect,
    admin,
    deleteUser
);  

const { banUser } = require("../controllers/adminController");
router.put(
    "/users/:id/ban",   
    protect,
    admin,
    banUser
);

const { unbanUser } = require("../controllers/adminController");
router.put(
    "/users/:id/unban", 
    protect,
    admin,
    unbanUser
);

const { createGame } = require("../controllers/adminController");
router.post(
    "/games",
    protect,
    admin,
    createGame
);

const { deleteGame } = require("../controllers/adminController");
router.delete(
    "/games/:id",   
    protect,
    admin,
    deleteGame
);


module.exports = router;