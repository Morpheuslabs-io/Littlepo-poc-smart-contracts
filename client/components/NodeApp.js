"use strict"

const path  = require("path");
//starting point
const NodeApp = function (app) {
    this.PORT = process.env.PORT || 3000;
    this.app = app;
    //test
    this.init();
}
NodeApp.prototype.init = function () {

    this.app.get('/', (req,res) => {
        res.redirect('/login');
    });

    this.app.get('/login', (req,res) => {
        res.render('login.html');
    });
    this.app.post('/login', this.login.bind(this));

    this.app.get('/menu', (req,res) => {
        res.render('menu.html');
    });

    this.app.get('/harvester', (req,res) => {
        res.render('harvester.html');
    });

    this.app.post('/harvester', this.harvestPost.bind(this));

    this.app.get('/harvesterSubmited', (req,res) => {
        res.render('harvesterResult.html');
    });

    this.app.get('/packer', (req,res) => {
        res.render('packerMenu.html');
    });

    this.app.get('/packer/addpackage', (req,res) => {
        res.render('packer.html');
    });
    this.app.post('/packer/addpackage', this.packerPost.bind(this));

    this.app.get('/packer/packerSubmited', (req,res) => {
        res.render('packerResult.html');
    });

    this.app.get('/packer/addteabag', (req,res) => {
        res.render('addteabag.html');
    });

    this.app.post('/packer/addteabag', this.addTeaBagPost.bind(this));

    this.app.get('/packer/teabagadded', (req,res) => {
        res.render('teabagAdded.html');
    });

    this.app.get('/littlepo', (req,res) => {
        res.render('littlepo.html');
    });

    this.app.post('/littlepo', this.packerPost.bind(this));

    this.app.get('/littlepoSubmited', (req,res) => {
        res.render('littlepoResult.html');
    });

    this.app.get('/littlepo', (req,res) => {
        res.render('littlepo.html');
    });

    this.app.post('/littlepo', this.packerPost.bind(this));

    this.app.get('/littlepoSubmited', (req,res) => {
        res.render('littlepoResult.html');
    });
    
    // this.app.post('/api/levels', this.setUpLevel.bind(this));
}

NodeApp.prototype.login = function (req,res) {
    // console.log(req);
    // req.body.email == 
    res.redirect('/menu');
}

NodeApp.prototype.harvestPost = function (req,res) {
    console.log(req.body);
    // req.body.email == 
    res.redirect("/harvesterSubmited");
}

NodeApp.prototype.packerPost = function (req,res) {
    console.log(req.body);
    // req.body.email == 
    res.redirect("/harvesterSubmited");
}

NodeApp.prototype.addTeaBagPost = function (req,res) {
    console.log(req.body);
    // req.body.email == 
    res.redirect("/harvesterSubmited");
}

NodeApp.prototype.bootup = function() {

    console.log("Started node app");
    this.app.listen(this.PORT, () => console.log(`App listening on port ${this.PORT}!`));
}

module.exports = NodeApp;
