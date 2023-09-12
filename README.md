# Ethereum Smart Contract Scheduler

A Node.js script to send 0 ETH to an Ethereum smart contract every 24 hours using ethers.js and node-cron.

## Prerequisites

- Node.js installed on your machine
- Ethereum wallet with a private key
- Ethereum node URL (e.g., Infura or your own Ethereum node)
- Knowledge of the smart contract's address and ABI

## Installation

1. Clone this repository or create a new directory for your project:

   ```bash
   mkdir eth-scheduler
   cd eth-scheduler


2. install the node modules
npm install

3.Create a .env file in your project directory and define your private key as an environment variable:
PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE

#Configuration
In the send-eth.js file, you need to configure the following:

Fetch private key from environment variables using dotenv.
Replace 'YOUR_PROVIDER_URL' with the URL of your Ethereum node (e.g., Infura or your own Ethereum node).
Fill in the contract ABI for your specific smart contract.
Set the correct contract address in contractAddress.

#Usage
Run the script using Node.js:
node send-eth.js

This script will send 0 ETH to the specified smart contract every 24 hours with a custom gasLimit and an optimal gasPrice.
