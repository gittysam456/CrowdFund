// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
contract crowdFund{
    address owner;
    bool public isStarted;
    uint256 public endTime;
    uint256 totalFundedAmount;
    uint256 public goalAmount;

    constructor(uint256 _endTime, uint256 _goalAmount ) {
        owner=msg.sender;
        isStarted = true;
        endTime=_endTime;
        goalAmount = _goalAmount;
    }
    modifier isOwner(){
        require(msg.sender == owner,"You are not owner");
        _;
    }
    mapping (address=> uint) sentFunds;
    function setfund() payable public {
        require(msg.sender!= owner , "You are not allowed");
        require(goalAmount > (totalFundedAmount + msg.value),"Goal amount has been reached");
        require(isStarted,"The Funding hasnt started yet");
        require(block.timestamp < endTime);
        require(!(sentFunds[msg.sender] >0),"you are allowed to transfer once");
        require(msg.value>0,"You should transfer more than Zero");
        sentFunds [msg.sender]=msg.value;
        totalFundedAmount+= msg.value;
    }

    function checkYourFunds(address myAdress) public view returns(uint) {
        return sentFunds[myAdress];
    }
    function checkAllFunds() public view returns(uint){
        return address(this).balance;
    }
    function endFunding() public isOwner{
        require(isStarted,"Not started ");
        isStarted = false;
    }


    function withdrawlSomeFunds(uint amount) public  isOwner returns(bool){
        totalFundedAmount -= amount;
        (bool status,) = msg.sender.call{value:amount}("");
        require(status,"transfer failed");
        return status;
    }

     function withdrawlAll() public returns(bool){
        // uint amount = address(this).balance;
        uint amount = totalFundedAmount;
        totalFundedAmount = 0;
        (bool status,) = msg.sender.call{value: amount}("");
        require(status, "Your transfer failed");
        return status;
        }

}