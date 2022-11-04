const express = require("express");
const app = new express();
var session = require('express-session');
const articleRouter = require('./routes/articlesPg');
const authRouter = require('./routes/auth');
const methodOverride = require('method-override');
const path = require('path')
const db = require('./db/index')
// mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true, useUnifiedTopology: true})
const cookieParser = require('cookie-parser');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));

app.use(cookieParser());
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'blog',
  secret: 'sysexe@2020',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 6000000
  }
}));
app.use(methodOverride('_method'));
app.use('/public', express.static(path.join(__dirname, 'public')))
app.get('/', async (req, res) => {
  let content = {};

  try {

    const articles = await db.query(`SELECT *
    FROM public.article
    ORDER BY createdAt DESC`);

    const user = req.session.user;
    console.log(user);
    content.user = user;
    content.articles = articles.rows;
    res.render('articles/index', {content : content});
  } catch (error) {
    console.log(error);
    res.render('articles/index',{ content: {}});
  }

})
app.use('/articles', articleRouter);
app.use('/auth', authRouter);

app.listen(process.env.PORT || 5000);