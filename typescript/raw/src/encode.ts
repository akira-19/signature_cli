import { RLP } from '@ethereumjs/rlp';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';

export const encodeTransaction = (transaction: any): string => {
  const tx = [
    transaction.chainId,
    transaction.nonce,
    transaction.maxPriorityFeePerGas,
    transaction.maxFeePerGas,
    transaction.gasLimit,
    transaction.to,
    transaction.value,
    new Uint8Array([]),
    [],
  ];
  const encoded = RLP.encode(tx);

  const signingPayload = new Uint8Array(1 + encoded.length);
  signingPayload.set([0x02], 0);
  signingPayload.set(encoded, 1);

  const privKey = process.env.PRIVATE_KEY!;

  const messageHash = keccak256(signingPayload);
  const sig = secp256k1.sign(messageHash, privKey, { lowS: true });

  console.log('r', sig.r);
  console.log('s', sig.s);
  console.log('recovery', sig.recovery);

  const signedTx = [
    transaction.chainId,
    transaction.nonce,
    transaction.maxPriorityFeePerGas,
    transaction.maxFeePerGas,
    transaction.gasLimit,
    transaction.to,
    transaction.value,
    new Uint8Array([]),
    [],
    sig.recovery,
    sig.r,
    sig.s,
  ];

  const encodedSigned = RLP.encode(signedTx);
  const finalTx = new Uint8Array(1 + encodedSigned.length);
  finalTx.set([0x02], 0);
  finalTx.set(encodedSigned, 1);

  const rawTx = `0x${Buffer.from(finalTx).toString('hex')}`;
  return rawTx;
};
