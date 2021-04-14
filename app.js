require('dotenv/config');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose =  require('mongoose');

const multer = require('multer')
const uuid = require('uuid').v4;

const app = express();
const userRoutes = require('./routes/user');
const AWS = require('aws-sdk')


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/AWS', { useNewUrlParser: true,useUnifiedTopology: true }).then(() => {
    console.log("Connected to MongoDB successfully :)");
}).catch((e) => {
    console.log("Error while attempting to connect to MongoDB");
    console.log(e);
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);



app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/user' , userRoutes);



//For Preventing CORS Errors
app.use((req,res,next)=>{
    res.header("Acess-Conttrol-allow-Origin",'*');
    res.header("Acess-Conttrol-allow-Origin",'Origin ,X-Requested-With,Content-TypeError,Accept,Authorization');
    if(req.method === 'OPTIONS'){
        res.header ('Access-Control-Allow-Methods,PUT,POST,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();
});

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_SECRET;
AWS.config.region = "ap-south-1";

const s3 = new AWS.S3()

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})


const upload = multer({storage}).single('image')

app.post('/upload',upload,(req,res)=>{
   
    let myImage = req.file.originalname.split(".")
    const imageType = myImage[myImage.length-1]
    const params = {
        Bucket :process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}.${imageType}`,
        Body: req.file.buffer,
        currentTime:Date.now(),
        expiryTime: "60*60*24*2"
    }
    s3.upload(params, (error,data)=>{
    if(error){
        res.status(500).send(error)
    }
    res.status(200).send(data)
    })
})



module.exports = app;         