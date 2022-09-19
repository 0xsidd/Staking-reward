// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


interface IERC20 {
    function totalSupply() external view returns (uint);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address spender, uint amount) external returns (bool);
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

contract Staking{
    address immutable tokenAddress;
    uint256 immutable stakingTime;
    struct stakingData{
        uint256 amount;
        uint256 time;
    }
    mapping(address=>stakingData)public userStakingData;


    constructor(address _tokenAddress){
        tokenAddress = _tokenAddress;
        stakingTime = 5;
    }



    function stakeTokens(uint256 _amount)public {

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
        userStakingData[msg.sender] = stakingData(_amount,block.timestamp);
    } 

    function unStakeTokens()public{
        require(block.timestamp - userStakingData[msg.sender].time >= stakingTime,"Wait till staking time is completed");
        uint256 returnAmount = userStakingData[msg.sender].amount + (userStakingData[msg.sender].amount)*5/100;
        IERC20(tokenAddress).transfer(msg.sender,returnAmount);
    }

    function retamt()public view returns(uint256){
        return(userStakingData[msg.sender].amount)+ (userStakingData[msg.sender].amount)*5/100;
    }
}