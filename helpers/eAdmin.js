module.exports = {
  estaLogado: function(req, res, next){
    if(req.isAuthenticated() && req.user.eAdmin == 1){
      return next()
    }
    req.flash('error_msg', ' Voce não está logado')
    res.redirect('/')
  }
}
