pragma solidity ^0.4.24;

import "./ProductBatch.sol";

contract RetailShopBatch is ProductBatch {
    // uint public version = 1;
    bytes32 public dxQRCodeId;
    bytes32 public dBatchNo;
    bytes32 public quantity;
    bytes32 public price;
    bytes32 public waterTemperature;

    // args1
    // bytes32 _nodeId,
    // bytes32 _qrCodeId,
    // bytes32 _dxQRCodeId,
    // bytes32 _dBatchNo,
    // bytes32 _bBatchNo,
    // bytes32 _productName,
    // bytes32 _location,
    // bytes32 _productId,
    // bytes32 _containerId,
    // bytes32 _containerType,
    // bytes32 _legalEntity,
    // bytes32 _producerId,
    // bytes32 _quantity,
    // bytes32 _price,
    // bytes32 _waterTemperature

    constructor(bytes32 _nodeId, bytes32[] bArgs) public {
        nodeId = _nodeId;

        qrCodeId = bArgs[0];
        dxQRCodeId = bArgs[1];
        dBatchNo = bArgs[2];
        bBatchNo = bArgs[3];
        productName = bArgs[4];
        location = bArgs[5];

        productId = bArgs[6];
        containerId = bArgs[7];
        containerType = bArgs[8];
        legalEntity = bArgs[9];
        producerId = bArgs[10];
        quantity = bArgs[11];
        price = bArgs[12];
        waterTemperature = bArgs[13];

        createdTime = now;
        dateTimeIn = now;
    }
}