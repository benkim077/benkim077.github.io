import express from 'express';

const app = express();
const port = 3000;

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
