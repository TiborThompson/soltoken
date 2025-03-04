const { checkTokenBalance } = require('../src/token-service');
require('dotenv').config();

// Helper to parse command line arguments
function getArg(flag) {
  const index = process.argv.indexOf(flag);
  return index > -1 ? process.argv[index + 1] : null;
}

async function main() {
  try {
    // Get parameters from command line or use defaults
    const mintAddress = getArg('--mint') || process.env.TOKEN_MINT_ADDRESS;
    const walletAddress = getArg('--wallet') || null; // If not specified, use owner wallet
    
    if (!mintAddress) {
      console.error('Error: Token mint address not provided');
      console.log('Usage: npm run balance -- --mint <mint-address> [--wallet <wallet-address>]');
      return;
    }
    
    console.log('Checking token balance...');
    console.log(`Token: ${mintAddress}`);
    if (walletAddress) {
      console.log(`Wallet: ${walletAddress}`);
    } else {
      console.log('Wallet: Owner wallet (from .env file)');
    }
    
    // Check the token balance
    const balance = await checkTokenBalance(mintAddress, walletAddress);
    
    console.log(`\nToken Balance: ${balance}`);
    
    // Try to load token info from file
    try {
      // Assuming the token info file might exist
      const fs = require('fs');
      const files = fs.readdirSync('./');
      const tokenInfoFile = files.find(file => file.startsWith('token-info-') && file.endsWith('.json'));
      
      if (tokenInfoFile) {
        const tokenInfo = JSON.parse(fs.readFileSync(tokenInfoFile, 'utf8'));
        if (tokenInfo.mintAddress === mintAddress) {
          const tokenDecimals = tokenInfo.decimals || 9;
          const actualBalance = balance / Math.pow(10, tokenDecimals);
          console.log(`Actual Balance: ${actualBalance} ${tokenInfo.symbol}`);
        }
      }
    } catch (error) {
      // Silently ignore errors trying to load token info
    }
    
  } catch (error) {
    console.error('Error checking token balance:', error);
  }
}

main();