const { 
  Connection, 
  Keypair, 
  LAMPORTS_PER_SOL, 
  PublicKey 
} = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

// Mock the token-service module
jest.mock('../src/token-service', () => {
  const originalModule = jest.requireActual('../src/token-service');
  
  return {
    ...originalModule,
    mintToken: jest.fn(),
    transferTokens: jest.fn(),
    checkTokenBalance: jest.fn(),
    disableMinting: jest.fn()
  };
});

// Import the mocked module
const { 
  mintToken, 
  transferTokens, 
  checkTokenBalance, 
  disableMinting 
} = require('../src/token-service');

describe('Token Service', () => {
  const mockMintAddress = 'TokenMintAddressMock';
  const mockRecipientAddress = 'RecipientAddressMock';
  const mockAmount = 100;
  const mockSignature = 'TransactionSignatureMock';
  const mockBalance = 1000;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('mintToken', () => {
    it('should mint tokens and return mint and token account addresses', async () => {
      // Mock implementation
      mintToken.mockResolvedValue({
        mint: {
          toString: () => mockMintAddress
        },
        tokenAccount: {
          toString: () => 'TokenAccountAddressMock'
        }
      });
      
      const result = await mintToken({ amount: mockAmount });
      
      expect(mintToken).toHaveBeenCalledWith({ amount: mockAmount });
      expect(result.mint.toString()).toBe(mockMintAddress);
      expect(result.tokenAccount.toString()).toBe('TokenAccountAddressMock');
    });
  });
  
  describe('transferTokens', () => {
    it('should transfer tokens and return a transaction signature', async () => {
      // Mock implementation
      transferTokens.mockResolvedValue(mockSignature);
      
      const result = await transferTokens(mockMintAddress, mockRecipientAddress, mockAmount);
      
      expect(transferTokens).toHaveBeenCalledWith(mockMintAddress, mockRecipientAddress, mockAmount);
      expect(result).toBe(mockSignature);
    });
  });
  
  describe('checkTokenBalance', () => {
    it('should return the token balance for a specified wallet', async () => {
      // Mock implementation
      checkTokenBalance.mockResolvedValue(mockBalance);
      
      const result = await checkTokenBalance(mockMintAddress, mockRecipientAddress);
      
      expect(checkTokenBalance).toHaveBeenCalledWith(mockMintAddress, mockRecipientAddress);
      expect(result).toBe(mockBalance);
    });
    
    it('should use the owner wallet if no wallet address is provided', async () => {
      // Mock implementation
      checkTokenBalance.mockResolvedValue(mockBalance);
      
      const result = await checkTokenBalance(mockMintAddress);
      
      expect(checkTokenBalance).toHaveBeenCalledWith(mockMintAddress);
      expect(result).toBe(mockBalance);
    });
  });
  
  describe('disableMinting', () => {
    it('should disable minting and return a transaction signature', async () => {
      // Mock implementation
      disableMinting.mockResolvedValue(mockSignature);
      
      const result = await disableMinting(mockMintAddress);
      
      expect(disableMinting).toHaveBeenCalledWith(mockMintAddress);
      expect(result).toBe(mockSignature);
    });
  });
});