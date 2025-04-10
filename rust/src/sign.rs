use crate::transaction::Transaction;
use alloy::consensus::transaction::RlpEcdsaEncodableTx;
use alloy::{network::TxSigner, signers::local::PrivateKeySigner};
use anyhow::{Context, Result};
use hex;

pub async fn sign_and_encode_tx(tx: &mut Transaction, private_key: &str) -> Result<String> {
    let signer: PrivateKeySigner = private_key.parse().context("Failed to parse private key")?;

    let mut buffer = Vec::new();

    match tx {
        Transaction::Eip1559(tx) => {
            let sig = signer.sign_transaction(tx).await?;
            tx.eip2718_encode_with_type(&sig, 2, &mut buffer);
        }
        _ => {
            return Err(anyhow::anyhow!("Unsupported transaction type"));
        }
    }

    Ok(hex::encode(buffer))
}

#[cfg(test)]
mod tests {

    use super::*;
    use alloy::{
        consensus::TxEip1559,
        primitives::{TxKind, U256},
    };

    #[tokio::test]
    async fn test_sign_and_encode_eip1559_tx() {
        let mut tx = TxEip1559 {
            chain_id: 1,
            nonce: 0,
            gas_limit: 21_000,
            to: TxKind::Call(
                "0x000000000000000000000000000000000000dEaD"
                    .parse()
                    .unwrap(),
            ),
            value: U256::from(1_000_000_000_000u64),
            input: vec![].into(),
            max_fee_per_gas: 1_000_000_000u64.into(),
            max_priority_fee_per_gas: 1_000_000_000u64.into(),
            access_list: Default::default(),
        };

        let private_key = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

        let mut wrapped = Transaction::Eip1559(tx);

        let result = sign_and_encode_tx(&mut wrapped, private_key).await;

        assert!(result.is_ok());
        let raw_tx = result.unwrap();
        assert_eq!(
            "02f86f0180843b9aca00843b9aca0082520894000000000000000000000000000000000000dead85e8d4a5100080c001a08e6a21c9e7d10be1d3b4ab85108bb7373d0a6b77a317ea207bc6621381ad0460a067fc2c8b79ab4c212e8dbc08a4baab706f04929018955b04e360b2d0e78ccd98",
            raw_tx
        );
    }

    #[tokio::test]
    async fn invalid_key_fails() {
        let mut tx = TxEip1559 {
            chain_id: 1,
            nonce: 0,
            gas_limit: 21_000,
            to: TxKind::Call(
                "0x000000000000000000000000000000000000dEaD"
                    .parse()
                    .unwrap(),
            ),
            value: U256::from(1_000_000_000_000u64),
            input: vec![].into(),
            max_fee_per_gas: 1_000_000_000u64.into(),
            max_priority_fee_per_gas: 1_000_000_000u64.into(),
            access_list: Default::default(),
        };

        let mut wrapped = Transaction::Eip1559(tx);

        let bad_key = "not_a_valid_key";

        let result = sign_and_encode_tx(&mut wrapped, bad_key).await;

        assert!(result.is_err());

        let err_msg = format!("{}", result.unwrap_err());
        assert!(
            err_msg.contains("Failed to parse private key") || err_msg.contains("invalid"),
            "Unexpected error message: {err_msg}"
        );
    }
}
