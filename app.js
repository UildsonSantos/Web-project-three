const express = require('express');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin');
const path = require('path');
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
const {estaLogado} = require('./helpers/eAdmin')

const usuarios = require('./routes/usuario');
const passport = require('passport')
require("./config/auth")(passport)

const db = require('./config/db')


require('dotenv').config()
const cloudinary = require("cloudinary");
require('./handlers/cloudinary')
const upload = require('./handlers/multer')


// Configuraçõelse
  // Sessão
    app.use(session({
      secret: 'project-web-2',
      resave: true,
      saveUninitializer: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
  // Middleware
    app.use((req, res, next) => {

      res.locals.success_msg = req.flash("success_msg")
      res.locals.error_msg = req.flash("error_msg")
      res.locals.error = req.flash('error')
      res.locals.user = req.user || null;
      next()
    })
  // handlebars
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json())
    app.engine('handlebars', handlebars({defautLayout: 'main'}))
    app.set('view engine', 'handlebars')

  // viewas
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(__dirname + '/public'));
  // mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect(db.mongoURI).then(()=>{
      console.log('Conectado ao mongo')
    }).catch((err) => {
      console.log(' Erro ao se conectar: '+err);
    })

// Rotas principais
// Pag sem usuarios
app.get('/',(req, res) => {
    res.render('indexx')
  })

app.get('/404',(req, res) => {
  res.send('Erro 404!')
})


// Pag com usuarios logados posso excluir
app.get('/post', estaLogado, (req, res) => {
  res.render('/postagens/index')
})

app.get('/postagens', estaLogado, (req, res) => {
  Postagem.find().sort({date: 'desc'}).then((postagens) => {
    res.render('postagens/index', {postagens: postagens})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/404')
    })
  })




app.use('/admin', admin)
app.use('/usuarios', usuarios)

// Outros
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('servidor no ar');
})
