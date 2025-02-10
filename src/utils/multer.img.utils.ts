import multer from "multer";
import * as path from "path";
import * as fs from "fs";
export class MulterImg {
  public static multer() {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads");
      },
      filename: function (req, file, cb) {
        const fileName: string = file.originalname.substr(
          0,
          file.originalname.lastIndexOf(".")
        );
        cb(null, fileName + "-" + Date.now() + path.extname(file.originalname));
      },
    });
    //500 KB
    const maxSize: number = 500 * 1024;

    const upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        const allowedMimes = ["image/jpeg", "image/png", "image/gif"];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error("Invalid file type"));
        }
      },
      limits: { fileSize: maxSize },
    }).array("images", 5);

    return upload;
  }
}
