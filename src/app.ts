import express from 'express';

const app = express();
const port = 3000;

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', { title: 'Ben의 기술 블로그', description: '반갑습니다. 웹 프론트엔드 개발자 Ben입니다.', message: 'Hello there!' });
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
