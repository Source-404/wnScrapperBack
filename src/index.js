const express = require("express");
require("./db/mongoose");
const cors = require("cors");
const userRouter = require("./routers/user");
const projRouter = require("./routers/project");
const eventRouter = require("./routers/event");

const app = express();
const port = process.env.PORT || 5006;

app.use(express.json());

app.use(
  cors({
    origin: ["https://source-404.github.io", "http://localhost:3000"],
  })
);
app.use(userRouter);
app.use(projRouter);
app.use(eventRouter);

app.get("", (req, res) => {
  res.send("Welcome to HTF");
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
