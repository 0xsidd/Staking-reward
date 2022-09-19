const { expect } = require("chai");
const { ethers } = require("hardhat");
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

    const Staking = await ethers.getContractFactory("StakingAdvance");
    staking = await Staking.deploy(token.address);
    await staking.deployed();
    signers = await ethers.getSigners();
  })
    
  it("Should transfer funds from token contract to staking conttact",async()=>{
    initialBalance = await token.balanceOf(staking.address);
    await token.transfer(staking.address,100);
    finalBalance = await token.balanceOf(staking.address);
    await expect(parseInt(finalBalance)).to.equal(parseInt(initialBalance+100));
  });

  it("Should stake tokens",async()=>{
    await token.connect(signers[0]).transfer(staking.address,1000);
    initialBalance = parseInt(await token.balanceOf(signers[0].address));
    await token.connect(signers[0]).approve(staking.address,200);
    await staking.connect(signers[0]).stakeTokens(100);
    let stgOneBal = parseInt(await token.balanceOf(signers[0].address));
    await sleep(2000);
    await staking.connect(signers[0]).stakeTokens(100);
    let stgTwoBal = parseInt(await token.balanceOf(signers[0].address));
    await expect(stgTwoBal).to.equal(stgOneBal-100);
  });


  it("Should unstake tokens",async()=>{
    await token.connect(signers[0]).transfer(staking.address,1000);
    initialBalance = parseInt(await token.balanceOf(signers[0].address));
    await token.connect(signers[0]).approve(staking.address,200);
    await staking.connect(signers[0]).stakeTokens(100);
    await sleep(2000);
    await staking.connect(signers[0]).stakeTokens(100);
    await sleep(3000);
    await staking.connect(signers[0]).unStakeTokens();
    await sleep(2000);
    await staking.connect(signers[0]).unStakeTokens();
    let finalBalance = parseInt(await token.balanceOf(signers[0].address));
    await expect(finalBalance).to.equal(initialBalance+10);
  });

  it("Should unstake tokens according to time",async()=>{
    await token.connect(signers[0]).transfer(staking.address,1000);
    initialBalance = parseInt(await token.balanceOf(signers[0].address));
    await token.connect(signers[0]).approve(staking.address,200);
    await staking.connect(signers[0]).stakeTokens(100);
    await sleep(2000);
    await staking.connect(signers[0]).stakeTokens(100);
    await sleep(3000);
    await staking.connect(signers[0]).unStakeTokens();
    await staking.connect(signers[0]).unStakeTokens();
    let finalBalance = parseInt(await token.balanceOf(signers[0].address));
    await expect(finalBalance).to.equal(initialBalance-95);
  });

  // it("Multiple user staking and unstaking",async()=>{
  //   await token.connect(signers[0]).transfer(staking.address,1000);
  //   initialBalance = parseInt(await token.balanceOf(signers[0].address));
  //   await token.connect(signers[0]).approve(staking.address,200);
  //   await token.connect(signers[1]).approve(staking.address,200);
  //   await staking.connect(signers[0]).stakeTokens(100);
  //   await staking.connect(signers[1]).stakeTokens(100);
  //   await sleep(2000);
  //   await staking.connect(signers[0]).stakeTokens(100);
  //   await staking.connect(signers[1]).stakeTokens(100);
  //   await sleep(3000);
  //   await staking.connect(signers[0]).unStakeTokens();
  //   await staking.connect(signers[1]).unStakeTokens();
  //   await sleep(2000);
  //   await staking.connect(signers[0]).unStakeTokens();
  //   await staking.connect(signers[1]).unStakeTokens();
  //   let finalBalance = parseInt(await token.balanceOf(signers[0].address));
  //   await expect(finalBalance).to.equal(initialBalance+10);
  // });
});

