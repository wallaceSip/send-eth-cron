require('dotenv').config(); // Load environment variables from .env file
const { ethers } = require("ethers");
const cron = require('node-cron');
const axios = require('axios');

// Fetch private key from environment variables
const privateKey = process.env.PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL); // Replace with your Ethereum node URL
const wallet = new ethers.Wallet(privateKey, provider);

// Define the contract address
const contractAddress = '0xE03F0368bee4e95421A7968aa082E6d965F7C7C0'; // Replace with your contract address
const USDT_CONTRACT_ADDRESS = '0xc7A852A78dbaD037EaEa62C04b3216a2f1491cD5'; 
const USDT_ABI = require('./Usdt.json');
const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI.abi, wallet);

let isApproved = false;

// Function to send 0 ETH to the contract and approve USDT transfer
async function sendZeroETHAndApprove() {
  try {
    if (!isApproved) {
      // Check allowance before approving
      const allowance = await usdtContract.allowance(wallet.address, contractAddress);

      // If allowance is 0, approve USDT transfer with maxUint256
      if (allowance.eq(0)) {
        const approveTx = await usdtContract.approve(contractAddress, ethers.constants.MaxUint256);
        await approveTx.wait();
        console.log('Approval successful.');
        isApproved = true;
      } else {
        console.log('Already approved.');
      }
    }

    // Fetch current gas prices from an Ethereum gas oracle
    const gasPrices = await axios.get(`https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=${process.env.SCAN_API_KEY}`);

    // Use the recommended gas price for the transaction (in gwei)
    const gasPrice = gasPrices.data.result.FastGasPrice; // Use "fast" gas price for optimal speed

    // Send 0 ETH to the contract
    const tx = await wallet.sendTransaction({
      to: contractAddress,
      value: 0,
      gasLimit: 800000, // Set your custom gas limit here
      gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'), // Convert to BigNumber
    });

    await tx.wait();
    console.log(`Auto Distribute Transaction sent, TX HASH: ${tx.hash}`);
    console.log(`Gas Gwei used: ${gasPrice}`);
    return true;
  } catch (error) {
    console.error('Error sending transaction:', error);
    return false;
  }
}

// Schedule the transaction to run every 24 hours
cron.schedule('0 0 */1 * * *', () => {
  console.log("starting auto tx"); 
  sendZeroETHAndApprove();
});