pragma solidity ^0.4.24;

import "./BaseNode.sol";
import "./ProductBatch.sol";
import "./LittlepoBatch.sol";

contract LittlepoNode is BaseNode {
    bytes32 constant NODE_NAME = "LittlepoNode";
    function getNodeName() public pure returns (bytes32){
        return NODE_NAME;
    }

    function createProductBatch(bytes32[] bArgs) external onlyOperator returns (bool){
        require(littlepoProductHistory != address(0), "Storage is not config yet");
        require(bArgs.length == 11, "Incorrect parameter length, need to be 9");
        require(productBatches[bArgs[0]] == address(0), "Package is already created");

        LittlepoBatch ph = new LittlepoBatch (NODE_NAME,bArgs);

        // add litlePohistory as operator
        productBatches[ph.qrCodeId()] = ph;

        ph.addOperator(littlepoProductHistory);
        littlepoProductHistory.updateTrackingInfo(ph);

        return true;
    }

    // _qrCodeId: qrCodeId of Packer package
    function receiveProductBatch(bytes32 _qrCodeId) public onlyOperator returns (bool) {
        
        ProductBatch pb = ProductBatch(littlepoProductHistory.getProductBatchByQR(_qrCodeId));
        require(pb != address(0), "Invalid qr code");

        for(uint i = 0; i < pb.childCounter() - 1; i++) {
            ProductBatch child = ProductBatch(littlepoProductHistory.getProductBatchByQR(pb.childIds(i)));

            child.addHistory(NODE_NAME, now);
        }
        
        return true;
    }
}