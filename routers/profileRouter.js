const express = require("express");
const { protect } = require("../controllers/authController");
const {
  uploadUserPhoto3,
  getProfile,
  getUsersFreindByUsername,
} = require("../controllers/profileController");
const { removeProfileEducation } = require("../controllers/profileController");
const { updateEducation } = require("../controllers/profileController");
// const { getProfile } = require("../controllers/profileController");
const { updateExperience } = require("../controllers/profileController");
const { removeProfileExpereince } = require("../controllers/profileController");
const { removeProfileImage } = require("../controllers/profileController");
const { addProfileExperience } = require("../controllers/profileController");
const { uploadUserPhoto2 } = require("../controllers/profileController");
const { addProfileEducation } = require("../controllers/profileController");
const {
  addProfileImage,
  uploadUserPhoto,
} = require("../controllers/profileController");

const router = express.Router();

router.route("/getFriends").get(protect, getUsersFreindByUsername);

router.route("/image").post(protect, uploadUserPhoto, addProfileImage);
router.route("/education").post(protect, uploadUserPhoto2, addProfileEducation);
router
  .route("/experience")
  .post(protect, uploadUserPhoto3, addProfileExperience);
router.route("/get/:id").get(protect, getProfile);
router.route("/removeImage/:id").delete(protect, removeProfileImage);
router.route("/removeEducation/:id").delete(protect, removeProfileEducation);
router.route("/removeExpereince/:id").delete(protect, removeProfileExpereince);
router
  .route("/updateEducation/:id")
  .patch(protect, uploadUserPhoto2, updateEducation);
router
  .route("/updateExpereince/:id")
  .patch(protect, uploadUserPhoto3, updateExperience);

module.exports = router;
