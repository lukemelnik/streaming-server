import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static("public"));

app.get("/video", (req, res) => {
  console.log(req.headers);
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("requires range header");
  }
  const videoPath = "video.mp4";
  // calculate total video size
  const videoSize = fs.statSync(videoPath).size;
  const CHUNK_SIZE = 10 ** 6; // 1MB
  // request will show up with Range as "bytes=232323-" with the dash meaning the rest of the bytes after that point. Here we take out all non-digit characters to convert it to a number.
  const start = Number(range.replace(/\D/g, ""));
  // add the chunk size to the start to find the end, or grab the end of the video
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, {
    start,
    end,
  });
  videoStream.pipe(res);
});

app.listen(4321, () => {
  console.log("listening on port 4321");
});
