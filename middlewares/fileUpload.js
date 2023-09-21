const multer = require('multer')

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
}

/* Define storage for profile pic uploads */
const pictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Destination folder where profile pics will be uploaded
    cb(null, 'uploads/profile/')
  },
  filename: function (req, file, cb) {
    // Define the filename for profile pics
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'pic-' + uniqueSuffix)
  }
})

/* Set up multer with the configurations for profilePic and coverPic upload */
const pictureUpload = multer({ storage: pictureStorage, fileFilter: fileFilter })

// Custom middleware to handle both profile and cover pictures
const handleProfileAndCoverPics = (req, res, next) => {
  // Use the same field name 'file' for both profilePic and coverPic in the form
  pictureUpload.fields([{ name: 'profilePic', maxCount: 1 }, { name: 'coverPic', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload error', error: err.message })
    }
    next()
  })
}

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
  



/* Set up multer with the configurations */
const articlePDFUpload = multer({ storage: articlePDFStorage, fileFilter: fileFilter })
const archivePDFUpload = multer({ storage: archivePDFStorage, fileFilter: fileFilter })
const projectPDFUpload = multer({ storage: projectPDFStorage, fileFilter: fileFilter })

module.exports = {
  handleProfileAndCoverPics,
  articlePDFUpload,
  archivePDFUpload,
  projectPDFUpload
}