# Ethereum Smart Contract Scheduler

A Node.js script to send 0 ETH to an Ethereum smart contract every 24 hours using ethers.js and node-cron.

## Prerequisites

- Node.js installed on your machine
- Ethereum wallet with a private key
- Ethereum node URL (e.g., Infura or your own Ethereum node)
- Knowledge of the smart contract's address

## Installation

1. Clone this repository or create a new directory for your project:

   ```bash
   mkdir eth-scheduler
   cd eth-scheduler


2. install the node modules:
 
   ```bash
   npm install
   

3. Create a .env file in your project directory and define your private key,polygonscan key and node URL as an environment variable:
   ```bash
   PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
   SCAN_API_KEY=YOUR_API_KEY
   NODE_URL=YOUR_NODE_URL
   CONTRACT=YOUR_CONTRACT_ADDRESS

## Configuration
In the send-eth.js file, you need to configure the following:

- Fetch private key from environment variables using dotenv.
- Replace 'YOUR_PROVIDER_URL' with the URL of your Ethereum node (e.g., Infura or your own Ethereum node).
- Fill in the contract ABI for your specific smart contract.
- Set the correct contract address in contractAddress.

## Usage
Run the script using Node.js:
   ```bash
   node send-eth.js


# This script will send 0 ETH to the specified smart contract every 24 hours with a custom gasLimit and an optimal gasPrice.
