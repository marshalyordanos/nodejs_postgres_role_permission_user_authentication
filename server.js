const server = require("./app");
const sequelize = require("./db");
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;

dotenv.config({
  path: "./config.env",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Error.");
  });

sequelize
  .sync({ force: false })
  .then((res) => {
    server.listen(port, () => {
      console.log(`server is listening on port ${port}........... `);
    });
  })
  .catch((err) => {
    console.log(err);
  });
