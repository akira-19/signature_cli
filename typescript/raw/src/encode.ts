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

  const messageHash = createMessageHash(encoded);

  const signature = secp256k1.sign(messageHash, privKey, { lowS: true });

  const signedPayload = [...tx, signature.recovery, signature.r, signature.s];

  const encodedSigned = RLP.encode(signedPayload);

  return encodeSignedTransaction(encodedSigned);
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

const createMessageHash = (encodedTx: Uint8Array<ArrayBufferLike>) => {
  const signingPayload = new Uint8Array(1 + encodedTx.length);
  signingPayload.set([0x02], 0);
  signingPayload.set(encodedTx, 1);
  return keccak256(signingPayload);
};

const encodeSignedTransaction = (
  rlpEncodedSig: Uint8Array<ArrayBufferLike>,
): string => {
  const finalTx = new Uint8Array(1 + rlpEncodedSig.length);
  finalTx.set([0x02], 0);
  finalTx.set(rlpEncodedSig, 1);

  return `0x${Buffer.from(finalTx).toString('hex')}`;
};
