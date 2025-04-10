use alloy::{
    consensus::TxEip1559,
    primitives::{Address, TxKind, U256},
};
use anyhow::{Context, Result};
use std::str::FromStr;

use crate::reader::ParsedTx;

#[derive(Debug)]
pub enum Transaction {
    Eip1559(TxEip1559),
}

pub fn build_tx(parsed: &ParsedTx) -> Result<Transaction> {
    match parsed {
        ParsedTx::Eip1559(parsed) => Ok(Transaction::Eip1559(TxEip1559 {
            chain_id: parsed.chainId,
            nonce: parsed.nonce,
            gas_limit: parsed.gasLimit.parse().context("Invalid gasLimit")?,
            to: TxKind::Call(Address::from_str(&parsed.to).context("Invalid 'to' address")?),
            value: U256::from_str(&parsed.value).context("Invalid value")?,
            input: vec![].into(),
            max_fee_per_gas: parsed
                .maxFeePerGas
                .parse()
                .context("Invalid maxFeePerGas")?,
            max_priority_fee_per_gas: parsed
                .maxPriorityFeePerGas
                .parse()
                .context("Invalid maxPriorityFeePerGas")?,
            access_list: Default::default(),
        })),
        _ => {
            return Err(anyhow::anyhow!("Unsupported transaction type"));
        }
    }
}
