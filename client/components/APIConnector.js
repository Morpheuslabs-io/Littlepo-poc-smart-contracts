"use strict";

const axios = require('axios');
const Util = require('./Util');

const APIConnector = function () {
    this.host = "localhost";
    this.port = 8080;
    this.trackingAPI= "/api/product/tracking/";

    this.nodeB ="node-b";
    this.nodeD = "node-d";
    this.nodeG = "node-g";
    this.nodeI = "node-i";

    this.users = new Map();

    this.init();
}


APIConnector.prototype.init = function () {
    let harvester = {};
    harvester.id = "HV0001";
    harvester.password = "password";
    harvester.homeURL = "/harvester";

    let packer = {};
    packer.id = "PK0001";
    packer.password = "password";
    packer.homeURL = "/packer";

    let littepo = {};
    littepo.id = "LP0001";
    littepo.password = "password";
    littepo.homeURL = "/littlepo";

    let retail = {};
    retail.id = "RS0001";
    retail.password = "password";
    retail.homeURL = "/retailshop";

    this.users.set(harvester.id, harvester);
    this.users.set(packer.id, packer);
    this.users.set(littepo.id, littepo);
    this.users.set(retail.id, retail);
}

APIConnector.prototype.login = function (user) {
    return this.users.get(user.id);
}

APIConnector.prototype.logout = function () {

}

APIConnector.prototype.querybyQRId = function () {

}

APIConnector.prototype.querybyBNo = function () {

}

APIConnector.prototype.getProductBatchDetail = function (pbId) {

}

APIConnector.prototype.generateQRCode = function () {

}

APIConnector.prototype.createProductBatch = function (nodeId, args) {

}

APIConnector.prototype.createProduct = function (args) {

}

APIConnector.prototype.createLegalEntity = function (args) {

}

APIConnector.prototype.getTrackingHistory = function (qrCodeId) {

}

APIConnector.prototype.trackProducyHarvester = function (harvester) {
    // const api = "/api/product/tracking/node-b";
    // "bbatchNo": "string",
    // "bqrCodeID": "string",
    // "createTime": "string",
    // "nodeID": "string",
    // "nodeType": "string",
    // "userID": "string"  

    const data = {};

    data.legalEntity = "HV0001";
    data.location = "21.187630, 105.781601";
    data.legalEntity = "LG0001";
    data.producerID = "Harvester01";
    data.userID = "User01";
    data.packageType = harvester.packageType;
    data.productID = harvester.productID;
    data.productName = harvester.productName;

    let phTrackingURL = Util.sprintf("http://{0}:{1}{2}{3}", this.host, this.port, this.trackingAPI, this.nodeB);
    console.log("Post to",phTrackingURL);
    return axios.post(phTrackingURL, data);
}

APIConnector.prototype.trackProductPacker = function (packer) {
    console.log("Create new packer request", packer);
    // "bbatchNo": "string",
    // "bqrCodeID": "string",
    // "createTime": "string",
    // "nodeID": "string",
    // "nodeType": "string",
    // "userID": "string"  

    const data = {};

    data.legalEntity = "PACKER0001";
    data.location = "21.187630,105.781601";
    data.producerID = "Packer01";
    data.userID = "User02";
    data.bbatchNo = packer.bbatchNo;
    data.packageType = packer.packageType;
    data.productID = packer.productID;
    data.productName = packer.productName;
    data.weight = packer.weight;

    let phTrackingURL = Util.sprintf("http://{0}:{1}{2}{3}", this.host, this.port, this.trackingAPI, this.nodeD);
    console.log("Post to", phTrackingURL);
    return axios.post(phTrackingURL, data);
}

APIConnector.prototype.trackProductLittlepo = function (lpo) {
    // console.log("Request to receive package for littlepo", lpo);
    // bytes32 _qrCodeId,
    // bytes32 _location,
    // bytes32 _producerId,
    // bytes32 _weight 
    const data = {};

    data.location = "21.187630,105.781601";
    data.producerID = "Little01";
    data.userID = "LUser01";
    data.weight = lpo.weight;
    data.dQRcodeID = lpo.dQRCodeId;

    let phTrackingURL = Util.sprintf("http://{0}:{1}{2}{3}", this.host, this.port, this.trackingAPI, this.nodeG);
    console.log("Receive package at little po data", data, "url", phTrackingURL);
    return axios.post(phTrackingURL, data);
}

APIConnector.prototype.addTeaBag = function (teabag) {
    // console.log("Request to receive package for littlepo", lpo);
    // bytes32 _qrCodeId,
    // bytes32 _location,
    // bytes32 _producerId,
    // bytes32 _weight 
    // teabag.location = "21.187630,105.781601";
    // teabag.producerID = "Little01";
    teabag.userID = "DTUser01";

    let phTrackingURL = Util.sprintf("http://{0}:{1}{2}{3}{4}", this.host, this.port, this.trackingAPI, this.nodeD, "/teabag");
    console.log("Add teabag", teabag, "url", phTrackingURL);
    return axios.post(phTrackingURL, teabag);
}

APIConnector.prototype.trackProductAtShop = function(teacup) {
    let phTrackingURL = Util.sprintf("http://{0}:{1}{2}{3}", this.host, this.port, this.trackingAPI, this.nodeI);
    console.log("Create teacup", teacup, "url", phTrackingURL);
    return axios.post(phTrackingURL, teacup);
}



APIConnector.prototype.getProductBatch = function (nodeName, qrCode) {
    let phTrackingURL = "";
    if(nodeName) {
        phTrackingURL = Util.sprintf("http://{0}:{1}{2}{3}?qrCodeID={4}", this.host, this.port, this.trackingAPI, nodeName, qrCode);
    } else {
        phTrackingURL = Util.sprintf("http://{0}:{1}{2}?qrCodeID={3}", this.host, this.port, "/api/product/productbatch/qrcode", qrCode);
    }
    console.log("Get product batch", phTrackingURL);
    return axios.get(phTrackingURL);
}

APIConnector.prototype.getTrackingHistory = function (qrCode) {
    let trackingHistory = '/api/product/trackinghistory';
    let phTrackingURL = Util.sprintf("http://{0}:{1}{2}?qrCodeID={3}", this.host, this.port, trackingHistory, qrCode);
    console.log("get product tracking history", phTrackingURL);
    return axios.get(phTrackingURL);
}

module.exports = APIConnector;