import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (/^image\/(png|jpe?g|webp)$/i.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only PNG/JPG/WEBP images allowed'));
};

export const uploadSingleImage = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter }).single('image');
