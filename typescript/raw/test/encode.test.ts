import { describe, it, expect } from 'vitest';
import { encodeAndSignTransaction } from '../src/encode';

describe('encodeAndSignTransaction', () => {
  it('EIP-1559形式でエンコードが成功する', () => {
    const privKey =
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    const transaction: any = {
      type: 2,
      chainId: 1,
      nonce: 0,
      maxPriorityFeePerGas: 1000000000n,
      maxFeePerGas: 1000000000n,
      gasLimit: 21000n,
      to: '0x000000000000000000000000000000000000dEaD',
      value: 1000000000000n,
    };

    const rawTx = encodeAndSignTransaction(transaction, privKey);

    expect(rawTx).toEqual(
      '0x02f86f0180843b9aca00843b9aca0082520894000000000000000000000000000000000000dead85e8d4a5100080c001a08e6a21c9e7d10be1d3b4ab85108bb7373d0a6b77a317ea207bc6621381ad0460a067fc2c8b79ab4c212e8dbc08a4baab706f04929018955b04e360b2d0e78ccd98',
    );
  });
});
