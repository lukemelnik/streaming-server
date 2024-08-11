import express from "express";

const app = express();

app.use(express.static("public"));

app.listen(4321, () => {
  console.log("listening on port 4321");
});
