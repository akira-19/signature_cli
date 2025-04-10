mod cli;
mod handler;
mod reader;
mod sign;
mod transaction;

use handler::sign_handler;

use anyhow::Result;
use clap::Parser;
use cli::Args;

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();

    let path = args.path;

    sign_handler(path.as_str()).await?;

    Ok(())
}
