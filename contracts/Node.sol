pragma solidity ^0.4.24;

import "./UserRole.sol";
import "./BaseProduct.sol";

interface Node {
    function createProductBatch() external returns(bool);
    function getProductBatchInfo(uint productBatchNo) external view returns (BaseProduct);

}