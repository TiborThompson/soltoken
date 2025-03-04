/**
 * @fileoverview Main entry point for the SolToken application
 * 
 * This is the main entry point for the application, providing a welcome
 * message and overview of available commands. It also performs basic
 * environment checks and displays the current wallet status.
 * 
 * @author Your Name
 * @version 1.0.0
 */

const { mintToken } = require('./token-service');
const { getKeypairFromFile } = require('./utils');
require('dotenv').config();

async function main() {
  try {
    const simulationMode = process.env.SIMULATION_MODE === 'true';
    const walletPath = process.env.WALLET_PRIVATE_KEY;
    const wallet = getKeypairFromFile(walletPath);
    
    console.log('\n🪙 Solana Token Manager - Welcome! 🪙');
    console.log('===============================');
    console.log(`Network: ${process.env.SOLANA_NETWORK}`);
    console.log(`Simulation Mode: ${simulationMode ? 'ENABLED' : 'DISABLED'}`);
    console.log(`Wallet Address: ${wallet.publicKey.toString()}`);
    
    if (process.env.TOKEN_MINT_ADDRESS) {
      console.log(`Current Token: ${process.env.TOKEN_MINT_ADDRESS}`);
    }
    
    console.log('\nAvailable Commands:');
    console.log('------------------');
    console.log('- npm run get-sol: Request SOL from testnet faucet');
    console.log('- npm run mint: Create and mint new tokens');
    console.log('- npm run transfer: Transfer tokens between wallets');
    console.log('- npm run balance: Check token balances');
    console.log('- npm run disable-minting: Disable further token minting');
    
    if (simulationMode) {
      console.log('\nNOTE: Running in simulation mode. No real blockchain transactions will be made.');
      console.log('To use real transactions, set SIMULATION_MODE=false in your .env file.');
    } else {
      // Check if we have SOL
      const { Connection, clusterApiUrl, LAMPORTS_PER_SOL } = require('@solana/web3.js');
      const connection = new Connection(clusterApiUrl(process.env.SOLANA_NETWORK), 'confirmed');
      const balance = await connection.getBalance(wallet.publicKey);
      console.log(`\nWallet Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
      
      if (balance === 0) {
        console.log('\nYou need SOL to perform real transactions. Run: npm run get-sol');
      }
    }
  } catch (error) {
    console.error('Error in main application:', error);
  }
}

main();