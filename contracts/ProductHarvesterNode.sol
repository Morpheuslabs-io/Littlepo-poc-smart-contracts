pragma solidity ^0.4.24;

// import "./UserRole.sol";
import "./BaseNode.sol";
import "./HarvesterBatch.sol";
import "./LegalEntity.sol";
import "./LittlepoProductHistory.sol";

contract ProductHarvesterNode is BaseNode {
    bytes32 constant NODE_NAME = "ProductHarvester";
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
        littlepoProductHistory.updateTrackingInfo(ph);

        return true;
    }
}