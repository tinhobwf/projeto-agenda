const express = require('express');
const routes = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

const { loginRequired } = require('./src/middleware/middleware'); //esse middleware impede o usuario de entrar caso nao esteja lgoado. //eu estou fazendo uma desestruturaçao nele, assim me é retornado apenas a funçao loginRequired

// Rota da Home
routes.get('/', homeController.index);

// Rotas de login

routes.get('/login/index', loginController.index);
routes.post('/login/register', loginController.register);
routes.post('/login/login', loginController.login);
routes.get('/login/logout', loginController.logout);

// Rotas de Contato

routes.get('/contato/index', loginRequired ,contatoController.index)
routes.post('/contato/register', loginRequired ,contatoController.register)
routes.get('/contato/index/:id', loginRequired ,contatoController.editIndex)
routes.post('/contato/edit/:id', loginRequired ,contatoController.edit)
routes.get('/contato/delete/:id', loginRequired ,contatoController.delete)

module.exports = routes;