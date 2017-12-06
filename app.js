const express = require('express');
const exphbs  = require('express-handlebars');
const request = require('request');
const moment = require('moment');
const _ = require('lodash');
const bodyParser = require('body-parser');

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('views/assets'));

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
  res.render('blog');
});

app.get('/contacto', function(req, res){
  res.render('contacto');
});

app.listen(80, function(err, res){
  console.log('Si sirve');
});
