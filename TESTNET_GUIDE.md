# Using This Project on Solana Testnet

This guide explains how to use this project with the actual Solana testnet, not just in simulation mode.

## Step 1: Generate a Solana Wallet

If you haven't already created a wallet, generate one using:

```bash
solana-keygen new -o wallet.json
```

This creates a file called `wallet.json` containing your private key. Keep this file secure and never share it.

The command will output your public key, which is your wallet address.

## Step 2: Get Testnet SOL

You'll need some testnet SOL to pay for transactions. There are several ways to get it:

### Option 1: Use the Solana Faucet Website

1. Visit https://faucet.solana.com
2. Enter your wallet address (the public key from step 1)
3. Click "Request airdrop"

### Option 2: Use the Solana CLI

```bash
solana airdrop 2 <YOUR_WALLET_ADDRESS> --url https://api.testnet.solana.com
```

### Option 3: Use the project's get-sol script 

```bash
npm run get-sol
```

This will attempt to request SOL from various faucets. Due to rate limiting, it might not always succeed.

## Step 3: Configure Your Environment

1. Update your `.env` file:
   - Set `SIMULATION_MODE=false`
   - Ensure your `WALLET_PRIVATE_KEY` points to your wallet.json file
   - Set your token details as desired

## Step 4: Create and Mint Your Token

Run:

```bash
npm run mint
```

This will:
1. Create a new token on the Solana testnet
2. Mint your specified initial supply
3. Save the token information locally
4. Update your .env file with the token mint address

## Step 5: Transfer Tokens

Send tokens to another wallet:

```bash
npm run transfer -- --to <RECIPIENT_WALLET_ADDRESS> --amount <AMOUNT>
```

For example:
```bash
npm run transfer -- --to 5hFSKLpZMr3wBpyHJeitcDgP8FrDerfBAZvJek4jg2Xr --amount 1000000
```

## Step 6: Check Token Balances

Check your token balance:
```bash
npm run balance
```

Check another wallet's token balance:
```bash
npm run balance -- --wallet <WALLET_ADDRESS>
```

## Step 7 (Optional): Disable Further Minting

If you want to make your token fixed-supply and prevent further minting:

```bash
npm run disable-minting -- --mint <TOKEN_MINT_ADDRESS> --confirm yes
```

WARNING: This operation is irreversible. Once you disable minting, no more tokens can EVER be created.

## Troubleshooting

### "Not enough SOL to perform the operation"
- Your wallet needs more testnet SOL. Try getting more from a faucet.

### "Transaction simulation failed"
- Check your wallet balance using `solana balance`
- Ensure your network is set to testnet: `solana config set --url testnet`

### "Invalid blockhash"
- The testnet may be experiencing high load. Try again later.

## Viewing Your Token on Solana Explorer

You can see your token on the Solana Explorer:
1. Visit https://explorer.solana.com/?cluster=testnet
2. Enter your token mint address in the search bar
3. You'll see all transactions and information about your token