const express = require("express");
const {
  creategPermission,
  getPermissions,
} = require("../controllers/permisstionController");

const router = express.Router();

router.route("/").post(creategPermission).get(getPermissions);

module.exports = router;
