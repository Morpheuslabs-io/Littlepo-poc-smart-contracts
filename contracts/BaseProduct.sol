pragma solidity ^0.4.24;

import "./Ownable.sol";

/**
 * Base product, all product will inheritance from this product
 */
contract BaseProduct {
    uint public version;
    uint public createdTime;
    string public productName;
    uint public productId;
    uint public containerId;
    uint public containerType;
    string public location;
    uint public legalEntity;
    uint public productBatchNo;
    uint public producerId;
    address public previousProduct;
}