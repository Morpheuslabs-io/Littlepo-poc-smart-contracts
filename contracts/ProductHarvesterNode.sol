pragma solidity ^0.4.24;

// import "./UserRole.sol";
import "./BaseNode.sol";
import "./HarvesterBatch.sol";
import "./LegalEntity.sol";
import "./LittlepoProductHistory.sol";

contract ProductHarvesterNode is BaseNode {
    bytes32 constant NODE_NAME = "Harvest";
    function getNodeName() public pure returns (bytes32){
        return NODE_NAME;
    }

    // Input format
    // bytes32 _productBatchId,
    // bytes32 _bBatchNo,
    // bytes32 _productName,
    // bytes32 _location,
    // bytes32 _productId,
    // bytes32 _producerId,
    // bytes32 _containerId,
    // bytes32 _containerType,
    // bytes32 _legalEntity
    function createProductBatch(bytes32[] bArgs) external onlyOperator returns (bool){
        require(littlepoProductHistory != address(0), "Storage is not config yet");
        require(bArgs.length == 9, "Incorrect parameter length, need to be 9");
        require(productBatches[bArgs[0]] == address(0), "Product batch is already existed");
        
        HarvesterBatch ph = new HarvesterBatch (NODE_NAME, bArgs);
        
        productBatches[ph.qrCodeId()] = ph;
        productLinks[ph.bBatchNo()].push(ph);

        // add litlePohistory as operator
        ph.addOperator(littlepoProductHistory);
        
        littlepoProductHistory.updateTrackingInfo(ph.qrCodeId(), ph);

        return true;
    }

    // bytes32 _qrCodeId,
    // bytes32 _bBatchNo,
    // bytes32 _productName,
    // bytes32 _location,
    // bytes32 _productId,
    // bytes32 _producerId,
    // bytes32 _containerId,
    // bytes32 _containerType,
    // bytes32 _legalEntity
    function getProductBatchInfo(bytes32 _qrCodeId) 
        public view returns(bytes32[]){

        ProductBatch ph = productBatches[_qrCodeId];
        bytes32[] memory ret = new bytes32[](8);
        ret[0] = ph.bBatchNo();
        ret[1] = ph.productName();
        ret[2] = ph.location();
        ret[3] = ph.productId();
        ret[4] = ph.producerId();
        ret[5] = ph.containerId();
        ret[6] = ph.containerType();
        ret[7] = ph.legalEntity();

        return ret;
    }
}