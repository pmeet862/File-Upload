const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json({ limit: "50mb" }));

app.use("/js", express.static(path.resolve(__dirname, "scripts")));
const storege = multer.diskStorage({
  destination: (req, file, cb) => {
    var destinationPath = "Uploaded_Files/";
    var ext = path.extname(file.originalname);

    if (ext === ".png" || ext === ".jpg" || ext === ".gif" || ext === ".jpeg") {
      destinationPath += "images/";
      console.log("img");
    } else if (ext === ".pdf" || ext === ".docx") {
      destinationPath += "documents/";
      console.log("doc");
    }
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storege,
  fileFilter: (req, file, cb) => {
    var ext = path.extname(file.originalname);
    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".gif" &&
      ext !== ".jpeg" &&
      ext !== ".pdf" &&
      ext !== ".docx"
    ) {
      return cb(new Error("Only images and documents are allowed"));
    }
    cb(null, true);
  },
});

const PORT = 3000;

app.set("view engine", "ejs");

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.post("/upload", upload.single("uploaded_file"), (req, res) => {
  var file_data = req.file.buffer;
  console.log(file_data);
  // var encoded = file_data.toString("base64");
  console.log(encoded);
  res.send("File uploaded successfully");
});

app.post("/upload2", (req, res) => {
  // console.log(req.body);
  var file_data = req.body.data;
  // console.log(file_data);
  let base64Data = file_data.split(",")[1];
  const fileContents = Buffer.from(base64Data, "base64");
  let extension = file_data.split(";")[0];
  extension = extension.split("/")[1];
  console.log("ext", extension);

  const fileName = `${Date.now()}.${extension}`;
  let folder = "default";
  if (
    extension === "png" ||
    extension === "jpg" ||
    extension === "gif" ||
    extension === "jpeg"
  ) {
    folder = "images";
  } else if (extension === "pdf" || extension === "docx") {
    folder = "documents";
  }

  let folderPath = path.resolve(
    __dirname,
    `Uploaded_files/${folder}/${fileName}`
  );
  console.log("path", folderPath);
  if (
    extension === "png" ||
    extension === "jpg" ||
    extension === "gif" ||
    extension === "jpeg" ||
    extension === "pdf" ||
    extension === "docx"
  ) {
    fs.writeFile(folderPath, fileContents, (err) => {
      if (err) return console.error(err);
      console.log("file saved to ", fileName);
    });
    res.status(200);
    res.send({ msg: "File uploaded successfully" });
  } else {
    res.send({ msg: "Only images and documents are allowed" });
  }
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(404).send(err.message);
});

app.listen(PORT, () => {
  console.log(`server is started on http://localhost:${PORT}/upload`);
});
