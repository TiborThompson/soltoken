# SolToken CLI Reference

This document provides detailed information about using the SolToken command-line interface.

## Global Options

These options apply to all commands:

- `--help`: Display help information for a command
- `--network`: Specify the Solana network (mainnet, testnet, devnet)

## Commands

### Get SOL

Request SOL from a faucet (for testnet/devnet use).

```bash
npm run get-sol
```

Options:
- `--amount`: Amount of SOL to request (default: 1)

### Create and Mint Token

Create a new token and mint the initial supply.

```bash
npm run mint
```

The token parameters are read from the .env file:
- `TOKEN_NAME`: Name of the token
- `TOKEN_SYMBOL`: Symbol/ticker
- `TOKEN_DECIMALS`: Decimal places (usually 9)
- `TOKEN_SUPPLY`: Initial supply to mint

### Check Token Balance

Check the balance of a token in a wallet.

```bash
npm run balance [options]
```

Options:
- `--mint`: The token's mint address
- `--wallet`: Wallet address to check (default: your wallet)

Examples:
```bash
# Check your balance
npm run balance -- --mint FJfdRrcLA2wH9mz5KzKf5HQ5JhRpVaEf3yQ5RLfgZgQK

# Check another wallet's balance
npm run balance -- --mint FJfdRrcLA2wH9mz5KzKf5HQ5JhRpVaEf3yQ5RLfgZgQK --wallet 5hFSKLpZMr3wBpyHJeitcDgP8FrDerfBAZvJek4jg2Xr
```

### Transfer Tokens

Transfer tokens from your wallet to another wallet.

```bash
npm run transfer [options]
```

Options:
- `--mint`: The token's mint address
- `--to`: Recipient wallet address
- `--amount`: Amount of tokens to send

Example:
```bash
npm run transfer -- --mint FJfdRrcLA2wH9mz5KzKf5HQ5JhRpVaEf3yQ5RLfgZgQK --to 5hFSKLpZMr3wBpyHJeitcDgP8FrDerfBAZvJek4jg2Xr --amount 1000000000
```

### Disable Minting

Permanently disable the ability to mint new tokens.

```bash
npm run disable-minting [options]
```

Options:
- `--mint`: The token's mint address
- `--confirm`: Set to "yes" to confirm this irreversible action

Example:
```bash
npm run disable-minting -- --mint FJfdRrcLA2wH9mz5KzKf5HQ5JhRpVaEf3yQ5RLfgZgQK --confirm yes
```

**Warning**: This operation is irreversible. Once you disable minting, no more tokens can ever be created.

## Environment Configuration

The SolToken CLI uses environment variables for configuration. These can be set in a `.env` file:

```
# Solana configuration
SOLANA_NETWORK=devnet
SIMULATION_MODE=false

# Wallet
WALLET_PRIVATE_KEY=/path/to/your/wallet.json

# Token details 
TOKEN_NAME=MyToken
TOKEN_SYMBOL=MTK
TOKEN_DECIMALS=9
TOKEN_SUPPLY=1000000000

# Created token mint address (set automatically after minting)
TOKEN_MINT_ADDRESS=your_token_mint_address
```

## Error Handling

Common error situations and solutions:

- **"Not enough SOL"**: Get SOL from a faucet with `npm run get-sol`
- **"Invalid mint address"**: Double-check the token mint address
- **"Transaction simulation failed"**: Usually means insufficient SOL for transaction fees
- **"Invalid recipient address"**: Ensure the recipient address is correct