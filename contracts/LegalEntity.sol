pragma solidity ^0.4.24;

import "./UserRole.sol";
import "./BaseProduct.sol";

contract LegalEntity is UserRole {
    struct Entity{
        uint id;
        string name;
        bytes32 code;
    }

    mapping(uint => Entity) internal entities;
    uint[] internal listEntities;

    function registerLegalEntity(
        uint _legalId, 
        string _name,
        bytes32 _code
    ) public onlyAdmin returns (bool) {
        require(entities[_legalId].id == 0, "Legal added already");

        entities[_legalId] = Entity(_legalId, _name, _code);
        listEntities.push(_legalId);

        return true;
    }

    function getEntity(uint _legalId) public view returns(uint, string, bytes32) {
        Entity storage e = entities[_legalId];

        return (e.id, e.name, e.code);
    }

    function getListEntities () public view returns (uint[]) {
        return listEntities;
    }
}