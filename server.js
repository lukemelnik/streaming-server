import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// I tried serving the files from '/' and found out that you don't have access to __dirname in ESM modules since they're supposed to work cross-platform and __dirname doesn't exist in the browser. So you have to create it like this:
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
  // add the chunk size to the start to find the end, or grab the end of the video. "-1 included because byte byte positions are 0-based i.e. for 500 bytes the last byte is 499"
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  // same thing with +1
  const contentLength = end - start + 1;
  // ok I get it now - so regardless of whether we handle it here, the browser is going to send a range request for a video starting with 0- (ie. "give me the whole video"). The server responds with a stream of a specific chunk, after which the client will send another request starting at the end of the last chunk.
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
