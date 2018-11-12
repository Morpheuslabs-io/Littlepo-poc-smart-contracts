pragma solidity ^0.4.24;

import "./BaseNode.sol";
import "./LittlepoBatch.sol";

contract LittlepoNode is BaseNode {
    bytes32 constant NODE_NAME = "LittlepoNode";

    function createProductBatch(bytes32[] bArgs) external onlyOperator returns (bool){
        require(littlepoProductHistory != address(0), "Storage is not config yet");

        LittlepoBatch ph = new LittlepoBatch (NODE_NAME,bArgs);

        // add litlePohistory as operator
        productBatches[ph.productBatchId()] = ph;

        ph.addOperator(littlepoProductHistory);
        littlepoProductHistory.updateTrackingInfo(ph.dBatchNo(), ph);

        return true;
    }
}