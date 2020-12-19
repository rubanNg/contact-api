const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')
const contactRouter = require('./controllers/contact');
const authRouter = require('./controllers/auth');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json())


app.use('/api', contactRouter);
app.use('/auth', authRouter);



app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});