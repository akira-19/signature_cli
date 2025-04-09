import * as fs from 'fs';

// Type 0: Legacy transaction
export type LegacyTransaction = {
  type: 0;
  to: string;
  value: bigint;
  gasLimit: bigint;
  gasPrice: bigint;
  nonce: number;
  chainId: number;
};

// Type 1: EIP-2930
export type EIP2930Transaction = {
  type: 1;
  to: string;
  value: bigint;
  gasLimit: bigint;
  gasPrice: bigint;
  nonce: number;
  chainId: number;
};

// Type 2: EIP-1559
export type EIP1559Transaction = {
  type: 2;
  to: string;
  value: bigint;
  gasLimit: bigint;
  maxPriorityFeePerGas: bigint;
  maxFeePerGas: bigint;
  nonce: number;
  chainId: number;
};

// トランザクション全体型
export type Transaction =
  | LegacyTransaction
  | EIP2930Transaction
  | EIP1559Transaction;

const FORMAT_ERROR_MESSAGE = 'Invalid transaction format';
const TYPE_ERROR_MESSAGE = 'Invalid transaction type';

export const readAndValidateTransaction = (jsonData: any): Transaction => {
  if (typeof jsonData.type !== 'number' || ![0, 1, 2].includes(jsonData.type)) {
    throw new Error(TYPE_ERROR_MESSAGE);
  }

  if (jsonData.type === 0) {
    return createLegacyTransaction(jsonData);
  } else if (jsonData.type === 1) {
    return createEIP2930Transaction(jsonData);
  } else if (jsonData.type === 2) {
    return createEIP1559Transaction(jsonData);
  }

  throw new Error(FORMAT_ERROR_MESSAGE);
};

const createLegacyTransaction = (jsonData: any): LegacyTransaction => {
  const transaction: LegacyTransaction = {
    type: jsonData.type,
    to: jsonData.to,
    value: BigInt(jsonData.value),
    gasLimit: BigInt(jsonData.gasLimit),
    gasPrice: BigInt(jsonData.gasPrice),
    nonce: jsonData.nonce,
    chainId: jsonData.chainId,
  };

  if (
    typeof transaction.type === 'number' &&
    typeof transaction.to === 'string' &&
    typeof transaction.value === 'bigint' &&
    typeof transaction.gasLimit === 'bigint' &&
    typeof transaction.gasPrice === 'bigint' &&
    typeof transaction.nonce === 'number' &&
    typeof transaction.chainId === 'number'
  ) {
    return transaction;
  }

  throw new Error(FORMAT_ERROR_MESSAGE);
};

const createEIP2930Transaction = (jsonData: any): EIP2930Transaction => {
  const transaction: EIP2930Transaction = {
    type: jsonData.type,
    to: jsonData.to,
    value: BigInt(jsonData.value),
    gasLimit: BigInt(jsonData.gasLimit),
    gasPrice: BigInt(jsonData.gasPrice),
    nonce: jsonData.nonce,
    chainId: jsonData.chainId,
  };

  if (
    typeof transaction.type === 'number' &&
    typeof transaction.to === 'string' &&
    typeof transaction.value === 'bigint' &&
    typeof transaction.gasLimit === 'bigint' &&
    typeof transaction.gasPrice === 'bigint' &&
    typeof transaction.nonce === 'number' &&
    typeof transaction.chainId === 'number'
  ) {
    return transaction;
  }

  throw new Error(FORMAT_ERROR_MESSAGE);
};

const createEIP1559Transaction = (jsonData: any): EIP1559Transaction => {
  const transaction: EIP1559Transaction = {
    type: jsonData.type,
    to: jsonData.to,
    value: BigInt(jsonData.value),
    gasLimit: BigInt(jsonData.gasLimit),
    maxPriorityFeePerGas: BigInt(jsonData.maxPriorityFeePerGas),
    maxFeePerGas: BigInt(jsonData.maxFeePerGas),
    nonce: jsonData.nonce,
    chainId: jsonData.chainId,
  };

  if (
    typeof transaction.type === 'number' &&
    typeof transaction.to === 'string' &&
    typeof transaction.value === 'bigint' &&
    typeof transaction.gasLimit === 'bigint' &&
    typeof transaction.maxPriorityFeePerGas === 'bigint' &&
    typeof transaction.maxFeePerGas === 'bigint' &&
    typeof transaction.nonce === 'number' &&
    typeof transaction.chainId === 'number'
  ) {
    return transaction;
  }

  throw new Error(FORMAT_ERROR_MESSAGE);
};

export const readTxJsonFromFile = (filePath: string) => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};
