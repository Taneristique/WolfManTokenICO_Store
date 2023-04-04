# WolfManToken ICO STORE

To be able to use this application, please add metamask extension to your computer. You can find dependencies from package.json file but please be sure nodejs is installed on your pc and installing yarn package manager also would be good. 

After you installed all the dependencies be sure that you have some goerli ethers than go to client from the terminal and run following lines
<code>cd client
      git clone "https://github.com/Taneristique/WolfManToken_FrontEnd.git" frontend
      cd frontend  
      npm install react-scripts
      cd src 
      npm install ethers@5.4.7
</code>
than run <code>npm start</code> command on the terminal to start frontend of the project and experience 
how this ico store works.
This contract has a fund saving option refund which pays back your money as WolfManToken if you wrongly sent 1 eth or more to the contract. Finally before forgetting the front end of the app did not build yet if you want to build run<code>npm run build</code>

# Used Technologies
<img src="https://raw.githubusercontent.com/github/explore/ba9de12f88fd08825c51928e91f1678cb5c94b26/topics/solidity/solidity.png" width="25" height="25"><img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png" width="25" height="25">

# How to Redeploy Contract
If you want to redeploy contract create an .env file in this path. And create 3 environment variables. These will be named as following lines: 
1."api_key" which is your api key of infura ethereum goerli test net or in case you want to put it on the mainnet, you can add the main network from hardhat.config.js and migrate the contract to the ethereum mainnet but for this project I only used goerli testnet.
And contract is already deployed to goerli testnet.It's contract address is https://goerli.etherscan.io/address/0x9bda325b53f493b67b144b79fbc2d04468139e0c.
2."Secret" this will be your private key to sign transactions.
3."etherscanApi" this will be your api key from etherscan.

### syntax of .env
api_key="your infura key"
secret="your private key"
etherscanApi="your etherscan api key"

After you done .env correctly. In case you changed something on WolfManToken.sol
run <code>npx hardhat compile</code>.To be able to deploy it to the mainnet run
<code>npx hardhat run scripts/deploy.js --network networkname //(e.g npx hardhat run scripts/deploy.js --network goerli) and verify the contract as running 
npx hardhat verify --network networkname contractaddress command.</code>

# ScreenShots Of WolfManToken ICO
## Main Page
![2nd](https://user-images.githubusercontent.com/48108872/229899387-51661dde-5c2b-4b25-9e58-1d4a1aa2851a.png)
## Account Page
![first](https://user-images.githubusercontent.com/48108872/229899370-57ed653d-19da-4180-bac4-5b1a3ad92ad8.png)
## Buy Token
![buy](https://user-images.githubusercontent.com/48108872/229898050-25c8ad48-66b0-48cd-8f36-fada905b324d.png)
## Transfer Token
![transfer](https://user-images.githubusercontent.com/48108872/229898083-0a6a68c5-b8e7-4a42-b7d3-936a4f333741.png)
