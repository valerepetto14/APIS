const express = require('express')
const app = express()
const multer = require("multer");
const upload = multer({ dest: "uploads/" });//indicamos el destino de donde se guardaran las imagenes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/files", upload.single("files"), (req, res) =>{
    console.log(req.body);
    console.log(req.files);
    res.json({ message: "Successfully uploaded files" });
});

app.listen(3000, () =>{
    console.log("andandooo")
})