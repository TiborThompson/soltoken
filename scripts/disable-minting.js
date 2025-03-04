const { disableMinting } = require('../src/token-service');
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
    const confirmed = getArg('--confirm') === 'yes';
    
    if (!mintAddress) {
      console.error('Error: Token mint address not provided');
      console.log('Usage: node scripts/disable-minting.js --mint <mint-address> --confirm yes');
      return;
    }
    
    if (!confirmed) {
      console.log('\n⚠️  WARNING: This operation is irreversible! ⚠️');
      console.log('Once minting is disabled, no more tokens can ever be created.');
      console.log('To confirm, re-run this command with the --confirm yes flag.');
      console.log('Usage: node scripts/disable-minting.js --mint <mint-address> --confirm yes');
      return;
    }
    
    console.log('Disabling minting for token:', mintAddress);
    console.log('This operation is irreversible.');
    
    // Disable minting
    const signature = await disableMinting(mintAddress);
    
    console.log('\nMinting disabled successfully!');
    console.log('Transaction signature:', signature);
    console.log('\nNo additional tokens can be minted for this token.');
    
  } catch (error) {
    console.error('Error disabling minting:', error);
  }
}

main();