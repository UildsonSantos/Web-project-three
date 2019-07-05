if(process.env.NODE_ENV == 'production'){
  module.exports = {mongoURI:'mongodb+srv://image-user:qwerty123@cluster0-09h9n.mongodb.net/test?retryWrites=true&w=majority'}

}else {
  module.exports = {mongoURI:'mongodb://localhost/projeto-2-web'}
}
