const express = require("express");
const path = require("path");
const app = express();
const port = 3001;

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

// app.get("/", (req, res) => {
//   data_model
//     .getData()
//     .then((response) => {
//       res.status(200).send(response);
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//     });
// });

app.get("/", (req, res) => {
  console.log(req.query);
  data_model
    .PickDataNew(req.query.cat, req.query.val)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../build")));

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});
