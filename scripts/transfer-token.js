const { transferTokens, checkTokenBalance } = require('../src/token-service');
const fs = require('fs');
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
    const recipient = getArg('--to');
    const amountStr = getArg('--amount');
    
    if (!mintAddress) {
      console.error('Error: Token mint address not provided.');
      console.log('Usage: npm run transfer -- --mint <mint-address> --to <recipient-address> --amount <amount>');
      return;
    }
    
    if (!recipient) {
      console.error('Error: Recipient address not provided.');
      console.log('Usage: npm run transfer -- --mint <mint-address> --to <recipient-address> --amount <amount>');
      return;
    }
    
    if (!amountStr) {
      console.error('Error: Amount not provided.');
      console.log('Usage: npm run transfer -- --mint <mint-address> --to <recipient-address> --amount <amount>');
      return;
    }
    
    const amount = parseInt(amountStr);
    if (isNaN(amount) || amount <= 0) {
      console.error('Error: Invalid amount. Must be a positive number.');
      return;
    }
    
    // Check sender balance before transfer
    console.log('Checking balance before transfer...');
    const balanceBefore = await checkTokenBalance(mintAddress);
    console.log(`Current balance: ${balanceBefore}`);
    
    if (balanceBefore < amount) {
      console.error(`Error: Insufficient token balance. Available: ${balanceBefore}, Required: ${amount}`);
      return;
    }
    
    // Perform the transfer
    console.log(`Transferring ${amount} tokens to ${recipient}...`);
    const signature = await transferTokens(mintAddress, recipient, amount);
    
    // Check balance after transfer
    const balanceAfter = await checkTokenBalance(mintAddress);
    
    console.log('\nTransfer complete!');
    console.log(`Transaction signature: ${signature}`);
    console.log(`New balance: ${balanceAfter}`);
    
  } catch (error) {
    console.error('Error transferring tokens:', error);
  }
}

main();