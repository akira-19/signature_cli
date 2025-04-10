use anyhow::{Context, Result};
use serde::Deserialize;
use std::fs;

#[derive(Debug, Deserialize)]
struct TxType {
    #[serde(rename = "type")]
    tx_type: u8,
}

#[derive(Debug, Deserialize)]
pub struct Eip1559Tx {
    #[serde(rename = "type")]
    pub tx_type: u8,
    pub to: String,
    pub value: String,
    pub gasLimit: String,
    pub maxPriorityFeePerGas: String,
    pub maxFeePerGas: String,
    pub nonce: u64,
    pub chainId: u64,
}

#[derive(Debug)]
pub enum ParsedTx {
    Eip1559(Eip1559Tx),
}

pub fn read_tx_json(path: &str) -> Result<ParsedTx> {
    let json_str = fs::read_to_string(path).context("Failed to read transaction JSON file")?;
    let type_hint: TxType =
        serde_json::from_str(&json_str).context("Invalid or missing 'type' field")?;

    match type_hint.tx_type {
        2 => {
            let parsed: Eip1559Tx = serde_json::from_str(&json_str)
                .context("Failed to parse as EIP-1559 transaction")?;

            Ok(ParsedTx::Eip1559(parsed))
        }
        _ => Err(anyhow::anyhow!(
            "Unsupported transaction type: {}",
            type_hint.tx_type
        )),
    }
}
