pragma solidity ^0.4.24;

import "./UserRole.sol";
import "./BaseProduct.sol";
import "./BaseNode.sol";

contract LittlepoProductTracking is UserRole {
    mapping(bytes32 => BaseNode) internal nodes;
    uint internal counter = 1;
    bytes32[20] internal nodeList;

    function registerNode(bytes32 _nodeName, BaseNode _baseNodeAddress) public onlyAdmin returns(bool) {
        require(nodes[_nodeName] == address(0), "Node is added already");

        nodes[_nodeName] = _baseNodeAddress;
        nodeList[counter] = _nodeName;
        counter++;
        return true;
    }

    function getNodes() external view returns(bytes32[20]) {
        return nodeList;
    }
    
    function getProductInfo(string _productBatchNo, bytes32 _nodeName) public view returns (BaseProduct) {
        BaseNode node = nodes[_nodeName];
        return node.getProductBatchInfo(_productBatchNo);
    }
}