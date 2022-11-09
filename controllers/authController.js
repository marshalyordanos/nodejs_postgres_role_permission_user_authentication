const { User } = require("../models");
const { Permission } = require("../models");
const { RolePermission } = require("../models");

const { Role } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { where } = require("sequelize");

const getToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRETE, {
    expiresIn: "30d",
  });
};

exports.signup = catchAsync(async (req, res) => {
  const user = await User.create(req.body);

  const token = getToken(user.id);
  res.json({
    status: "seccess",
    token: token,
    user: user,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  //  check phone number and password is provides
  const { phone, password } = req.body;
  if (!phone || !password) {
    return next(
      new AppError("phone number and password must be provided!", 401)
    );
  }

  // find user
  let user = await User.findOne({ where: { phone: phone } });
  if (!user) {
    return next(new AppError("the user is doen't exist!", 401));
  }
  // check if the password is correct
  const correctPassword = await bcrypt.compare(password, user.password);
  console.log(correctPassword);
  if (!correctPassword) {
    return next(new AppError("invalid phone or password", 401));
  }
  // generate token
  const token = getToken(user.id);
  // send response

  user = await User.findOne({
    where: { phone: phone },
    attributes: { exclude: ["password", "passwordConfirm"] },
    include: { model: Role },
  });

  res.status(200).json({
    status: "succes",
    token: token,
    user: user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //check if there is a token
  let token;
  if (
    req.headers.authorization ||
    req.headers.authorization?.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("yor are not logged in", 401));
  }
  // varification token
  console.log(token);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRETE);

  // check if the user still exixst
  const freshUser = await User.findByPk(decoded.id);
  if (!freshUser) {
    return next(new AppError("the user is does not exist", 401));
  }

  req.user = freshUser;

  next();
});

exports.createRolePerm = catchAsync(async (req, res, next) => {
  const roleId = req.body.roleId;
  const permId = req.body.permId;
  const role = await Role.findByPk(roleId);
  const perm = await Permission.findByPk(permId);

  const roleperm = await role.addPermission(perm);
  res.status(200).json({
    status: "succes",

    rm: roleperm,
  });
});

//role and permmision baseed
exports.restricTo = ({ permissionName }) => {
  return catchAsync(async (req, res, next) => {
    //roles ['admin','user']
    const permission = await Permission.findOne({
      where: { perm_name: permissionName },
    });
    if (!permission) {
      return next(
        new AppError("You do not have permission to perform this Action", 403)
      );
    }
    const rolePerm = await RolePermission.findOne({
      where: { RoleId: req.user.RoleId, PermissionId: permission.id },
    });
    if (!rolePerm) {
      return next(
        new AppError("You do not have permission to perform this Action", 403)
      );
    }

    next();
  });
};

exports.getUsers = catchAsync(async (req, res) => {
  const { limit, page } = req.query;
  const limit2 = limit || 10;
  const offset = (page - 1) * limit || 0;
  const users = await User.findAll({
    include: { model: Role },
    order: [["createdAt", "DESC"]],
    limit: limit2,
    offset: offset,
  });
  const count = await User.count();

  res.status(200).json({
    status: "seccess",
    length: count,

    data: users,
  });
});

exports.updateUsers = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  console.log("oooooooooooooooooooooooooooooooooooo");
  console.log(req.body);
  user.isActive = req.body.isActive;

  user.badge = req.body.badge;

  user.save();
  res.status(200).json({
    status: "seccess",
    data: user,
  });
});
exports.deleteUserByAdmin = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findByPk(id);

  user.destroy();
  res.status(200).json({
    status: "seccess",
    data: user,
  });
});
