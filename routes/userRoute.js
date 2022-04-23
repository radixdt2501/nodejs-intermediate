const multer = require('multer');
var multerS3 = require('multer-s3')
var AWS = require('aws-sdk');

AWS.config.update({
    secretAccessKey: process.env.SECRETKEY,
    accessKeyId: process.env.ACCESS_KEY,
    region: 'ap-south-1'
});
const s3 = new AWS.S3();

const authFunc = require('../auth/middleware');

var upload = multer({
    storage: multerS3({
        s3,
        bucket: 'bucketnew123',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})

module.exports = (app) => {
    const users = require('../controller/user.controller.js');

    // Create a new user
    app.post('/create', users.create);

    // Find all user
    app.get('/allUser', authFunc.authenticateToken, users.findAllUser);

    // Retrieve a single user with userId
    app.get('/users/:userId', users.findOne);

    // Update a user with userId
    app.put('/updateUsers', users.update);

    // Delete a user with userId
    app.delete('/deleteUsers/:id', users.delete);

    app.post('/login', users.logIn);

    // upload file into s3 object
    // app.post("/uploadFile", upload.single('photos'), users.fileuplod);

}