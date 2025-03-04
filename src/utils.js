/**
 * @fileoverview Utility functions for Solana token operations
 * 
 * This module provides helper functions used throughout the application
 * for wallet management, value conversion, and other utility operations.
 * 
 * @author Your Name
 * @version 1.0.0
 */

const fs = require('fs');
const { Keypair } = require('@solana/web3.js');

/**
 * Get a Solana keypair from a file
 * @param {string} filePath - Path to the keypair file
 * @returns {Keypair} Solana keypair
 */
function getKeypairFromFile(filePath) {
  const secretKeyString = fs.readFileSync(filePath, { encoding: 'utf8' });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}

/**
 * Convert lamports to SOL
 * @param {number} lamports - Amount in lamports
 * @returns {number} Amount in SOL
 */
function lamportsToSol(lamports) {
  return lamports / 1000000000;
}

/**
 * Convert SOL to lamports
 * @param {number} sol - Amount in SOL
 * @returns {number} Amount in lamports
 */
function solToLamports(sol) {
  return sol * 1000000000;
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after the sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  getKeypairFromFile,
  lamportsToSol,
  solToLamports,
  sleep
};