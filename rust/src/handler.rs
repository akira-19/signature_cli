use crate::reader::read_tx_json;
use crate::sign::sign_and_encode_tx;
use crate::transaction::build_tx;

use anyhow::Result;
use std::env;

pub async fn sign_handler(path: &str) -> Result<()> {
    let parsed = read_tx_json(path)?;

    let mut tx = build_tx(&parsed)?;

    let key = "PRIVATE_KEY";
    let private_key = env::var(key).expect("Please set the PRIVATE_KEY environment variable");

    let signature = sign_and_encode_tx(&mut tx, &private_key).await?;

    println!("0x{}", signature);

    Ok(())
}
