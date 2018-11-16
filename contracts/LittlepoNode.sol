pragma solidity ^0.4.24;

import "./BaseNode.sol";
import "./BaseProduct.sol";
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
        littlepoProductHistory.updateTrackingInfo(ph.qrCodeId(),ph);

        return true;
    }

    // _qrCodeId: qrCodeId of Packer package
    function receiveProductBatch(bytes32 _qrCodeId) public onlyOperator returns (bool) {
        bytes32[] memory childIds = littlepoProductHistory.getChildsOfProductBatch(_qrCodeId);

        for(uint i = 0; i < childIds.length; i++) {
            BaseProduct child = littlepoProductHistory.getBaseProducByQR(childIds[i]);
            child.addHistory(NODE_NAME, _qrCodeId, now);
        }
        
        return true;
    }

    function getProductBatchInfo(bytes32 _qrCodeId) 
        public view returns(bytes32[]){

        LittlepoBatch ph = LittlepoBatch(productBatches[_qrCodeId]);
        bytes32[] memory ret = new bytes32[](11);
    // bytes32 _nodeId,
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
        ret[0] = ph.bBatchNo();
        ret[1] = ph.productName();
        ret[2] = ph.location();
        ret[3] = ph.productId();
        ret[4] = ph.producerId();
        ret[5] = ph.containerId();
        ret[6] = ph.containerType();
        ret[7] = ph.legalEntity();

        ret[8] = ph.dBatchNo();
        ret[9] = ph.weight();
        // ret[10] = ph.createdTime();

        return ret;
    }
}