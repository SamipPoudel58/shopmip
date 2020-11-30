// const fs = require("fs");
const { cloudinary } = require("./cloudinary");

// const deleteFile = (filePath) => {
//   fs.unlink(filePath, (err) => {
//     if (err) {
//       throw err;
//     }
//   });
// };

const deleteFile = (public_id) => {
  return cloudinary.uploader.destroy(public_id);
};

exports.deleteFile = deleteFile;
