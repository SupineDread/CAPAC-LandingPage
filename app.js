const express = require('express');
const exphbs  = require('express-handlebars');
const request = require('request');
const moment = require('moment');
const _ = require('lodash');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('views/assets'));

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arcaniteamp@gmail.com',
    pass: 'trxtrxtrx'
  }
});

const API_CAPAC = 'http://104.236.144.72/api/v1';

app.get('/', function(req, res){
  request.get(`${API_CAPAC}/evento`, (err, response, body) => {
    if(err) return res.render('home', {evento: {err: 'No se pudieron cargar los eventos.'}});
    let evento = JSON.parse(body).reverse()[0];
    return res.render('home', {evento});
  });
});

app.get('/nosotros', function(req, res){
  res.render('nosotros');
});

app.get('/servicios', function(req, res){
  res.render('servicios');
});

app.get('/eventos-proximos', function(req, res){
  request.get(`${API_CAPAC}/evento`, (err, response, body) => {
    if(err) return res.render('home', {evento: {err: 'No se pudieron cargar los eventos.'}});
    let eventos = JSON.parse(body).reverse();
    return res.render('eventosproximos', {eventos, moment});
  });
})

app.get('/galeria', function(req, res) {
  request.get(`${API_CAPAC}/galeria`, (err, response, body) => {
    if(err) return res.render('home', {evento: {err: 'No se pudieron cargar las galerias.'}});
    let galerias = JSON.parse(body).reverse();
    return res.render('galeria', {galerias, moment});
  });
});

app.get('/blog', function(req, res){
  request.get(`${API_CAPAC}/entrada`, (err, response, body) => {
    if(err) return res.render('home', {evento: {err: 'No se pudieron cargar las entradas del blog.'}});
    let entradas = JSON.parse(body).reverse();
    return res.render('blog', {entradas: entradas.map(e => {
      let temp = e;
      temp.createdAt = moment(e.createdAt).format('DD/MM/YYYY');
      return temp;
    })});
  });
});

app.get('/contacto', function(req, res){
  res.render('contacto');
});

app.post('/send', (req, res) => {
  transport.sendMail({
    from: 'CAPAC INFO <arcaniteamp@gmail.com>',
    to: 'hazielfe@gmail.com',
    subject: 'CAPAC INFO',
    html: `
      <h1>CAPAC INFO</h1><br>
      <p><strong>Nombre: </strong>${req.body.name}</p><br>
      <p><strong>Email: </strong>${req.body.to}</p><br>
      <p><strong>Telefono: </strong>${req.body.phone}</p><br>
      <p><strong>Asunto: </strong>${req.body.subject}</p><br>
      <p><strong>Mensaje: </strong>${req.body.message}</p><br>
    `
  }, (err, response) => {
    if(err) {
      console.log(err);
      res.render('home', {err: 'No se pudo enviar el formulario.'});
    } else {
      console.log(response);
      res.redirect('/contacto');
    }
  });
});

app.listen(80, function(err, res){
  console.log('Si sirve');
});
