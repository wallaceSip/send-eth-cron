require('dotenv').config(); // Load environment variables from .env file
const { ethers } = require("ethers");
const cron = require('node-cron');
const axios = require('axios');

// Fetch private key from environment variables
const privateKey = process.env.PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL); // Replace with your Ethereum node URL
const wallet = new ethers.Wallet(privateKey, provider);

// Define the contract address
const contractAddress = process.env.CONTRACT; // Replace with your contract address
const USDT_CONTRACT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'; 
const USDT_ABI = require('./Usdt.json');
const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, wallet);

// Function to send 0 ETH to the contract and approve USDT transfer
async function sendZeroETHAndApprove() {
  try {
    // Fetch current gas prices from an Ethereum gas oracle
    const gasPrices = await axios.get(`https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=${process.env.SCAN_API_KEY}`);

    // Use the recommended gas price for the transaction (in gwei)
    const gasPrice = gasPrices.data.result.FastGasPrice; // Use "fast" gas price for optimal speed

    // Approve USDT transfer with maxUint256
    const approveTx = await usdtContract.approve(contractAddress, ethers.constants.MaxUint256);
    await approveTx.wait();

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
cron.schedule('1 21 * * *', () => {
  sendZeroETHAndApprove();
});