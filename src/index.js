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
app.use('/createtoy', (req, res) => {
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
app.use('/findtoy', (req, res) => {
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

app.use('/', (req, res) => {
        res.json({ msg : 'It works!' });
    });

//confirmation that it works
app.listen(3000, () => {
	console.log('Listening on port 3000');
    });



// Please do not delete the following line; we need it for testing!
module.exports = app;