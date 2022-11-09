const express = require("express");
const { protect, restricTo } = require("../controllers/authController");
const {
  createRole,
  getRoles,
  rolePermission,
  getRole,
} = require("../controllers/roleController");

const router = express.Router();

router
  .route("/")
  .post(createRole)
  .get(protect, restricTo({ permissionName: "all_user" }), getRoles);
router.route("/:id").get(protect, getRole);

router.route("/perm").post(rolePermission);

module.exports = router;
