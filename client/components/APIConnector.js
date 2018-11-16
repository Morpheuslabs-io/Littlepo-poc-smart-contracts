"use strict";

const axios = require('axios');

const APIConnector = function () {
    this.host = "localhost";
    this.port = 8889;

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
    const data = {};

    data.legalEntity = "LG0001";
    data.location = "21.187630, 105.781601";
    data.legalEntity = "LG0001";
    data.producerID = "Harvester01";
    data.packageType = harvester.packageType;
    data.productID = harvester.productID;
    data.productName = harvester.productName;

    let phTrackingURL = Util.sprintf("http://{0}:{1}{2}/{3}/{4}");

    axios.get(phTrackingURL, this.getHeader(ws.token))
    .then((response) => {
       return response.data;
    })
    .catch((error) => {
        // handle error
        this.log(error);
        return [];
    });
}

module.exports = APIConnector;