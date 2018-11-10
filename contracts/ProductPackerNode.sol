pragma solidity ^0.4.24;

import "./BaseNode.sol";
import "./PackerBatch.sol";

contract ProductPackerNode is BaseNode {
    bytes32 constant NODE_NAME = "PackerNode";

    // input format
    // bytes32 _productBatchId,
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
    // uint _weight
    function createProductBatch(bytes32[] bArgs, uint[] uArgs) external onlyOperator returns (bool){
        require(littlepoProductHistory != address(0), "Storage is not config yet");
        require(bArgs.length == 5, "bArgs need to be 5");
        require(uArgs.length == 6, "bArgs need to be 6");


        PackerBatch ph = new PackerBatch (NODE_NAME, bArgs, uArgs);

        // add litlePohistory as operator
        productBatches[ph.productBatchId()] = ph;

        // ph.addOperator(littlepoProductHistory);
        littlepoProductHistory.updateTrackingInfo(ph.dBatchNo(), ph);
        littlepoProductHistory.removeTrackingInfo(ph.bBatchNo());

        return true;
    }
}