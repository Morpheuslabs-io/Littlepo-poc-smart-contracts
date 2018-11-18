"use strict"

const path  = require("path");
const APIConnector  = require("./APIConnector");

//starting point
const NodeApp = function (app) {
    this.PORT = process.env.PORT || 3000;
    this.app = app;

    this.apiConnector = new APIConnector();
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

    this.app.get('/packer/scanharvester', (req,res) => {
        res.render('scanharvester.html');
    });

    this.app.get('/packer/addpackage', this.addPackage.bind(this));

    this.app.post('/packer/addpackage', this.packerPost.bind(this));

    this.app.get('/packer/packerSubmited', (req,res) => {
        res.render('packerResult.html');
    });

    // this.app.post('/packer/scanharvester', this.scanHarvester.bind(this));

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

    this.app.post('/littlepo', this.littlePost.bind(this));

    this.app.get('/littlepoSubmited', (req,res) => {
        res.render('littlepoResult.html');
    });

    this.app.get('/retailshop', (req,res) => {
        res.render('retailshop.html');
    });

    this.app.post('/retailshop', this.packerPost.bind(this));

    this.app.get('/retailshopSubmited', (req,res) => {
        res.render('retailshopResult.html');
    });

    this.app.get('/customer', (req,res) => {
        res.render('customer.html');
    });

    this.app.post('/customer', this.customerQuery.bind(this));
    
    // this.app.post('/api/levels', this.setUpLevel.bind(this));
}

NodeApp.prototype.login = function (req,res) {
    // console.log(req);
    // req.body.email == 
    res.redirect('/menu');
}

NodeApp.prototype.customerQuery = function (req,res) {
    let aRes = this.apiConnector.getProductBatch(req.body.qrCodeId);
    aRes.then((response) => {
        console.log("get data",response.data);

        res.render("queryResult.html", response.data);
    }).catch((error) => {
        // handle error
        console.log(error.config);
        res.render("error.html");
    });
}

NodeApp.prototype.harvestPost = function (req,res) {
    console.log(req.body);

    let aRes = this.apiConnector.trackProducyHarvester(req.body);
    aRes.then((response) => {
        console.log(response.data)
        res.render("harvesterResult.html", response.data);
    })
    .catch((error) => {
        // handle error
        console.log(error);
        res.render("error.html");
    });
}

NodeApp.prototype.packer = function (req,res) {
    console.log(req.body);
    // req.body.email == 
    res.redirect("/harvesterSubmited");
}

NodeApp.prototype.addPackage = function (req,res) {
    console.log(req.query);

    res.render('packer.html', req.query);
}

NodeApp.prototype.packerPost = function (req,res) {
    console.log("PackerPost",req.body);
    let aRes = this.apiConnector.getProductBatch(req.body.qrCodeId);
    aRes.then((response) => {
        console.log("get data",response.data);

        let packer = {};
        packer.bbatchNo = response.data.bbatchNo;
        data.packageType = req.body.packageType;
        data.productID = req.body.productID;
        data.productName = req.body.productName;

        let createPackerRes = this.apiConnector.trackProductPacker(packer);
        createPackerRes.then((resInner) => {
            console.log(resInner.data)
            res.render("packerResult.html", resInner.data);
        })
        .catch((error) => {
            // handle error
            console.log(error);
            res.render("error.html");
        });
    })
    .catch((error) => {
        // handle error
        console.log(error.config);
        res.render("error.html");
    });
}

NodeApp.prototype.addTeaBagPost = function (req,res) {
    console.log(req.body);
    // req.body.email == 
    res.redirect("/harvesterSubmited");
}

NodeApp.prototype.littlePost = function (req,res) {
    console.log(req.body);
    // req.body.email == 
    res.redirect("/littlepoSubmited");
}

NodeApp.prototype.bootup = function() {

    console.log("Started node app");
    this.app.listen(this.PORT, () => console.log(`App listening on port ${this.PORT}!`));
}

module.exports = NodeApp;
