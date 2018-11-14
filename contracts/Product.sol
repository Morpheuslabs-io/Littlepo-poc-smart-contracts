pragma solidity ^0.4.24;

import "./BaseProduct.sol";

contract Product is BaseProduct {
    
    constructor(
        bytes32 _productId,
        bytes32 _productName,
        bytes32 _location,
        bytes32 _containerId,
        bytes32 _containerType
    ) public {
        productId = _productId;
        productName = _productName;
        location = _location;
        containerId = _containerId;
        containerType = _containerType;

        createdTime = now;
    }
}