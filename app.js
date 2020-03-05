const express = require('express');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const app = express();
const PORT = process.env.PORT || 5000;

app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set('view engine', 'handlebars');

//BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

const db = require('./config/db');
db.authenticate()
  .then(() => {
    console.log('Database connected...');
  })
  .catch(err => {
    console.log('Error: ' + err);
  });

app.get('/', (req, res) => res.render('index', { layout: 'landing' }));
app.use('/gigs', require('./routes/gigs'));

app.listen(PORT, () => {
  console.log(`Server runnning ${PORT}`);
});
