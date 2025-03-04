const { 
  Connection, 
  PublicKey, 
  LAMPORTS_PER_SOL, 
  clusterApiUrl 
} = require('@solana/web3.js');
const { getKeypairFromFile } = require('../src/utils');
require('dotenv').config();

// Helper to parse command line arguments
function getArg(flag) {
  const index = process.argv.indexOf(flag);
  return index > -1 ? process.argv[index + 1] : null;
}

async function requestAirdrop() {
  try {
    // Get wallet keypair
    const walletPath = process.env.WALLET_PRIVATE_KEY;
    const wallet = getKeypairFromFile(walletPath);
    const walletAddress = wallet.publicKey.toString();
    
    console.log('Requesting SOL airdrop for wallet:', walletAddress);
    
    // Set up connection to testnet
    const network = process.env.SOLANA_NETWORK || 'testnet';
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    
    // Check current balance
    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`Current balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    
    // Try multiple faucets if one fails
    let success = false;
    
    // Try official Solana testnet faucet first
    try {
      console.log('Requesting airdrop from Solana testnet faucet...');
      const amount = getArg('--amount') || 1;
      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        amount * LAMPORTS_PER_SOL
      );
      
      console.log('Waiting for airdrop confirmation...');
      await connection.confirmTransaction(signature);
      
      // Verify the balance increased
      const newBalance = await connection.getBalance(wallet.publicKey);
      if (newBalance > balance) {
        console.log(`Airdrop successful! New balance: ${newBalance / LAMPORTS_PER_SOL} SOL`);
        success = true;
      } else {
        console.log('Airdrop may have failed. Balance did not increase.');
      }
    } catch (error) {
      console.error('Error with primary faucet:', error.message);
    }
    
    // If primary faucet failed, try program-based approach
    if (!success) {
      console.log('\n⚠️ Automated airdrop failed - please use one of these faucets: ⚠️');
      console.log('----------------------------------------------------------');
      console.log('1. Official Solana Faucet:');
      console.log('   Visit: https://faucet.solana.com');
      console.log('   Enter your wallet address:', walletAddress);
      console.log('\n2. SolFaucet:');
      console.log('   Visit: https://solfaucet.com');
      console.log('   Enter your wallet address:', walletAddress);
      console.log('\n3. QuickNode Faucet:');  
      console.log('   Visit: https://faucet.quicknode.com/solana/testnet');
      console.log('   Enter your wallet address:', walletAddress);
      console.log('\nAfter using any of these faucets, check your balance with:');
      console.log('solana balance', walletAddress, '--url https://api.testnet.solana.com');
      console.log('\nOnce you have SOL, you can create your token with:');
      console.log('npm run mint');
    }
    
  } catch (error) {
    console.error('Error requesting airdrop:', error);
  }
}

requestAirdrop();