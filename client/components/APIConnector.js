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
    
    // this.USER_KEY = "LOGIN_USER";
}

APIConnector.prototype.signUp = function () {

}

APIConnector.prototype.login = function () {
    // const user = {};
    // user.id = "User01";
    // user.name = "User 01";
    // user.legalEntity = "LG01";

    // Storage.setItem();

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

APIConnector.prototype.getProductBatch = function (nodeName, qrCode) {
    let phTrackingURL = Util.sprintf("http://{0}:{1}{2}{3}?qrCodeID={4}", this.host, this.port, this.trackingAPI, nodeName, qrCode);
    console.log("Get product batch", phTrackingURL);
    return axios.get(phTrackingURL);
}

module.exports = APIConnector;