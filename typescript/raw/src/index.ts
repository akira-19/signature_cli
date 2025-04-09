#!/usr/bin/env ts-node

import * as fs from 'fs';
import { readAndValidateTransaction } from './tx-reader';
import { encodeTransaction } from './encode';

async function main() {
  const privKey = process.env.PRIVATE_KEY;

  if (!privKey) {
    throw new Error('PRIVATE_KEY is not set');
  }

  const rawData = fs.readFileSync('./tx.json', 'utf-8');
  const jsonData = JSON.parse(rawData);
  const tx = readAndValidateTransaction(jsonData);
  const sig = encodeTransaction(tx);

  console.log(sig);
}

main().catch(console.error);
