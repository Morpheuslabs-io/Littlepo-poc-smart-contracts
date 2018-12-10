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
        res.redirect('/tracking');
    });

    this.app.get('/test', (req,res) => {
        res.render("test.html")
    });
    this.app.get('/test1', (req,res) => {
        res.render("test1.html")
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
        // this.scanHarvesterBox.bind(this);
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

    this.app.post('/retailshop', this.retailPost.bind(this));

    this.app.get('/retailshopSubmited', (req,res) => {
        res.render('retailshopResult.html');
    });

    // this.app.get('/tracking', (req,res) => {
    //     res.render('customer.html');
    // });

    this.app.get('/tracking', this.customerQuery.bind(this));


    this.app.get('/productinfo', this.getProductInfo.bind(this));
    
    // this.app.post('/api/levels', this.setUpLevel.bind(this));
}

NodeApp.prototype.login = function (req,res) {
    console.log("Login info",req.body);

    let user = this.apiConnector.login(req.body);
    console.log("Logined", user);
    if(!user) {
        res.render("login.html", {error: "ID or Password is incorrect"});
    }

    res.redirect(user.homeURL);
}

NodeApp.prototype.getProductInfo = function (req,res) {
    console.log("get product Info", req.query);
    let nodeName;
    let aRes = this.apiConnector.getProductBatch(nodeName, req.query.qrCodeId);
    aRes.then((response) => {
        console.log("Get product info", response.data);
        response.data.trackingQRCode = req.query.trackingQRCode;
        res.render("productInfo.html", response.data);
    })
    .catch((error) => {
        // handle error
        console.log(error.response.data);
        res.render("error.html", error.response.data);
    });
}

NodeApp.prototype.customerQuery = function (req,res) {
    if(!req.query.qrCodeId) {
        res.render('customer.html');
    }

    let aRes = this.apiConnector.getTrackingHistory(req.query.qrCodeId);
    aRes.then((response) => {
        console.log("Get Tracking history response",response.data);
        response.qrCodeId = req.query.qrCodeId;
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

        packer.productId = req.body.productId;
        // packer.productName = req.body.productName;
        packer.weight = req.body.weight+req.body.weightType;

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
        console.log(error);
        res.render("error.html", error.response.data);
    });
}

NodeApp.prototype.addTeaBagPost = function (req,res) {
    console.log("Add tea bag request", req.body);
    // private String dxQrCodeID;

	// private String dQRcodeID;
	// private String bBatchNo;
    // private String dBatchNo;
    
    // private String weight; // e.g. 15000 g
    
    // private String location;
	// private String packageType;
	// private String producerID;
    // private String legalEntity1;

    let aRes = this.apiConnector.getProductBatch(this.nodeD, req.body.packerQRCodeId);
    aRes.then((response) => {
        let packer = response.data;

        console.log("Response packer", packer);
        let teabag = {};

        teabag.dQRcodeID = req.body.packerQRCodeId;
        teabag.bbatchNo = packer.bbatchNo;
        teabag.dbatchNo = packer.dbatchNo;
        teabag.location = packer.location;
        teabag.producerID = packer.producerID;
        teabag.legalEntity = packer.legalEntity;
        // teabag.userID = teabag.userID
        teabag.weight = "100G";
        teabag.productId = req.body.productId;
        teabag.packageType = "bag";

        let teabagRes = this.apiConnector.addTeaBag(teabag);

        teabagRes.then((response) => {
            console.log("Teabag added", response.data);
            res.render("teabagAdded.html", response.data);
        }).catch((error) => {
            // handle error
            console.log(error.response.data);
            res.render("error.html", error.response.data);
        });
    })
    .catch((error) => {
        // handle error
        console.log(error.response.data);
        res.render("error.html", error.response.data);
    });
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
        lpo.weight = req.body.weight + req.body.weightType;
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

NodeApp.prototype.retailPost = function (req,res) {
    console.log("Retail post data", req.body);

    let aRes = this.apiConnector.getProductBatch(this.nodeD, req.body.dxQRCodeId);
    aRes.then((response) => {
        console.log("Receive teabag",response.data);
        let teacup = {};
        teacup.bBatchNo = response.data.bbatchNo;
        teacup.dBatchNo = response.data.dbatchNo;
        teacup.dxQrCodeID = req.body.dxQRCodeId;
        // teacup.productName = req.body.productName;
        teacup.location = response.data.location;
        teacup.productId = req.body.productId;
        teacup.packageType = req.body.packageType;
        teacup.producerID = 'RS0001';
        teacup.containerID = 'CO0001';
        teacup.containerType = 'BOX';
        teacup.legalEntity = response.data.legalEntity;
        teacup.qty = 1;
        teacup.price = req.body.price;
        teacup.waterTemperature = 100;

        let createTeaCupRes = this.apiConnector.trackProductAtShop(teacup);
        createTeaCupRes.then((resInner) => {
            console.log("Receive Packer response",resInner.data);
            resInner.data.productName = response.data.productName;
            res.render("retailshopResult.html", resInner.data);
        }).catch((error) => {
            // handle error
            console.log(error.response.data);
            error.response.data.backURL="/retailshop";
            res.render("error.html", error.response.data);
        });
    })
    .catch((error) => {
        // handle error
        console.log(error);
        res.render("error.html", error.response.data);
    });

}

NodeApp.prototype.bootup = function() {

    console.log("Started node app");
    this.app.listen(this.PORT, () => console.log(`App listening on port ${this.PORT}!`));
}

module.exports = NodeApp;
