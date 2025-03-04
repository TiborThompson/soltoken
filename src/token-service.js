/**
 * @fileoverview Token Service - Core functionality for Solana token operations
 * 
 * This module provides the main functions for creating, minting, and managing 
 * Solana tokens on various networks (mainnet, testnet, devnet). It handles:
 * - Token creation and minting
 * - Token transfers
 * - Balance checking
 * - Minting authority management
 * 
 * The module can operate in three modes:
 * - Real mode: Performs actual blockchain transactions (requires SOL)
 * - Simulation mode: Simulates all operations without blockchain interactions
 * - Demo mode: For demonstration purposes when no SOL is available
 * 
 * @author Your Name
 * @version 1.0.0
 */

const {
  Connection,
  PublicKey,
  clusterApiUrl,
  sendAndConfirmTransaction,
  Transaction,
} = require('@solana/web3.js');
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  getAccount,
  createSetAuthorityInstruction,
  AuthorityType,
} = require('@solana/spl-token');
const { getKeypairFromFile, sleep } = require('./utils');
require('dotenv').config();

// Configure connection based on environment
function getConnection() {
  const network = process.env.SOLANA_NETWORK || 'testnet';
  const endpoint = clusterApiUrl(network);
  return new Connection(endpoint, 'confirmed');
}

// Check if we're in simulation mode (from .env file)
const SIMULATION_MODE = process.env.SIMULATION_MODE === 'true';

// IMPORTANT: This flag is for demonstration purposes only
// In a real scenario, you would have obtained SOL from a faucet
const DEMO_MODE = false; // We now have real SOL on devnet

/**
 * Create and mint a new token
 * @param {object} options - Token creation options
 * @returns {Promise<{mint: PublicKey, tokenAccount: PublicKey}>} Mint and token account public keys
 */
async function mintToken(options = {}) {
  const connection = getConnection();
  const wallet = getKeypairFromFile(process.env.WALLET_PRIVATE_KEY);
  
  console.log('Creating new token mint...');
  
  const decimals = options.decimals || parseInt(process.env.TOKEN_DECIMALS) || 9;
  const amount = options.amount || parseInt(process.env.TOKEN_SUPPLY) || 1000000000;
  
  // Check if we're in simulation mode
  if (SIMULATION_MODE || DEMO_MODE) {
    let mode = SIMULATION_MODE ? "SIMULATION" : "DEMO";
    console.log(`Running in ${mode} mode - ${SIMULATION_MODE ? 'no' : 'simulated'} transactions will be sent`);
    
    // Generate deterministic simulated addresses
    const simulatedMintAddress = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
    console.log('Simulated token mint created:', simulatedMintAddress.toString());
    
    // Simulate token account
    const simulatedTokenAccount = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    console.log('Simulated token account created:', simulatedTokenAccount.toString());
    
    console.log(`Simulating minting ${amount} tokens...`);
    console.log('Tokens minted successfully (simulation)');
    
    if (DEMO_MODE && !SIMULATION_MODE) {
      console.log('\n⚠️ DEMONSTRATION MODE ACTIVE ⚠️');
      console.log('In a real scenario, you would need testnet SOL to create this token.');
      console.log('Get testnet SOL from a faucet using instructions in the get-sol script.');
    }
    
    return {
      mint: simulatedMintAddress,
      tokenAccount: simulatedTokenAccount
    };
  }
  
  // Real implementation (requires SOL in the wallet)
  // Create the token mint
  const mint = await createMint(
    connection,
    wallet,
    wallet.publicKey,
    wallet.publicKey,
    decimals
  );
  
  console.log('Token mint created:', mint.toString());

  // Create token account
  console.log('Creating token account...');
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    mint,
    wallet.publicKey
  );
  
  console.log('Token account created:', tokenAccount.address.toString());
  
  // Mint tokens
  console.log(`Minting ${amount} tokens...`);
  
  await mintTo(
    connection,
    wallet,
    mint,
    tokenAccount.address,
    wallet,
    amount * (10 ** decimals)
  );
  
  console.log('Tokens minted successfully');
  
  return {
    mint: mint,
    tokenAccount: tokenAccount.address
  };
}

/**
 * Transfer tokens to another wallet
 * @param {string} tokenMintAddress - Token mint address
 * @param {string} recipientAddress - Recipient's wallet address
 * @param {number} amount - Amount to transfer
 * @returns {Promise<string>} Transaction signature
 */
