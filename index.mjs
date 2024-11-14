import express from "express";
import multer from "multer";
import path from "path";
import ejs from "ejs";
import fs from "fs";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Initialize express app
const app = express();
const port = 5000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Define storage settings for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the folder to store uploaded images
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using the current timestamp and the original file name
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Initialize Multer with storage configuration and file filters
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only image files are allowed!"), false); // Reject the file
    }
  },
});

// Middleware to handle JSON requests
app.use(express.json());

// Serve the homepage form
app.get("/", (req, res) => {
  res.render("index", { message: null });
});

// Handle file upload with Multer
app.post("/imageUpload", upload.single("avatar"), (req, res) => {
  // Check if the file is uploaded
  if (!req.file) {
    return res.render("index", { message: "No file uploaded" });
  }
  // If file is uploaded, render a success message and the uploaded file details
  res.render("index", {
    message: `File uploaded successfully: ${req.file.filename}`,
  });
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
