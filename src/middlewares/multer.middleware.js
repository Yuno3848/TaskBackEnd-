import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("inside multer");
    cb(null, "publicFol/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
