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

contract StakingAdvance{
    mapping(address=>mapping(uint256=>uint256))public timeData;
    mapping(address=>mapping(uint256=>uint256))public amountData;
    mapping(address=>uint256)public claimableAmount;
    mapping(address=>uint256)public countData;

    address immutable tokenAddress;
    uint256 immutable stakingTime;

    constructor(address _tokenAddress){
        tokenAddress = _tokenAddress;
        stakingTime = 5;
    }



    function stakeTokens(uint256 _amount)public{
        require(_amount>0,"Provide tokens to stake");
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
        countData[msg.sender] += 1;
        timeData[msg.sender][countData[msg.sender]] = block.timestamp;
        amountData[msg.sender][countData[msg.sender]] = _amount;
    }

    function unStakeTokens()public{
        for(uint i=1; i<=countData[msg.sender]; i++){
            if(block.timestamp - timeData[msg.sender][i]>=stakingTime){
                claimableAmount[msg.sender] += amountData[msg.sender][i];
                amountData[msg.sender][i] -= claimableAmount[msg.sender];  
            }         
        }
        uint amtTransfer = claimableAmount[msg.sender] + claimableAmount[msg.sender]*5/100;
        IERC20(tokenAddress).transfer(msg.sender,amtTransfer);
        claimableAmount[msg.sender] = 0;
    }
}