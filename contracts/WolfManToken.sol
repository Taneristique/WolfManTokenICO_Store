// SPDX-License-Identifier: MIT
/// @title WolfManToken 
/// @author taneristique
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

using SafeMath for uint;
contract WolfManToken is ERC20,ERC20Burnable,Ownable {
    
    ///@dev  10 million token will be supplied by default and each token will be 0.001 ether. 
    
    constructor() ERC20("WolfManToken","WOLFMan") {
        unchecked{
            _mint(msg.sender, 10000000*10**decimals());
            }
    }
    uint public price = 1*10**15 wei;
    /**
    @notice Each token bought event will be monitored with detail by newTokenBought event.
    @dev Following two mappings will use to refund wrongly sent funds to senders as WolfManToken. 
    WronglyPaidAmount will keep the wrong payment amount.
    LostFundRepaid will used to verify if user took its lost fund or not. 
    */
    mapping(address=>uint)  wronglyPaidAmount;
    mapping(address=>bool)  LostFundRepaid;
    error UserIsNotVictim(); 
    event newTokenBought(address indexed buyer, uint amount);
    /**@param to It is the adress that new tokens will mint.*/
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    /**@dev Withdraw funds to the outside of contract.
       @notice This function can be only called by owner.
       @param _to addreess where owner wants to withdraw funds 
    */
    function withdrawFunds(address payable _to) public onlyOwner{
        require(_to!=address(0),"_to is 0 address");
        _to.transfer(address(this).balance);
    }
    /**
        @dev Any funds sent without calling _buyWolfManToken to the contract will be recorded.
     */
    receive() external payable{
        wronglyPaidAmount[msg.sender]+=msg.value;
        LostFundRepaid[msg.sender]=false;
    }
    fallback() external payable{
        wronglyPaidAmount[msg.sender]+=msg.value;
        LostFundRepaid[msg.sender]=false;
    }
    /**
        @notice This function will be used for buying wolf token.
        @param _amount It takes the amount which user want to buy.
     */
    
    function buyWolfManToken(uint _amount) public payable{ 
        require(msg.value>=_amount.mul(price),"User does not have enough funds to buy demanded tokens!");
        _approve(msg.sender, owner(), _amount.mul(10**18));
        _transfer(owner(), msg.sender, _amount.mul(10**18));
        emit newTokenBought(msg.sender, _amount);
    }
    /// @return the amount of ether deposited at the moment
    function totalDepositedEther() external view returns(uint){
        return address(this).balance;
    }
    /** @param _to Receiver address 
        @param _amount Transfer Amount 
        @notice User can sent token to each other calling this contract
        */
    function sendWolfManToken(address _to,uint _amount) public{
        require(balanceOf(msg.sender)>=_amount,"There is no enough fund to sent WolfManToken");
         _approve(_to, msg.sender, _amount);
        _transfer(msg.sender, _to, _amount);
    } 

    /** @dev Be sure only users who wrongly send their ethers to the contract would refunded via OnlyVictims modifier.
        The user can execute Refund function if did not refund already and lost at least 1 ether.
     */
    function OnlyVictims() internal view{
        if(wronglyPaidAmount[msg.sender]<1 ether || LostFundRepaid[msg.sender]==true)
            revert UserIsNotVictim();
    }
    function refund() public{
        OnlyVictims();
        LostFundRepaid[msg.sender]=true;
         uint refundAmount= wronglyPaidAmount[msg.sender].div(price);
        _approve(msg.sender, owner(), refundAmount);
        _transfer(owner(), msg.sender, refundAmount);
    } 
}
