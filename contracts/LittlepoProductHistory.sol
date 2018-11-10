pragma solidity ^0.4.24;

import "./UserRole.sol";
import "./ProductBatch.sol";

contract LittlepoProductHistory is UserRole {
    mapping(bytes32 => address[]) internal productBatches;
    mapping(bytes32 => bytes32) internal productLinks;

    mapping(address => bytes32) internal nodes;
    mapping(address => bool) internal nodeNames;
    bytes32[20] internal nodeList;

    uint internal counter = 1;

    function registerNode(bytes32 _nodeName, address _baseNodeAddress) public onlyAdmin returns(bool) {
        require(!nodeNames[_baseNodeAddress], "Node is added already");
        require(nodeList.length <= 20, "Cannot add more nodes");

        nodes[_baseNodeAddress] = _nodeName;
        nodeList[counter - 1] = _nodeName;
        nodeNames[_baseNodeAddress] = true;
        counter++;

        // add to list operator to able to save histories;
        addOperator(_baseNodeAddress);
        return true;
    }

    // function setQueryNode(CustomerNode _node) public onlyAdmin returns(bool) {
    //     require(_node != address(0), "Customer node is invalid");
    //     customerNode = _node;

    //     return true;
    // }

    // function queryProductByQRCode(bytes32 _dxQRCodeId) public view returns(ProductBatch){
    //     return customerNode.queryProductInfo(_dxQRCodeId);
    // }

    function getNodes() external view returns (bytes32[20]) {
        return nodeList;
    }

    function getProductBatchByBN(bytes32 _dBatchNo) public view returns (address[]) {
        return productBatches[_dBatchNo];
    }

    function getProductBatchByQR(bytes32 _qrCodeId) public view returns (address[]) {
        return productBatches[productLinks[_qrCodeId]];
    }

    function updateTrackingInfo(bytes32 _batchNo, ProductBatch _productBatch) public onlyOperator returns (bool){
        require(_productBatch != address(0), "Invalid history time");
        require(nodeNames[msg.sender], "Your node is not regiter yet");

        productBatches[_batchNo].push(_productBatch);
        return true;
    }

    function setAlias(bytes32 _dBatchNo, bytes32 _qrCodeId) public onlyOperator returns (bool){
        productLinks[_dBatchNo] = _qrCodeId;
    }
    

    function removeTrackingInfo(bytes32 _batchNo) public onlyOperator returns (bool) {
        delete productBatches[_batchNo];
        delete productLinks[_batchNo];

        return true;
    }
}