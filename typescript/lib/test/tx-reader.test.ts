// readAndValidateTransaction.test.ts
import { describe, it, expect } from 'vitest';
import { readAndValidateTransaction } from '../src/tx-reader'; // 適切なファイル名に変更してください

describe('readAndValidateTransaction', () => {
  const validJson = {
    type: 2,
    to: '0xabc123',
    value: '1000000000000000000',
    gasLimit: '21000',
    maxPriorityFeePerGas: '1000000000',
    maxFeePerGas: '2000000000',
    nonce: 1,
    chainId: 1,
  };

  it('正常系: 正しいデータを変換して返す', () => {
    const result = readAndValidateTransaction(validJson);
    expect(result).toEqual({
      type: 2,
      to: '0xabc123',
      value: BigInt('1000000000000000000'),
      gasLimit: BigInt('21000'),
      maxPriorityFeePerGas: BigInt('1000000000'),
      maxFeePerGas: BigInt('2000000000'),
      nonce: 1,
      chainId: 1,
    });
  });

  it('プロパティが足りない場合はエラーを投げる', () => {
    const missingProp = { ...validJson } as Partial<typeof validJson>;
    delete missingProp.to;

    expect(() => readAndValidateTransaction(missingProp)).toThrowError(
      'Invalid transaction format',
    );
  });

  it('typeが存在しない場合はエラーを投げる', () => {
    const invalidType = { ...validJson, type: 3 };

    expect(() => readAndValidateTransaction(invalidType)).toThrowError(
      'Invalid transaction type',
    );
  });

  it('BigIntに変換できない値がある場合はエラーを投げる', () => {
    const invalidBigInt = { ...validJson, value: 'invalid' };

    expect(() => readAndValidateTransaction(invalidBigInt)).toThrowError();
  });
});
