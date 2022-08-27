// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Salary is ERC1155 {
    struct Contract {
        uint32 salary;
        uint256 date;
        bool to_sell;
    }

    event SellContract(address _owner, uint256 _id);

    modifier onlyIssuer() {
        require(
            msg.sender == issuer,
            "This function can only be executed by the issuer"
        );
        _;
    }
    modifier expectValue(uint32 _v) {
        require(
            msg.value >= _v,
            "Please send the correct amount for this function"
        );
        _;
    }

    address payable issuer;

    mapping(address => Contract[]) balances;
    address[] owners_addresses;

    constructor() ERC1155("") {
        issuer = payable(msg.sender);
    }

    function createContract(
        address _owner,
        uint32 _salary,
        uint256 _date
    ) external onlyIssuer {
        require(_date > 0, "Date of issue must be non-zero");
        _mint(_owner, 0, 1, "");
        balances[_owner].push(Contract(_salary, _date, false));
        addToOwnersAddresses(_owner);
    }

    function addToOwnersAddresses(address _owner) private {
        bool toAdd = true;
        for (uint256 index = 0; index < owners_addresses.length; index++) {
            if (owners_addresses[index] == _owner) {
                toAdd = false;
            }
        }
        if (toAdd == true) {
            owners_addresses.push(_owner);
        }
    }

    function sellContract(uint256 _id) external {
        require(
            balances[msg.sender][_id].date > 0,
            "You don't have such contract"
        );
        balances[msg.sender][_id].to_sell = true;
        emit SellContract(msg.sender, _id);
    }

    function buyContract(uint256 _id, address _owner)
        external
        payable
        expectValue((balances[_owner][_id].salary * 49) / 50)
        returns (bool)
    {
        uint32 salary = balances[_owner][_id].salary;
        bool to_sell = balances[_owner][_id].to_sell;
        uint256 date = balances[_owner][_id].date;

        require(to_sell == true, "This contract is not for sale");
        (bool sent, bytes memory data) = _owner.call{value: (salary * 49) / 50}(
            ""
        );
        require(sent, "Failed to send Ether");

        delete balances[_owner][_id];

        addToOwnersAddresses(msg.sender);
        balances[msg.sender].push(Contract(salary, date, false));

        return sent;
    }

    function getOwnersList() external view returns (address[] memory) {
        return owners_addresses;
    }

    function getAddressContracts(address _owner)
        external
        view
        returns (Contract[] memory)
    {
        return balances[_owner];
    }

    function executeContract(address _owner, uint256 _id)
        public
        payable
        onlyIssuer
        expectValue(balances[_owner][_id].salary)
        returns (bool)
    {
        (bool sent, bytes memory data) = _owner.call{
            value: balances[_owner][_id].salary
        }("");
        require(sent, "Failed to send Ether");

        delete balances[_owner][_id];

        return sent;
    }

    function executeAllContracts() external payable returns (bool[1] memory) {
        bool[1] memory success = [true];
        for (uint256 index = 0; index < owners_addresses.length; index++) {
            for (
                uint256 j = 0;
                j < balances[owners_addresses[index]].length;
                j++
            ) {
                executeContract(owners_addresses[index], j);
            }
        }
        return success;
    }
}
