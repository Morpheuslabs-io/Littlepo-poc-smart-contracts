pragma solidity ^0.4.24;

import "./ProductBatch.sol";

contract Product is ProductBatch {
    
    constructor(
        uint _productId,
        bytes32 _productName,
        bytes32 _location,
        uint _containerId,
        uint _containerType
    ) public {
        productId = _productId;
        productName = _productName;
        location = _location;
        containerId = _containerId;
        containerType = _containerType;

        createdTime = now;
    }
}