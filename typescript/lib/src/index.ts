#!/usr/bin/env ts-node

import { ethers } from 'ethers';
import { readAndValidateTransaction } from './tx-reader';
import * as fs from 'fs';

async function main() {
  const privKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.RPC_URL;

  if (!privKey) {
    throw new Error('PRIVATE_KEY is not set');
  }

  if (!rpcUrl) {
    throw new Error('RPC_URL is not set');
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privKey, provider);

  const rawData = fs.readFileSync('./tx.json', 'utf-8');
  const jsonData = JSON.parse(rawData);
  const tx = readAndValidateTransaction(jsonData);

  const signedTx = await wallet.signTransaction(tx);

  console.log(signedTx);
}

main().catch(console.error);
