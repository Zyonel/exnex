import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   HARD CORS FIX (RENDER)
   MUST BE FIRST
========================= */
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://enex-hbk0.onrender.com"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

/* =========================
   ENSURE UPLOADS FOLDER
========================= */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* =========================
   ROUTES
========================= */
app.post("/upload", upload.single("receipt"), (req, res) => {
  res.json({
    success: true,
    file: req.file.filename,
  });
});

app.get("/uploads-list", (req, res) => {
  const files = fs
    .readdirSync("uploads")
    .filter((f) => /\.(png|jpg|jpeg|gif|pdf)$/i.test(f))
    .map((f) => `/uploads/${f}`);

  res.json(files);
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
