require('dotenv').config(); // Load environment variables from .env file
const ethers = require('ethers');
const cron = require('node-cron');
const axios = require('axios');

// Fetch private key from environment variables
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, YOUR_PROVIDER_URL); // Replace with your Ethereum node URL

// Define the contract address
const contractAddress = '0xE03F0368bee4e95421A7968aa082E6d965F7C7C0'; // Replace with your contract address

// Define the ABI (Application Binary Interface) for your contract
const contractABI = [
  {"inputs":[{"internalType":"address","name":"_usdtAddress","type":"address"}],
  "stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},
  {"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"payee","type":"address"},
  {"indexed":false,"internalType":"uint256","name":"newShare","type":"uint256"}],"name":"ShareUpdated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},
  {"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},
  {"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"message","type":"bytes"}],
  "name":"TokensTransfer","type":"event"},{"inputs":[{"internalType":"address","name":"_payee","type":"address"},
  {"internalType":"uint256","name":"_share","type":"uint256"}],"name":"addPayee","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"distributionInterval","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"lastDistributedTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"payees","outputs":[{"internalType":"address","name":"","type":"address"}],
  "stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"removePayee",
  "outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"shares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
  "stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],
  "stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_payee","type":"address"},{"internalType":"uint256","name":"_newShare",
  "type":"uint256"}],"name":"updateShare","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usdtTokenContractAddress",
  "outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawMatic","outputs":[],
  "stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}
];

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Function to send 0 ETH to the contract
async function sendZeroETH() {
  try {
   // Fetch current gas prices from an Ethereum gas oracle
   const gasPrices = await axios.get('https://www.gasnow.org/api/v3/gas/price');

   // Use the recommended gas price for the transaction (in gwei)
   const gasPrice = gasPrices.data.data.fast / 10; // Use "fast" gas price for optimal speed

   const tx = await wallet.sendTransaction({
     to: contractAddress,
     value: ethers.utils.parseEther('0'),
     gasLimit: 800000, // Set your custom gas limit here
     gasPrice: ethers.utils.parseUnits(gasPrice.toString(), 'gwei'), // Convert to wei
   });

   await tx.wait();
   console.log(`Transaction sent: ${tx.hash}`);
   console.log(`Gas used: ${tx.gasUsed.toString()}`);
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

// Schedule the transaction to run every 24 hours
cron.schedule('0 0 */1 * * *', () => {
  sendZeroETH();
  console.log('Scheduled transaction sent.');
});
