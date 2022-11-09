const express = require("express");
const app = express();
const path = require("path");

const cors = require("cors");
const http = require("http");
const userRouter = require("./routers/userRouter");

const roleRouter = require("./routers/roleRouter");
const permissionRouter = require("./routers/permisstionRouter");

const AppError = require("./utils/appError");

const profileRouter = require("./routers/profileRouter");

const { Server } = require("socket.io");

app.use(cors());

app.use(express.json());
app.use(express.static(publicDirectoryPath));

app.use("/users", userRouter);
app.use("/role", roleRouter);
app.use("/permission", permissionRouter);
app.use("/profile", profileRouter);

app.all("*", (req, res, next) => {
  return next(new AppError("Page is not found kkkkkkkk", 404));
});

app.use(errHandling);
const server = http.createServer(app);

module.exports = server;
