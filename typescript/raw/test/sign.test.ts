import { describe, it, expect } from 'vitest';
import { ethers } from 'ethers';

describe('署名の検証', () => {
  it('署名されたトランザクションの from アドレスが正しいことを確認する', async () => {
    const wallet = ethers.Wallet.createRandom();
    const expectedAddress = await wallet.getAddress();

    const tx = {
      type: 2,
      chainId: 1,
      nonce: 0,
      to: '0x0000000000000000000000000000000000000001',
      value: BigInt(1000000000000000000000),
      gasLimit: 21000,
      maxPriorityFeePerGas: BigInt(1000000000000000000000),
      maxFeePerGas: BigInt(1000000000000000000000),
    };

    const signedTx = await wallet.signTransaction(tx);

    const parsed = ethers.Transaction.from(signedTx);

    expect(parsed.from?.toLowerCase()).toBe(expectedAddress.toLowerCase());
  });
});
