const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const user = require('./router/api');
const port = 3000;

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(bodyParser.json()); 

app.use('/api', user);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

app.listen(port, function(){
    console.log("Server running on localhost:" + port);
});