const { Education } = require("../models");
const { Experience } = require("../models");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");

const slugify = require("slugify");
const { ProfileImage } = require("../models");
const AppError = require("../utils/appError");
const { User } = require("../models");
const { Friend } = require("../models");
const { FriendRequest } = require("../models");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

/**************** multer storage ************************* */
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profile");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".")[1];

    cb(null, `user-${uuidv4()}-${Date.now()}.${ext}`);
  },
});
/******************** multer fields ************************ */
const multerFilter = (req, file, cb) => {
  console.log(file, "marshal");

  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
exports.uploadUserPhoto = upload.single("image");

/*******************************************************************************  education image *******************************************************/
/**************** multer storage  for education************************* */
const multerStorage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/education");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".")[1];

    cb(null, `user-${uuidv4()}-${Date.now()}.${ext}`);
  },
});

const upload2 = multer({
  storage: multerStorage2,
  fileFilter: multerFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
exports.uploadUserPhoto2 = upload2.single("profileImage");
/**************** multer storage  for experience************************* */
const multerStorage3 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/experience");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".")[1];

    cb(null, `user-${uuidv4()}-${Date.now()}.${ext}`);
  },
});

const upload3 = multer({
  storage: multerStorage3,
  fileFilter: multerFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
exports.uploadUserPhoto3 = upload3.single("profileImage");
// profile model

exports.getUsersFreindByUsername = async (req, res, next) => {
  const user = req.user;
  const { search } = await req.body;
  //  const users =
  let friend;
  if (search) {
    friend = await user.getFriends({
      include: [
        {
          model: User,
          as: "UserFriends",

          where: {
            username: { [Op.like]: `%${search}%` },
          },
        },
      ],
    });
  } else {
    friend = await user.getFriends({
      include: [
        {
          model: User,
          as: "UserFriends",
        },
      ],
    });
  }

  res.status(201).json({
    status: "succes",
    data: friend,
    user: user,
  });
};
exports.getProfile = async (req, res, next) => {
  const uid = req.params.id;
  const user = await User.findByPk(uid);

  const s = await User.findByPk(uid, {
    include: [
      { model: ProfileImage },
      // { model: Friend, include: [{ model: User }] },
      // { model: FriendRequest, include: [{ model: User }] },

      // { model: User, as: "Sender" },
      // {
      //   model: User,
      //   as: "Reciver",
      // },
      // {
      //   model: User,
      //   as: "Relation",
      // },

      // { model: User, as: "RelationTwo" },

      { model: Education },
      { model: Experience },
    ],
  });

  res.status(201).json({
    status: "succes",
    data: s,
  });
};

exports.addProfileImage = catchAsync(async (req, res) => {
  const user = req.user;
  console.log(req.file);
  if (req.file) {
    req.body.image = process.env.BASE_URL + "/profile/" + req.file.filename;
    const img = await ProfileImage.create({
      image: req.body.image,
      UserId: req.user.id,
    });
  }

  res.status(201).json({
    status: "succes",
    data: req.file,
  });
});

exports.addProfileEducation = catchAsync(async (req, res) => {
  const user = req.user;
  if (req.file) {
    req.body.profileImage =
      process.env.BASE_URL + "/education/" + req.file.filename;
  }

  req.body.UserId = user.id;

  const edu = await Education.create(req.body);

  res.status(201).json({
    status: "success",
    data: edu,
  });
});
exports.addProfileExperience = catchAsync(async (req, res) => {
  const user = req.user;
  if (req.file) {
    req.body.profileImage =
      process.env.BASE_URL + "/experience/" + req.file.filename;
  }
  req.body.UserId = user.id;

  const exp = await Experience.create(req.body);

  res.status(201).json({
    status: "success",
    data: exp,
  });
});

exports.removeProfileImage = catchAsync(async (req, res, next) => {
  const user = req.user;
  const imgId = req.params.id;
  const image = await ProfileImage.findByPk(imgId);
  if (!image) {
    return next(new AppError("There is not image with is id", 404));
  }
  if (user.id != image.UserId) {
    return next(new AppError("you can have permission!", 404));
  }

  image.destroy();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.removeProfileImage = catchAsync(async (req, res, next) => {
  const user = req.user;
  const imgId = req.params.id;
  const image = await ProfileImage.findByPk(imgId);
  if (!image) {
    return next(new AppError("There is not image with is id", 404));
  }
  if (user.id != image.UserId) {
    return next(new AppError("you can have permission!", 404));
  }

  image.destroy();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateEducation = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  if (req.file) {
    req.body.profileImage = req.file.filename;
  }
  const edu = await Education.findByPk(id);

  if (!edu) {
    return next(new AppError("There is not education with is id", 404));
  }
  if (user.id != edu.UserId) {
    return next(new AppError("you can have permission!", 404));
  }
  if (req.file) {
    req.body.profileImage = req.file.filename;
  }
  edu.educationLevel = req.body.educationLevel || edu.educationLevel;
  edu.from = req.body.from || edu.from;
  edu.to = req.body.to || edu.to;
  edu.profileImage = req.body.profileImage || edu.profileImage;
  edu.location = req.body.location || edu.location;

  edu.schoolName = req.body.schoolName || edu.schoolName;
  edu.save();
  res.status(201).json({
    status: "succes",
    data: edu,
  });
});

exports.updateExperience = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  if (req.file) {
    req.body.profileImage = req.file.filename;
  }
  const exp = await Experience.findByPk(id);
  if (!role) {
    return next(AppError("ksjns", 404));
  }
  if (!exp) {
    return next(new AppError("There is not exprience with is id", 404));
  }
  if (user.id != exp.UserId) {
    return next(new AppError("you can have permission!", 404));
  }
  if (req.file) {
    req.body.profileImage = req.file.filename;
  }
  exp.jobType = req.body.jobType || exp.jobType;
  exp.from = req.body.from || exp.from;
  exp.location = req.body.location || exp.location;
  exp.to = req.body.to || exp.to;
  exp.profileImage = req.body.profileImage || exp.profileImage;

  exp.skills = req.body.skills || exp.skills;
  exp.save();
  res.status(201).json({
    status: "succes",
    data: exp,
  });
});

exports.removeProfileEducation = catchAsync(async (req, res, next) => {
  const user = req.user;
  const eduId = req.params.id;
  const edu = await Education.findByPk(eduId);
  if (!edu) {
    return next(new AppError("There is not education with is id", 404));
  }
  if (user.id != edu.UserId) {
    return next(new AppError("you can have permission!", 404));
  }

  edu.destroy();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.removeProfileExpereince = catchAsync(async (req, res, next) => {
  const user = req.user;
  const expId = req.params.id;
  const exp = await Experience.findByPk(expId);
  if (!exp) {
    return next(new AppError("There is not experience with is id", 404));
  }
  if (user.id != exp.UserId) {
    return next(new AppError("you can have permission!", 404));
  }

  exp.destroy();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