async function transferTokens(tokenMintAddress, recipientAddress, amount) {
  const connection = getConnection();
  const wallet = getKeypairFromFile(process.env.WALLET_PRIVATE_KEY);
  
  // Check if we're in simulation mode or demo mode
  if (SIMULATION_MODE || DEMO_MODE) {
    let mode = SIMULATION_MODE ? "SIMULATION" : "DEMO";
    console.log(`Running in ${mode} mode - ${SIMULATION_MODE ? 'no' : 'simulated'} transactions will be sent`);
    console.log(`Simulating transfer of ${amount} tokens from ${wallet.publicKey.toString()} to ${recipientAddress}`);
    console.log('Transfer successful (simulation)');
    
    if (DEMO_MODE && !SIMULATION_MODE) {
      console.log('\n⚠️ DEMONSTRATION MODE ACTIVE ⚠️');
      console.log('In a real scenario, you would need testnet SOL to transfer tokens.');
      console.log('Get testnet SOL from a faucet using instructions in the get-sol script.');
    }
    
    // Generate a fake transaction signature
    const simulatedSignature = '5KP3JKvZdYBzPaZnvQMVMSMoFgHRR5jZ2BEYtxnQGEjKRL7Y1xjFt6n6kgm3RHyTL8J9o5WhQ8fyEbTsn8jWn6rN';
    return simulatedSignature;
  }
  
  const mint = new PublicKey(tokenMintAddress);
  const recipient = new PublicKey(recipientAddress);
  
  // Get or create sender token account
  const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    mint,
    wallet.publicKey
  );
  
  // Get or create recipient token account
  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    mint,
    recipient
  );
  
  // Transfer tokens
  const signature = await transfer(
    connection,
    wallet,
    senderTokenAccount.address,
    recipientTokenAccount.address,
    wallet,
    amount
  );
  
  console.log('Transfer successful:', signature);
  return signature;
}

/**
 * Check token balance
 * @param {string} tokenMintAddress - Token mint address
 * @param {string} walletAddress - Wallet address to check (defaults to owner wallet)
 * @returns {Promise<number>} Token balance
 */
async function checkTokenBalance(tokenMintAddress, walletAddress = null) {
  const connection = getConnection();
  const wallet = getKeypairFromFile(process.env.WALLET_PRIVATE_KEY);
  
  // Check if we're in simulation mode or demo mode
  if (SIMULATION_MODE || DEMO_MODE) {
    let mode = SIMULATION_MODE ? "SIMULATION" : "DEMO";
    console.log(`Running in ${mode} mode - returning simulated balance`);
    const ownerStr = walletAddress || wallet.publicKey.toString();
    
    // Generate a deterministic balance based on the addresses
    const baseBalance = 1000000000; // 1 billion base tokens
    
    // If it's the owner wallet, return the full amount, otherwise a smaller amount
    if (!walletAddress || ownerStr === wallet.publicKey.toString()) {
      console.log('Simulated balance (owner wallet)');
      
      if (DEMO_MODE && !SIMULATION_MODE) {
        console.log('\n⚠️ DEMONSTRATION MODE ACTIVE ⚠️');
        console.log('In a real scenario, this would be your actual token balance on testnet.');
      }
      
      return baseBalance;
    } else {
      // For other wallets, return a smaller amount based on address
      const reducedBalance = baseBalance / 10; // 100 million
      
      if (DEMO_MODE && !SIMULATION_MODE) {
        console.log('\n⚠️ DEMONSTRATION MODE ACTIVE ⚠️');
        console.log('In a real scenario, this would be the actual token balance of this wallet on testnet.');
      }
      
      return reducedBalance;
    }
  }
  
  // Real implementation
  const mint = new PublicKey(tokenMintAddress);
  const owner = walletAddress ? new PublicKey(walletAddress) : wallet.publicKey;
  
  try {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mint,
      owner
    );
    
    const accountInfo = await getAccount(connection, tokenAccount.address);
    return Number(accountInfo.amount);
  } catch (error) {
    console.error('Error checking balance:', error);
    return 0;
  }
}

/**
 * Disables further minting for a token
 * @param {string} tokenMintAddress - Token mint address
 * @returns {Promise<string>} Transaction signature
 */
async function disableMinting(tokenMintAddress) {
  const connection = getConnection();
  const wallet = getKeypairFromFile(process.env.WALLET_PRIVATE_KEY);
  
  // Check if we're in simulation mode or demo mode
  if (SIMULATION_MODE || DEMO_MODE) {
    let mode = SIMULATION_MODE ? "SIMULATION" : "DEMO";
    console.log(`Running in ${mode} mode - ${SIMULATION_MODE ? 'no' : 'simulated'} transactions will be sent`);
    console.log(`Simulating disabling minting for token: ${tokenMintAddress}`);
    console.log('Minting disabled successfully (simulation)');
    
    if (DEMO_MODE && !SIMULATION_MODE) {
      console.log('\n⚠️ DEMONSTRATION MODE ACTIVE ⚠️');
      console.log('In a real scenario, this would permanently disable minting of new tokens.');
      console.log('This operation would be irreversible on the actual blockchain.');
    }
    
    // Generate a fake transaction signature
    const simulatedSignature = '4HTGSrNWY5qFLGmSYYpCKTkdwEYFFFZ3gCNT7yXTQ2tQmEXB3yzNqArRfzZPq8UdLKd2rYm3MQPVZyTHSXyDzFt6';
    return simulatedSignature;
  }
  
  const mint = new PublicKey(tokenMintAddress);
  
  // Create a transaction to set mint authority to null
  const transaction = new Transaction().add(
    createSetAuthorityInstruction(
      mint,
      wallet.publicKey,
      AuthorityType.MintTokens,
      null
    )
  );
  
  const signature = await sendAndConfirmTransaction(
    connection, 
    transaction, 
    [wallet]
  );
  
  console.log('Minting disabled:', signature);
  return signature;
}

module.exports = {
  mintToken,
  transferTokens,
  checkTokenBalance,
  disableMinting
};