"use strict"

const path  = require("path");
const APIConnector  = require("./APIConnector");

//starting point
const NodeApp = function (app) {
    this.PORT = process.env.PORT || 3000;
    this.app = app;
    this.apiConnector = new APIConnector();

    this.nodeB ="node-b";
    this.nodeD = "node-d";
    this.nodeG = "node-g";
    this.nodeI = "node-i";

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
        // this.scanHarvesterBox.bind(this));
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

    this.app.post('/littlepo', this.littleScan.bind(this));

    this.app.post('/littleporeceive', this.littleCreateProductBatch.bind(this));

    // this.app.get('/littlepoSubmited', (req,res) => {
    //     res.render('littlepoResult.html');
    // });

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


    this.app.get('/productinfo', this.getProductInfo.bind(this));
    
    // this.app.post('/api/levels', this.setUpLevel.bind(this));
}

NodeApp.prototype.login = function (req,res) {
    // console.log(req);
    // req.body.email == 
    res.redirect('/menu');
}

NodeApp.prototype.getProductInfo = function (req,res) {
    console.log("get product Info", req.query);
    let nodeName;
    let aRes = this.apiConnector.getProductBatch(nodeName, req.query.qrCodeId);
    aRes.then((response) => {
        console.log("Get product info", response.data);
        res.render("productInfo.html", response.data);
    })
    .catch((error) => {
        // handle error
        console.log(error.response.data);
        res.render("error.html", error.response.data);
    });
}

NodeApp.prototype.customerQuery = function (req,res) {
    let aRes = this.apiConnector.getTrackingHistory(req.body.qrCodeId);
    aRes.then((response) => {
        console.log("Get Tracking history response",response.data);

        res.render("queryResult.html", response);
    }).catch((error) => {
        // handle error
        console.log(error.response.data);
        res.render("error.html", error.response.data);
    });
}

NodeApp.prototype.harvestPost = function (req,res) {
    console.log("Harvest tracking request",req.body);

    let aRes = this.apiConnector.trackProducyHarvester(req.body);
    aRes.then((response) => {
        console.log("Response", response.data);
        res.render("harvesterResult.html", response.data);
    })
    .catch((error) => {
        // handle error
        console.log(error);
        res.render("error.html",error.response.data);
    });
}

NodeApp.prototype.packer = function (req,res) {
    console.log(req.body);
    // req.body.email == 
    res.redirect("/harvesterSubmited");
}

NodeApp.prototype.addPackage = function (req,res) {
    console.log("Get Harvester Box Info", req.query);
    let aRes = this.apiConnector.getProductBatch(this.nodeB, req.query.qrCodeId);
    aRes.then((response) => {
        console.log("Product batch info", response.data);
        res.render('packer.html', req.query);
    })
    .catch((error) => {
        // handle error
        console.log(error.response.data);
        res.render("error.html", error.response.data);
    });
}

NodeApp.prototype.packerPost = function (req,res) {
    console.log("PackerPost",req.body);
    let aRes = this.apiConnector.getProductBatch(this.nodeB, req.body.qrCodeId);
    aRes.then((response) => {
        console.log("Get product data for packer", response.data);

        let packer = {};
        packer.bbatchNo = response.data.bbatchNo;
        packer.packageType = req.body.packageType;
        packer.productID = req.body.productID;
        packer.productName = req.body.productName;
        packer.weight = req.body.weight;

        let createPackerRes = this.apiConnector.trackProductPacker(packer);
        createPackerRes.then((resInner) => {
            console.log("Packer post response",resInner.data)
            res.render("packerResult.html", resInner.data);
        })
        .catch((error) => {
            // handle error
            console.log(error.response.data);
            res.render("error.html",error.response.data);
        });
    })
    .catch((error) => {
        // handle error
        console.log(error.response.data);
        res.render("error.html", error.response.data);
    });
}

NodeApp.prototype.addTeaBagPost = function (req,res) {
    console.log(req.body);
    // req.body.email == 
    res.redirect("/harvesterSubmited");
}

NodeApp.prototype.littleScan = function (req,res) {
    console.log("Get packer info", req.body);
    // check packer node
    let aRes = this.apiConnector.getProductBatch(this.nodeD, req.body.qrCodeId);
    aRes.then((response) => {
        response.data.weight = req.body.weight;
        console.log("response", response.data);
        res.render("littlepoInfo.html", response.data);
    })
    .catch((error) => {
        // handle error
        console.log(error.response.data);
        res.render("error.html", error.response.data);
    });
}

NodeApp.prototype.littleCreateProductBatch = function (req,res) {
    console.log("Receive package at little po", req.body);
    // check packer node
    let aRes = this.apiConnector.getProductBatch(this.nodeD, req.body.qrCodeId);
    aRes.then((response) => {
        let lpo = {};
        lpo.weight = req.body.weight;
        lpo.dQRCodeId = req.body.qrCodeId;
        
        // console.log("response", response.data);
        // res.render("littlepoInfo.html", response.data);
        let receivePackerRes = this.apiConnector.trackProductLittlepo(lpo);
        receivePackerRes.then((resInner) => {
            console.log("Receive Packer response",resInner.data);
            resInner.data.productName = response.data.productName;
            res.render("littlepoResult.html", resInner.data);
        }).catch((error) => {
            // handle error
            console.log(error.response.data);
            error.response.data.backURL="/littlepo";
            res.render("error.html", error.response.data);
        });
    })
    .catch((error) => {
        // handle error
        console.log(error.response.data);
        res.render("error.html", error.response.data);
    });
}

NodeApp.prototype.bootup = function() {

    console.log("Started node app");
    this.app.listen(this.PORT, () => console.log(`App listening on port ${this.PORT}!`));
}

module.exports = NodeApp;
