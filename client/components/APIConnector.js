"use strict";

const axios = require('axios');
const Util = require('./Util');

const APIConnector = function () {
    this.host = "localhost";
    this.port = 8080;
    this.nodeB ="/api/product/tracking/node-b";
    this.nodeD = "/api/product/tracking/node-d";
    this.nodeG = "/api/product/tracking/node-g";
    this.nodeI = "/api/product/tracking/node-i";

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
    const api = "/api/product/tracking/node-b";
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

    let phTrackingURL = Util.sprintf("http://{0}:{1}{2}", this.host, this.port, api);
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

    let phTrackingURL = Util.sprintf("http://{0}:{1}{2}", this.host, this.port, this.nodeD);
    console.log("Post to", phTrackingURL);
    return axios.post(phTrackingURL, data);
}

APIConnector.prototype.getProductBatch = function (qrCode) {
    let phTrackingURL = Util.sprintf("http://{0}:{1}{2}?qrCodeID={3}", this.host, this.port, this.nodeB, qrCode);
    console.log("Get data",phTrackingURL);
    return axios.get(phTrackingURL);
}

module.exports = APIConnector;