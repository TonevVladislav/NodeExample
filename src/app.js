const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRouter = require("./routes/auth.route.js");
const userRouter = require("./routes/user.routes.js");
const ethRouter = require("./routes/eth.routes.js");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/", (_req, res) => {
  res.json({ ping: "pong" });
});

app.use("/v1/auth", authRouter);
app.use("/v1/users", userRouter);
app.use("/v1/eth", ethRouter);

module.exports = app;
