# SolToken Installation Guide

This guide will walk you through the installation and setup process for SolToken.

## Prerequisites

Before installing SolToken, you need to have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Solana CLI tools (optional, but recommended)

## Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/soltoken.git
   cd soltoken
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a Solana wallet**

   If you don't already have a Solana wallet, you can create one with:

   ```bash
   solana-keygen new -o wallet.json
   ```

   This creates a new keypair file called `wallet.json` in the current directory. Keep this file secure as it contains your private key.

4. **Configure the environment**

   Create a `.env` file based on the example:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file and update the values:
   
   - Set `WALLET_PRIVATE_KEY` to the path of your wallet.json file
   - Customize `TOKEN_NAME`, `TOKEN_SYMBOL`, `TOKEN_DECIMALS`, and `TOKEN_SUPPLY`
   - Choose your `SOLANA_NETWORK` (mainnet, testnet, devnet)
   - Set `SIMULATION_MODE` to `true` for testing or `false` for real transactions

5. **Verify the installation**

   Run the application to verify everything is installed correctly:

   ```bash
   npm start
   ```

   You should see the welcome message and available commands.

## Getting SOL for Transactions

If you're using the Solana testnet or devnet, you'll need some SOL to pay for transactions:

```bash
npm run get-sol
```

This will guide you through the process of getting SOL from a faucet.

## Next Steps

Now that you have SolToken installed, you can:

- Create your first token: `npm run mint`
- Check your token balance: `npm run balance`
- Transfer tokens: `npm run transfer`

For more detailed usage information, see the [CLI Reference](../CLI.md).