const express = require("express");
const app = express();
const path = require("path");

// public folder
app.use(express.static(path.join(__dirname, "public")));

// asst folder ahum serve panna
app.use("/asst", express.static(path.join(__dirname, "asst")));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
