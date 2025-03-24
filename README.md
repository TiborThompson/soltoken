# SolToken - Solana Token Generator & Manager



<p align="center">
  <strong>A comprehensive toolkit for creating and managing custom tokens on Solana</strong>
</p>

<p align="center">
  <a href="#live-demo">Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#usage">Usage</a> •
  <a href="#real-world-applications">Applications</a> •
  <a href="#license">License</a>
</p>

![Token Management Demo](https://img.shields.io/badge/Demo-Online-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Solana](https://img.shields.io/badge/Solana-1.14.x-blue)
![Node](https://img.shields.io/badge/Node-16.x-green)

---

## Live Demo

Check out our test token (TST) on the Solana devnet: [FJfdRrcLA2wH9mz5KzKf5HQ5JhRpVaEf3yQ5RLfgZgQK](https://explorer.solana.com/?cluster=devnet&customUrl=FJfdRrcLA2wH9mz5KzKf5HQ5JhRpVaEf3yQ5RLfgZgQK)

## Features

- **Token Creation**: Launch your own SPL token in minutes
- **Minting Controls**: Mint tokens and optionally lock supply forever
- **Transfer Management**: Easily transfer tokens between wallets
- **Balance Tracking**: Check token balances with one command
- **Network Flexibility**: Works on mainnet, testnet, and devnet
- **Development Mode**: Simulation mode for safe testing
- **SOL Utilities**: Get testnet/devnet SOL through faucets
- **Comprehensive Documentation**: Clear instructions for all functions

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/soltoken.git
   cd soltoken
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Solana wallet:
   ```bash
   solana-keygen new -o wallet.json
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

5. Edit the `.env` file with your token details and wallet path.

## Quick Start

1. **Get SOL for transactions**: 
   ```bash
   npm run get-sol
   ```

2. **Create your token**:
   ```bash
   npm run mint
   ```
   This creates your token with your configured name, symbol and supply.

3. **Check your balance**:
   ```bash
   npm run balance
   ```

## Usage

### Creating a Token

```bash
npm run mint
```

This creates a new token with parameters defined in your `.env` file:
- `TOKEN_NAME`: The name of your token (e.g., "MyToken")
- `TOKEN_SYMBOL`: The ticker symbol (e.g., "MTK")
- `TOKEN_DECIMALS`: Decimal precision (typically 9)
- `TOKEN_SUPPLY`: Initial supply to mint

### Transferring Tokens

```bash
npm run transfer -- --to <RECIPIENT_ADDRESS> --amount <AMOUNT>
```

Example:
```bash
npm run transfer -- --to 5hFSKLpZMr3wBpyHJeitcDgP8FrDerfBAZvJek4jg2Xr --amount 1000000000
```

### Checking Balances

Check your wallet's balance:
```bash
npm run balance
```

Check another wallet's balance:
```bash
npm run balance -- --wallet <WALLET_ADDRESS>
```

### Disabling Further Minting

Make your token fixed-supply:
```bash
npm run disable-minting -- --confirm yes
```
**Warning**: This operation is irreversible.

### Using with Different Networks

Change the network in your `.env` file:
```
SOLANA_NETWORK=mainnet|devnet|testnet
```

## Real-World Applications

- **Community Tokens**: Create tokens for online communities
- **Loyalty Programs**: Issue tokens as rewards for customer loyalty
- **Gaming Assets**: Develop in-game currencies and assets
- **NFT Projects**: Build foundation for NFT collections
- **Startup Funding**: Create tokens for early investors
- **Educational Purposes**: Learn Solana blockchain development

## Advanced Configuration

### Simulation Mode

Set `SIMULATION_MODE=true` in your `.env` file to test without actual blockchain transactions.

### Token Metadata

Customize your token's metadata in the `.env` file:

```
TOKEN_NAME=YourToken
TOKEN_SYMBOL=YTK
TOKEN_DECIMALS=9
TOKEN_SUPPLY=1000000000
```

## Project Structure

```
soltoken/
├── config/              # Configuration files
├── scripts/             # Command-line tools
│   ├── mint-token.js    # Token creation script
│   ├── transfer-token.js # Token transfer script
│   ├── check-balance.js # Balance checker
│   ├── get-sol.js       # SOL acquisition utility
│   └── disable-minting.js # Mint authority management
├── src/                 # Core functionality
│   ├── token-service.js # Token operations
│   ├── utils.js         # Utility functions
│   └── index.js         # Main entry point
└── tests/               # Unit and integration tests
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Solana Foundation](https://solana.com) for building an amazing blockchain
- [Solana Web3.js](https://github.com/solana-labs/solana-web3.js) for JavaScript bindings
- [SPL Token Program](https://spl.solana.com/token) for token standard

---

<p align="center">
  Made with passion by <a href="https://github.com/TiborThompson">Tibor Thompson</a>
</p>
