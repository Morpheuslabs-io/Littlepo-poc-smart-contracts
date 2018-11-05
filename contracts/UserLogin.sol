pragma solidity ^0.4.24;

import "./User.sol";
import "./UserRole.sol";

contract UserLogin is UserRole {

    mapping(address => User) internal users;
    mapping(string => address) internal usernames;
    address[] internal userList;

    function register(
        string _username, 
        string _password,
        string _email,
        string _fullName
    ) public onlyAdmin returns (bool) {
        require(usernames[_username] == address(0), "Username is already registered");
        
        User u = new User((userList.length + 1), _username, _password, _email, _fullName);
        address userAddr = address(u);
        users[userAddr] = u;
        usernames[_username] = userAddr;

        userList.push(userAddr);
        return true;
    }

    function getUser(string _username) public view returns (uint, string, string, string, string) {
        User u = users[usernames[_username]];
        return (u.id(), u.username(), u.password(), u.email(), u.fullName());
    }

    function getListUser() public view returns (address[]) {
        return userList;
    }
}