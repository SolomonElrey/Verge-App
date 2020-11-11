const express = require('express');
const bodyParser = require('body-parser');
const verge1 = require('./dbRoute');

let app = express();
let port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.listen(port, () => {
    console.log(`Application Listening on port ${port}`)
});

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Welcome to Verge App'
    })
})

app.use('/api/v1', verge1);

module.exports = app