#!/usr/bin/env ts-node

import { ethers } from 'ethers';
import { readAndValidateTransaction, readTxJsonFromFile } from './tx-reader';

async function main() {
  const privKey = process.env.PRIVATE_KEY;

  if (!privKey) {
    throw new Error('PRIVATE_KEY is not set');
  }

  const wallet = new ethers.Wallet(privKey);

  const file = process.argv[2];
  const jsonData = readTxJsonFromFile(file);
  const tx = readAndValidateTransaction(jsonData);

  const signedTx = await wallet.signTransaction(tx);

  console.log(signedTx);
}

main().catch(console.error);
