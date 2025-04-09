// use alloy::signers::{Signer, local::PrivateKeySigner};
use alloy::consensus::transaction::RlpEcdsaEncodableTx;
use alloy::{
    consensus::{SignableTransaction, TxEip1559},
    network::TxSigner,
    primitives::{Address, Signature, TxKind, U256},
    signers::{Signer, local::PrivateKeySigner},
};

use hex;
use std::env;

use eyre::Result;
use serde::Deserialize;
use std::{fs, str::FromStr};

#[derive(Debug, Deserialize)]
struct TxJson {
    #[serde(rename = "type")]
    _type: u8, // 今回は type=2 なので使わない
    to: String,
    value: String,
    gasLimit: String,
    maxPriorityFeePerGas: String,
    maxFeePerGas: String,
    nonce: u64,
    chainId: u64,
}

#[tokio::main]
async fn main() -> Result<()> {
    let json_str = fs::read_to_string("tx.json")?;
    let parsed: TxJson = serde_json::from_str(&json_str)?;

    let mut tx = TxEip1559 {
        chain_id: parsed.chainId,
        nonce: parsed.nonce,
        gas_limit: parsed.gasLimit.parse()?,
        to: TxKind::Call(Address::from_str(&parsed.to)?),
        value: U256::from_str(&parsed.value)?,
        input: vec![].into(),
        max_fee_per_gas: parsed.maxFeePerGas.parse().unwrap(),
        max_priority_fee_per_gas: parsed.maxPriorityFeePerGas.parse().unwrap(),
        access_list: Default::default(),
    };

    println!("tx: {:?}", tx);

    let key = "PRIVATE_KEY";
    let private_key = env::var(key).expect("Please set the PRIVATE_KEY environment variable");

    let mut signer: PrivateKeySigner = private_key.parse().unwrap();
    // signer.set_chain_id(Some(tx.chain_id));

    let sig = signer.sign_transaction(&mut tx).await?;

    let mut buffer = Vec::new();
    tx.rlp_encode_signed(&sig, &mut buffer);
    let raw_tx = hex::encode(&buffer);
    println!("0x{}", raw_tx);

    let hex_string = hex::encode(sig.as_bytes());
    println!("0x{}", hex_string);

    Ok(())
}
