require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  etherscan:{
  apiKey: {
    goerli: process.env.etherscanApi
  }}
  ,
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.api_key}`,
      accounts: [process.env.secret],
    },
  },
};
