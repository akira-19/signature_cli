#!/usr/bin/env ts-node

import { ethers } from 'ethers';
import { readAndValidateTransaction } from './tx-reader';
import * as fs from 'fs';

async function main() {
  // cli引数を取得
  const path = process.argv[2];

  const privKey = process.env.PRIVATE_KEY;

  if (!privKey) {
    throw new Error('PRIVATE_KEY is not set');
  }

  const wallet = new ethers.Wallet(privKey);

  const rawData = fs.readFileSync(path, 'utf-8');
  const jsonData = JSON.parse(rawData);
  const tx = readAndValidateTransaction(jsonData);

  const signedTx = await wallet.signTransaction(tx);

  console.log(signedTx);
}

main().catch(console.error);
