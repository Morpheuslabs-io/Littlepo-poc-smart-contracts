pragma solidity ^0.4.24;

import "./BaseNode.sol";
import "./PackerBatch.sol";
import "./TeaBag.sol";

contract ProductPackerNode is BaseNode {
    bytes32 constant NODE_NAME = "PackerNode";
    function getNodeName() public pure returns (bytes32){
        return NODE_NAME;
    }
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
        require(bArgs.length == 11, "Incorrect parameter length, need to be 11");
        require(productBatches[bArgs[0]] == address(0), "Package is already created");

        PackerBatch pb = new PackerBatch (NODE_NAME, bArgs);

        // add litlePohistory as operator
        productBatches[pb.qrCodeId()] = pb;
        productLinks[pb.dBatchNo()].push(pb);

        pb.addOperator(littlepoProductHistory);
        // littlepoProductHistory.updateTrackingInfo(pb.qrCodeId(), pb);
        littlepoProductHistory.updateTrackingInfo(pb);

        return true;
    }

    // Teabag arguments
    // bytes32 _qrCodeId,
    // bytes32 _bBatchNo,
    // bytes32 _productName,
    // bytes32 _location,
    // bytes32 _productId,
    // bytes32 _producerId,
    // bytes32 _containerId,
    // bytes32 _containerType,
    // bytes32 _legalEntity
    function addTeaBagBatch(bytes32 _packerBatchQRId, bytes32[] bArgs) public onlyOperator returns (bool) {
        require(littlepoProductHistory != address(0), "Storage is not config yet");
        require(bArgs.length == 11, "Incorrect parameter length, need to be 11");
        // require(productBatches[bArgs[0]] == address(0), "Package is already created");
        require(productBatches[_packerBatchQRId] != address(0), "Invalid Packer Batch qrCodeId");

        TeaBag tb = new TeaBag (NODE_NAME, bArgs);

        // add litlePohistory as operator
        ProductBatch pb = previousNode.getProductBatchByBatchNo(tb.bBatchNo())[0];

        tb.addOperator(littlepoProductHistory);
        tb.addHistory(pb.nodeId(), pb.createdTime());

        littlepoProductHistory.updateTrackingInfo(tb);
        productBatches[_packerBatchQRId].addChild(tb);

        return true;
    }
}