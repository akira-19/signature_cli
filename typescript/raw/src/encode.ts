import { RLP } from '@ethereumjs/rlp';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { Transaction } from './tx-reader';

export const encodeAndSignTransaction = (
  transaction: Transaction,
  privKey: string,
): string => {
  const tx = buildTransactionPayload(transaction);

  const encoded = RLP.encode(tx);

  const signingPayload = new Uint8Array(1 + encoded.length);
  signingPayload.set([0x02], 0);
  signingPayload.set(encoded, 1);

  const messageHash = keccak256(signingPayload);
  const sig = secp256k1.sign(messageHash, privKey, { lowS: true });

  const signedPayload = addSignatureToPayload(tx, sig.recovery, sig.r, sig.s);

  const encodedSigned = RLP.encode(signedPayload);
  const finalTx = new Uint8Array(1 + encodedSigned.length);
  finalTx.set([0x02], 0);
  finalTx.set(encodedSigned, 1);

  const rawTx = `0x${Buffer.from(finalTx).toString('hex')}`;
  return rawTx;
};

const buildTransactionPayload = (transaction: Transaction) => {
  switch (transaction.type) {
    case 2:
      return [
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
    default:
      throw new Error('not supported type');
  }
};

const addSignatureToPayload = (
  payload: any,
  v: number,
  r: bigint,
  s: bigint,
) => {
  const payloadWithSignature = [...payload, v, r, s];

  return payloadWithSignature;
};
