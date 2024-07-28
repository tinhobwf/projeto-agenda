require('dotenv').config();
const express = require('express');
const app = express();

const mongoose = require('mongoose'); //conecto com a base de dados
mongoose.connect(process.env.CONNECTIONSTRING) 
  .then(() => {
    app.emit('pronto'); //emite um evento chamado 'pronto' que sera util ao ouvir o servidor
  })
  .catch(e => console.log(e));

const session = require('express-session'); //cria sessao de cada usuario
const MongoStore = require('connect-mongo'); //coloca a sessao dentro do banco de dados
const flash = require('connect-flash'); //posibilita a criaçao das flash messages
const routes = require('./routes'); //importo as rotas do arquivo 'routes.js'
const path = require('path');
const csrf = require('csurf'); //biblioteca de segurança oa envio de formulários
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middleware/middleware');

app.use(express.urlencoded({ extended: true })); //permite postar formularios para dentro da aplicaçao
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public'))); //permite o acesso a tudo dentro do arquivo public

const sessionOptions = session({ //gerencio como as sessions funcionarão
  secret: '   ',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});

app.use(sessionOptions); 
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views')); //direciono para onde o "espiao" das views vai atuar
app.set('view engine', 'ejs'); // mostro em qual arquivo ele vai atuar

app.use(csrf());
// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('pronto', () => { //apenas depois do evento 'pronto' ser emitido isso sera executado.
  app.listen(3003, () => { //vai ouvir o servidor na porta 3003
    console.log('Acessar http://localhost:3003');
    console.log('Servidor executando na porta 3003');
  });
});