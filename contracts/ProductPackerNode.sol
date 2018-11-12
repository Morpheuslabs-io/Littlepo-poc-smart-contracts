pragma solidity ^0.4.24;

import "./BaseNode.sol";
import "./PackerBatch.sol";

contract ProductPackerNode is BaseNode {
    bytes32 constant NODE_NAME = "PackerNode";

    // input format
    // bytes32 _productBatchId,
    // bytes32 _dBatchNo,
    // bytes32 _bBatchNo,
    // bytes32 _productName,
    // bytes32 _location,
    // bytes32 _productId,
    // bytes32 _containerId,
    // bytes32 _containerType,
    // bytes32 _legalEntity,
    // bytes32 _producerId,
    // bytes32 _weight

    function createProductBatch(bytes32[] bArgs) external onlyOperator returns (bool){
        require(littlepoProductHistory != address(0), "Storage is not config yet");
        // require(bArgs.length == 5, "bArgs need to be 5");
        // require(uArgs.length == 6, "bArgs need to be 6");

        PackerBatch ph = new PackerBatch (NODE_NAME, bArgs);

        // add litlePohistory as operator
        productBatches[ph.productBatchId()] = ph;

        // ph.addOperator(littlepoProductHistory);
        littlepoProductHistory.updateTrackingInfo(ph.dBatchNo(), ph);
        littlepoProductHistory.removeTrackingInfo(ph.bBatchNo());

        return true;
    }
}