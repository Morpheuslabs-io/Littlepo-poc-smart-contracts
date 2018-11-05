pragma solidity ^0.4.24;

import "./BaseProduct.sol";

contract ProductHarvester is BaseProduct {
    uint public version = 1;

    constructor(
        uint _productId,
        string _productName,
        uint _productBatchNo,
        uint _legalEntity,
        string _location,
        uint _containerId,
        uint _containerType
    ) public {
        productId = _productId;
        productName = _productName;
        productBatchNo = _productBatchNo;
        legalEntity = _legalEntity;
        location = _location;
        containerId = _containerId;
        containerType = _containerType;

        createdTime = now;
    }
}