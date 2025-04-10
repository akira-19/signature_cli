use clap::Parser;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    #[arg(short, long, help = "sign a transaction", required = true)]
    pub sign: String,
}
