const express = require('express');
const path = require('path');
const router = require('./routes/router');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public'))); // para servir archivos estaticos não mais usado.

app.use('/api', router);

app.get('/', (req, res) => {
  res.render('home')
});



const PORT = 3000;
app.listen(PORT, () =>  {console.log(`Servidor http://localhost:${PORT}`)})


module.exports = app;

