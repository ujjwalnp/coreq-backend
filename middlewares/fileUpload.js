const multer = require('multer')

/* Define storage for profile pic uploads */
const profilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Destination folder where profile pics will be uploaded
    cb(null, 'uploads/profile/profile_pics/')
  },
  filename: function (req, file, cb) {
    // Define the filename for profile pics
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'profile_pic-' + uniqueSuffix)
  }
})

/* Define storage for cover pic uploads */
const coverPicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Destination folder where cover pics will be uploaded
    cb(null, 'uploads/profile/cover_pics/')
  },
  filename: function (req, file, cb) {
    // Define the filename for cover pics
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'cover_pic-' + uniqueSuffix)
  }
})

/* Define storage for PDF uploads */
const articlePDFStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Destination folder where PDFs will be uploaded
    cb(null, 'uploads/article/pdfs/')
  },
  filename: function (req, file, cb) {
    // Define the filename for PDFs
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `article-${uniqueSuffix}-${file.originalname}`)
  }
})

const archivePDFStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Destination folder where PDFs will be uploaded
      cb(null, 'uploads/archive/pdfs/')
    },
    filename: function (req, file, cb) {
      // Define the filename for PDFs
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, `archive-${uniqueSuffix}-${file.originalname}`)
    }
})

const projectPDFStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Destination folder where PDFs will be uploaded
      cb(null, 'uploads/project/pdfs/')
    },
    filename: function (req, file, cb) {
      // Define the filename for PDFs
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, `project-${uniqueSuffix}-${file.originalname}`)
    }
})
  


/* File filter function to accept only certain file types */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // For image files (profile pic and cover pic)
    cb(null, true)
  } else if (file.mimetype === 'application/pdf') {
    // For PDF files
    cb(null, true)
  } else {
    cb(new Error('Unsupported file type'), false)
  }
};

/* Set up multer with the configurations */
const profilePicUpload = multer({ storage: profilePicStorage, fileFilter: fileFilter })
const coverPicUpload = multer({ storage: coverPicStorage, fileFilter: fileFilter })
const articlePDFUpload = multer({ storage: articlePDFStorage, fileFilter: fileFilter })
const archivePDFUpload = multer({ storage: archivePDFStorage, fileFilter: fileFilter })
const projectPDFUpload = multer({ storage: projectPDFStorage, fileFilter: fileFilter })

module.exports = {
  profilePicUpload,
  coverPicUpload,
  articlePDFUpload,
  archivePDFUpload,
  projectPDFUpload
}