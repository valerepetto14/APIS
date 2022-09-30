const express = require('express')
const app = express()
const path = require('path');
const multer = require("multer");
const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'uploads', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
     cb(undefined, true)
  }
}) 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/file', imageUpload.single('image'), (req, res) => {
    res.send(req.file)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

app.listen(3000, () =>{
    console.log("andandooo")
})