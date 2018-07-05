//dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
//schemas
var Animal = require('./Animal.js');
var Toy = require('./Toy.js');
//some settings: change view engine and default view location for .render
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
                                /*routes*/
//render form for toy creation
app.use('/toyform', (req, res) => {
    res.writeHead(200, {'Content-type': 'text/html'});
    fs.readFile('../forms/toyform.html', null, (err, data) => {
        if(err){
            res.status(404);
            res.write('I guess the file wasn\'t found');
        }else{
            res.write(data);
        }
        res.end();
    });
});
//handle the creation of a toy
app.use('/cr eatetoy', (req, res) => {
    var newToy = new Toy(req.body);
    newToy.save( (err) => {
        if(err){
            res.status('500');
            res.write('Error accured:' + err);
        }
        else{
            res.render('toy_created', {toy: newToy});
        }
    } );
});
//find toy
app.use('/findToy', (req, res) => {
    var query = {id: req.query.id};

    Toy.find(query, (err, toys) => {
        if(err){
            res.type('html').status('500');
            res.write('No such id in DB');
        }
        else if(toys){
            res.json(toys);
        }
        else{
            res.json({});
        }
    }).sort({'id': 'asc'});
});
//find Animals
app.use('/findAnimals', (req, res) => {
    var terms = [];

    if(req.query.species) { terms.push({ species: req.query.species }); }
    if(req.query.trait) { terms.push({traits: req.query.trait}); }
    if(req.query.gender) { terms.push({gender: req.query.gender}); }

    var query = { $and: terms };
    
    Animal.find(query, (err, animals) => {
        if(err){
            res.type('html').status(500);
            res.send('Error: ' + err);
        }
        else if(animals){
            res.json(animals);
        }
        else{
            res.json({});
        }
    }).sort({name: 'asc'});
});
//younger than
app.use('/animalsYoungerThan', (req, res) => {
    var condition;
    if(req.query.age) { condition = {$lt: req.query.age}; }
    var query = { age: condition };

    Animal.find(query, (err, animals) => {
        if(err) { 
            res.type('html').status(500);
            res.send('Error: ' + err);
        }
        else if(animals){
            let i = animals.length, result = {count: animals.length, names: []};
            while(i--){
                result.names.push(animals[i].name);
            }
            res.json(result);
        }
        else{
            res.json({});
        }
    });
});
//calculatePrice
app.use('/calculatePrice', (req, res) => {
    var ids, qtys;

    if(req.query.qty) { qtys = req.query.qty; }
    if(req.query.id) { ids = req.query.id; }

    var query = { id: ids };
    Toy.find(query, (err, toys) => {
        if(err){
            res.type('html').status(500);
            res.send('Error: ' + err);
        }
        else if(toys){
            var result = { totalPrice: 0, items: [] };
            var count = 0;
            
            toys.forEach(toy => {
                result.totalPrice += toy.price * qtys[count];
                item = { item: toy.id, qty: qtys[count], subtotal: toy.price * qtys[count] };
                result.items.push(item);
                count++;
            });

            res.json(result);
        }
        else{
            res.json({});
        }
    });
});

app.use('/', (req, res) => {
        res.json({ msg : 'It works!' });
    });

//confirmation that it works
app.listen(3000, () => {
	console.log('Listening on port 3000');
    });



// Please do not delete the following line; we need it for testing!
module.exports = app;