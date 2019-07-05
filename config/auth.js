const localStrategy = require('passport-local')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// Modelo de usuario
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

module.exports = function(passport){

  // Usando como chave o email
  passport.use(new localStrategy({usernameField: 'email', passwordField:'senha'}, (email, senha, done) => {

      Usuario.findOne({email: email}).then((usuario) => {
          if(!usuario){
            return done(null, false,  { message: 'Esta conta nao existe'}) //console.log('esta conta nao existe')
          }

          bcrypt.compare(senha, usuario.senha, (erro, batem) => {

              if(batem){
                return done(null, usuario)
              }else {
                return done(null, false, { message: 'Senha incorreta'}) //, {console.log('esta conta nao existe');
              }
          })
      })
  }))

  passport.serializeUser((usuario, done) => {
      done(null, usuario.id)
  })

  passport.deserializeUser((id, done) => {
      Usuario.findById(id, (err, usuario) => {
          done(null, usuario)
      })

  })


}
