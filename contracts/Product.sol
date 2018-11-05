pragma solidity ^0.4.24;

import "./BaseProduct.sol";

contract Product is BaseProduct {
    constructor(
        uint _productId,
        string _productName,
        string _location,
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