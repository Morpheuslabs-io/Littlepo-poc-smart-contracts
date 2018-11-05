pragma solidity ^0.4.24;

contract User {
    uint public id;
    string public username;
    string public password;
    string public email;
    string public fullName;

    constructor (
        uint _id,
        string _username,
        string _password,
        string _email,
        string _fullName
    ) public {
        id = _id;
        username = _username;
        password = _password;
        email = _email;
        fullName = _fullName;
    }
}