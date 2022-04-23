const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({"message": "Welcome "});
});

require('./routes/userRoute')(app);


// listen for requests
app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});