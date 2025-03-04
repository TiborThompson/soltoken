/**
 * @fileoverview Token Creation and Minting Script
 * 
 * This script handles the creation of a new SPL token on the Solana blockchain
 * and mints the initial supply. The token's properties (name, symbol, decimals,
 * and supply) are configured through the .env file.
 * 
 * The script:
 * 1. Creates a new token with the specified parameters
 * 2. Mints the initial supply to the wallet
 * 3. Saves token information to a JSON file for reference
 * 4. Updates the .env file with the token mint address
 * 
 * Usage: npm run mint
 * 
 * @author Your Name
 * @version 1.0.0
 */

const { mintToken } = require('../src/token-service');
const fs = require('fs');
require('dotenv').config();
const path = require('path');

async function main() {
  try {
    console.log('Starting token minting process...');
    
    // Get token details from environment variables
    const tokenName = process.env.TOKEN_NAME || 'DefaultToken';
    const tokenSymbol = process.env.TOKEN_SYMBOL || 'DFLT';
    const decimals = parseInt(process.env.TOKEN_DECIMALS) || 9;
    const supply = parseInt(process.env.TOKEN_SUPPLY) || 1000000000;
    
    console.log(`Token Details:`);
    console.log(`- Name: ${tokenName}`);
    console.log(`- Symbol: ${tokenSymbol}`);
    console.log(`- Decimals: ${decimals}`);
    console.log(`- Total Supply: ${supply}`);
    
    // Create and mint the token
    const result = await mintToken({
      decimals,
      amount: supply
    });
    
    const mintAddress = result.mint.toString();
    
    // Save token info for future reference
    const tokenInfo = {
      name: tokenName,
      symbol: tokenSymbol,
      decimals: decimals,
      totalSupply: supply,
      mintAddress: mintAddress,
      tokenAccount: result.tokenAccount.toString(),
      createdAt: new Date().toISOString()
    };
    
    // Save to a JSON file
    const jsonFilePath = `./token-info-${tokenSymbol.toLowerCase()}.json`;
    fs.writeFileSync(
      jsonFilePath,
      JSON.stringify(tokenInfo, null, 2)
    );
    
    // Update .env file to include token mint address
    const envFilePath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envFilePath)) {
      let envContent = fs.readFileSync(envFilePath, 'utf8');
      
      // Check if TOKEN_MINT_ADDRESS already exists (including commented version)
      if (envContent.includes('TOKEN_MINT_ADDRESS=')) {
        // Replace existing value, including if it's commented out
        envContent = envContent.replace(
          /\s*#?\s*TOKEN_MINT_ADDRESS=.*/,
          `TOKEN_MINT_ADDRESS=${mintAddress}`
        );
      } else {
        // Add new entry
        if (envContent.endsWith('\n')) {
          envContent += `TOKEN_MINT_ADDRESS=${mintAddress}\n`;
        } else {
          envContent += `\nTOKEN_MINT_ADDRESS=${mintAddress}\n`;
        }
      }
      
      fs.writeFileSync(envFilePath, envContent);
      console.log('.env file updated with token mint address');
    }
    
    console.log('\nToken created successfully!');
    console.log('Token info saved to:', jsonFilePath);
    console.log('\nToken Mint Address:', mintAddress);
    console.log('Use this address for sending tokens and checking balances.');
    
  } catch (error) {
    console.error('Error minting token:', error);
  }
}

main();