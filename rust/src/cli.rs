use clap::Parser;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    #[arg(
        short,
        long,
        help = "needs the path of transaction json file",
        required = true
    )]
    pub path: String,
}
