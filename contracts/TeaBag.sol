pragma solidity ^0.4.24;

import "./BaseProduct.sol";

contract TeaBag is BaseProduct {
    bytes32 public dBatchNo;
    // ==> args 1
    // bytes32 _nodeId, --> auto set

    // bytes32 _qrCodeId,
    // bytes32 _dBatchNo
    // bytes32 _bBatchNo,
    // bytes32 _productName,
    // bytes32 _location,
    // bytes32 _productId,
    // bytes32 _producerId,
    // bytes32 _containerId,
    // bytes32 _containerType,
    // bytes32 _legalEntity
    constructor(bytes32 _nodeId, bytes32[] bArgs) public {
        //args1
        nodeId = _nodeId;
        qrCodeId = bArgs[0];
        dBatchNo = bArgs[1];
        bBatchNo = bArgs[2];
        productName = bArgs[3];
        location = bArgs[4];
        productId = bArgs[5];
        producerId = bArgs[6];
        containerId = bArgs[7];
        containerType = bArgs[8];
        legalEntity = bArgs[9];

        //args2
        createdTime = now;
        dateTimeIn = now;
    }
}