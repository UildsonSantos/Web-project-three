const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
require('dotenv').config()
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

require('../models/Postagem')
const cloudinary = require("cloudinary");
const Postagem = mongoose.model('postagens')
require('../handlers/cloudinary')
const upload = require('../handlers/multer')
const {estaLogado} = require('../helpers/eAdmin')


/*
router.get('/postagens', estaLogado,  (req, res) => {
  Postagem.find().sort({date: 'desc'}).then((postagens) => {
    res.render('/postagens/index', {postagens:postagens})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/')
    })
})
*/
router.get('/postagens', estaLogado, async(req, res) => {
      const post = await Postagem.find({})
      res.render('postagens/index', {
        post
      }).catch((err) => {
          req.flash('error_msg', 'Houve um erro interno')
          res.redirect('/')
      })
    })


router.get('/postagens/add', estaLogado, (req, res) => {
  res.render('admin/addpostagens')
})

router.get('/postagens/edit:id', estaLogado, (req, res) => {

    Postagem.findOne({_id: req.params.id}).then((postagens) => {
      res.render('admin/editpostagens', {postagens: postagens})

    }).catch((err) => {
        req.flash('error_msg', 'essa postagem nao existe')
        res.redirect('/postagens')
    })

  })


router.post('/postagens/edit',estaLogado, upload.single('image'),  (req, res)  => {

      Postagem.findOne({_id: req.body.id}).then(async(postagens) => {
        const result = await cloudinary.v2.uploader.upload(req.file.path) //nao tenho certeza
        console.log('o que esta:');
        console.log(result);
            postagens.title = req.body.title
            postagens.imageUrl = result.secure_url

            postagens.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso!")
            res.redirect("/postagens")
          }).catch((err) => {
              req.flash('error_msg', 'erro ao salvar a edição da postagem')

              res.redirect('/postagens')
          })

      }).catch((err) => {
          req.flash('error_msg', 'Erro, voce não modificou a postagem')
          res.redirect('/postagens')
      })
  })


router.post('/postagens/deletar', estaLogado, (req, res) => {
    Postagem.deleteOne({_id: req.body.id}).then(() => {
      req.flash("success_msg", "Postagem deletada com sucesso!")
      res.redirect('/postagens')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a postagem')
        res.redirect('/postagens')
    })

})


router.post('/postagens/nova', estaLogado, upload.single('image'), async (req, res) => {

      const result = await cloudinary.v2.uploader.upload(req.file.path)
      var newPost = {
        title:req.body.title,
        imageUrl: result.secure_url
      }


      new Postagem(newPost).save().then(() => {
      req.flash("success_msg", "Salvo com sucesso!")
      console.log('Postagem salva com sucesso!');
      res.redirect("/postagens")

      }).catch((err) => {
        req.flash("error_msg", "Erro ao salvar Postagem!")
        console.log('Erro ao salvar Postagem');
        res.redirect("/postagens")
      })
})



module.exports = router;
