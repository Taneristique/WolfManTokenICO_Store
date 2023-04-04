const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { BigNumber, Contract, utils } = require("ethers");
const { ethers } = require("hardhat");

describe("WolfManToken Contract",function(){
 //Define a fixture to reuse the same setup in every test.
 //Use loadFixture to run this setup once, snapshot that state, and reset Hardhat Network to that snapshot in every test.
  async function deployWolfManTokenFixture(){
    const wolfmanToken=await ethers.getContractFactory("WolfManToken");
    const [owner,account1,account2]=await  ethers.getSigners();
    const wolfman=await wolfmanToken.deploy();
    await wolfman.deployed();
    return {wolfmanToken,owner,wolfman,account1,account2};
  }
  
  describe("Deployment",function(){
    it("Check If Contract Owner Address Set Correctly",async function(){
      const {wolfman,owner}=await loadFixture(deployWolfManTokenFixture);
      expect(await wolfman.owner()).to.equal(owner.address);
    })
    it("Check Total Supply",async function(){
      const {wolfman,owner}=await loadFixture(deployWolfManTokenFixture);
      const ownerBalance=await wolfman.balanceOf(owner.address);
      expect(await wolfman.totalSupply()).to.equal(ownerBalance);
    })
  })

  describe("Minting,Burning and Transfering Tokens",function(){
    it("Check If Owner Can Mint Extra Tokens",async function(){
      const {wolfman,owner,account1,account2}=await loadFixture(deployWolfManTokenFixture);
      const oldBalance=await wolfman.balanceOf(account1.address);
      await wolfman.connect(owner).mint(account1.address,ethers.utils.parseEther("50"));
      const newBalance=await wolfman.balanceOf(account1.address);
      console.log("Old balance of account1 was %d. The balance of account1 updated to %d after minting.",oldBalance,newBalance );
      expect(newBalance).to.be.greaterThan(oldBalance);
    })
    it("Try Burning Token From An Account With Calling burn and BurnFrom functions",async function(){
      const {wolfman,owner,account1}=await loadFixture(deployWolfManTokenFixture);
      await wolfman.connect(owner).sendWolfManToken(account1.address,ethers.utils.parseEther("2500"));
      console.log("WolfMan balance of account 1 before burning event :  %d WolfMan",ethers.utils.formatEther(await wolfman.balanceOf(account1.address)));
      expect(await wolfman.connect(owner).burnFrom(account1.address,ethers.utils.parseEther("1250")))
      expect(await wolfman.connect(account1).burn(ethers.utils.parseEther("500")))
      console.log("Current balance after 1750 tokens burned :  %d WolfMan",ethers.utils.formatEther(await wolfman.balanceOf(account1.address)))
    })

    //Send WolfManToken from one address to Another
    it("Check If User Can Transfer Their Tokens between Each Other",async function(){
      const {wolfman,owner,account1,account2}=await loadFixture(deployWolfManTokenFixture);
      await wolfman.connect(owner).mint(account2.address,ethers.utils.parseEther("100"));
      expect(await wolfman.connect(account2).sendWolfManToken(account1.address,ethers.utils.parseEther("20"))); 
      account1Balance=await wolfman.balanceOf(account1.address);
      account2Balance=await wolfman.balanceOf(account2.address);
      console.log("Owner minted 100 tokens to Account2\nAccount2 sent 20 tokens to Account1.");
      console.log("Current balances\nAccount 1 : %d WolfMan\nAccount2 : %d WolfMan",ethers.utils.formatEther(account1Balance),ethers.utils.formatEther(account2Balance))
    })
    //We will buy WolfManToken ICO  as depositing Ether.
    before("Put Some Ethers To The Contract Adress",function(){
      it("Buy WolfManToken From The Store",async function(){
        const {wolfman,owner,account1}=await loadFixture(deployWolfManTokenFixture);
        expect(await wolfman.connect(account1).buyWolfManToken(2000, {
          value: ethers.utils.parseEther("2")
        }));
      })
    })
    //Owner will withdraw deposited Ether funds.
    it("Admin Withdraws Funds",async function(){
      const {wolfman,owner,account1,account2}=await loadFixture(deployWolfManTokenFixture);
      expect(await wolfman.connect(owner).withdrawFunds(account2.address));
    })
    it("Try purchasing token with insufficient ether",async function(){
      const {wolfman,account2}=await loadFixture(deployWolfManTokenFixture);
      expect(await wolfman.connect(account2).buyWolfManToken(1000,{
        value: ethers.utils.parseEther("1")})).to.be.revertedWith("User does not have enough funds to buy demanded tokens!");
    });
    describe("Refund Account",function(){
      before("Deposit 1 Ether to the Recieve Function Using Address2",async function(){
        const {wolfman,account2}=await loadFixture(deployWolfManTokenFixture);
        await contract.connect(account2).receive({ value: ethers.utils.parseEther("1") })
      })
      after("Try To Redeem Your Lost Fund as WolfManToken",function(){
        it("Call Refund Function For Redeeming Funds",async function(){
          const {wolfman,account2}=await loadFixture(deployWolfManTokenFixture);
          expect(await wolfman.connect(address2).refund());
        })
      })
    })
  })
})

