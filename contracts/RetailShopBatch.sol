pragma solidity ^0.4.24;

import "./ProductBatch.sol";

contract RetailShopBatch is ProductBatch {
    // uint public version = 1;
    bytes32 public dxQRCodeId;
    uint public quantity;
    uint public price;
    uint public waterTemperature;

    // args1
    // bytes32 _nodeId,
    // bytes32 _productBatchId,
    // bytes32 _dxQRCodeId,
    // bytes32 _dBatchNo,
    // bytes32 _bBatchNo,
    // string _productName,
    // string _location,

    // args2
    // uint _productId,
    // uint _containerId,
    // uint _containerType,
    // uint _legalEntity,
    // uint _producerId,
    // uint _quantity,
    // uint _price,
    // uint _waterTemperature

    constructor(bytes32 _nodeId, bytes32[] bArgs, uint[] uArgs) public {
        nodeId = _nodeId;

        productBatchId = bArgs[0];
        dxQRCodeId = bArgs[1];
        dBatchNo = bArgs[2];
        bBatchNo = bArgs[3];
        productName = bArgs[4];
        location = bArgs[5];

        productId = uArgs[0];
        containerId = uArgs[1];
        containerType = uArgs[2];
        legalEntity = uArgs[3];
        producerId = uArgs[4];
        quantity = uArgs[5];
        price = uArgs[6];
        waterTemperature = uArgs[7];

        createdTime = now;
        dateTimeIn = now;
    }
}