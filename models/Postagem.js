const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Postagem = new Schema({
    title:{
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now()
    },
    imageUrl:{
    type: String
  }

})


mongoose.model("postagens", Postagem)
