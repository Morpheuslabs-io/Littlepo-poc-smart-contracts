pragma solidity ^0.4.24;

import "./BaseProduct.sol";

interface BaseNode {
    function createProductBatch() external returns(bool);
    function getProductBatchInfo(string _productBatchNo) external view returns (BaseProduct);

}