const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinary");

/* =====================
   CLOUDINARY STORAGE
===================== */
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "properties/others";

    if (file.fieldname === "cover") folder = "properties/cover";
    if (file.fieldname === "gallery") folder = "properties/gallery";
    if (file.fieldname === "map") folder = "properties/map";
    if (file.fieldname === "floorPlan") folder = "properties/floorPlan";
    if (file.fieldname === "documents") folder = "properties/documents";

    return {
      folder,
      resource_type:
        file.mimetype === "application/pdf" ? "raw" : "image",
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

/* =====================
   FILTER
===================== */
const fileFilter = (req, file, cb) => {
  const allowed =
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf";

  if (allowed) cb(null, true);
  else cb(new Error("Only images & PDFs allowed"), false);
};

/* =====================
   EXPORT
===================== */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = upload;
