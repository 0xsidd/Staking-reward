const { expect } = require("chai");
const { ethers } = require("hardhat");
const BigNumber = require('bignumber.js');
let token;
let staking;
let signers;
let initialBalance;
let finalBalance;
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


describe("Staking Contract functions", function () {
  beforeEach(async()=>{
    const Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy();
    await token.deployed();
    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(token.address);
    await staking.deployed();
    signers = await ethers.getSigners();
  });
    
  it("Should transfer funds from token contract to staking contract",async()=>{
    initialBalance = await token.balanceOf(staking.address);
    await token.transfer(staking.address,100);
    finalBalance = await token.balanceOf(staking.address);
    await expect(parseInt(finalBalance)).to.equal(parseInt(initialBalance+100));
  });

  it("Output check",async()=>{
    await token.connect(signers[0]).transfer(staking.address,100);
    initialBalance = ((await token.balanceOf(signers[0].address)));
    await token.connect(signers[0]).approve(staking.address,100);
    await staking.connect(signers[0]).stakeTokens(100);
    await sleep(6000);
    await staking.connect(signers[0]).unStakeTokens();
    let fnlVal = await token.balanceOf(signers[0].address);
    await (expect(parseInt(fnlVal)).to.equal((parseInt(initialBalance)+5)));

  });

  it("Not allow to unstake tokens before time",async()=>{
    await token.connect(signers[0]).transfer(staking.address,100);
    initialBalance = parseInt((await token.balanceOf(signers[0].address)).toString());
    await token.connect(signers[0]).approve(staking.address,100);
    await staking.connect(signers[0]).stakeTokens(100);
    await sleep(2000);
    await expect(staking.connect(signers[0]).unStakeTokens()).to.be.revertedWith('Wait till staking time is completed');
  });
});

