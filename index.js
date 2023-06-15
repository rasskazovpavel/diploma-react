const express = require("express");
const path = require("path");
const app = express();

const data_model = require("./data_model");

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.get("/", (req, res) => {
  console.log(req.query);
  data_model
    .PickData(req.query.cat, req.query.val, req.query.curr)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
