#!/usr/bin/env ts-node

import { readAndValidateTransaction, readTxJsonFromFile } from './tx-reader';
import { encodeAndSignTransaction } from './encode';

async function main() {
  const privKey = process.env.PRIVATE_KEY;

  if (!privKey) {
    throw new Error('PRIVATE_KEY is not set');
  }

  const file = process.argv[2];
  const jsonData = readTxJsonFromFile(file);
  const tx = readAndValidateTransaction(jsonData);
  const sig = encodeAndSignTransaction(tx, privKey);

  console.log(sig);
}

main().catch(console.error);
