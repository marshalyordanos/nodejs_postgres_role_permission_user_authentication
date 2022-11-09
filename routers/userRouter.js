const express = require("express");
const { getUserBy } = require("../controllers/agrigateController");
const {
  signup,
  uploadUserPhoto,
  login,
  getUsers,
  protect,
  updateUsers,
  deleteUserByAdmin,
  createRolePerm,
} = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/rolPerm").post(createRolePerm);

router.route("/").get(protect, getUsers);
router
  .route("/:id")
  .patch(protect, updateUsers)
  .delete(protect, deleteUserByAdmin);

router.route("/place").get(protect, getUserBy);

module.exports = router;
