const port = process.env.PORT || 5000;
const express = require("express");
const app = express();
const path = require("path");

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/dist"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.use(express.json());

module.exports = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);
