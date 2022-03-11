require("@nomiclabs/hardhat-waffle");
require('dotenv').config({path: '.env'});

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const getEnv = (variable, optional = false) => {
  if (!process.env[variable]) {
    if (optional) {
      console.warn(`[@env]: Environmental variable for ${variable} is not supplied.`)
    } else {
      throw new Error(`You must create an environment variable for ${variable}`)
    }
  }

  return process.env[variable]?.replace(/\\n/gm, '\n')
}

// Your mnemomic key
 const MNEMONIC = getEnv("MNEMONIC")

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/52752'/0'/0"
      },
    }
  },
  solidity: "0.8.4",
};
