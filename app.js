if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const router = require("./routers");
const port = process.env.PORT || 4001;
const cors = require("cors");
const errMsg = require("./middlewares/errorHandle");

app.use(cors());
// app.get("/", (req, res) => {
//   res.send("Masuk");
// });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);
app.use(errMsg);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

module.exports = app;
