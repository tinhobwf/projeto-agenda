const Contato = require('../models/ContatoModel')

exports.index = async (req, res) => {
  const contatos = await Contato.buscaContatos()
  res.render('index', { contatos }); //fazendo ({ }) nós injetamos os contatos dentro do index.
};