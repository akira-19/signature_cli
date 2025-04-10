# signature_cli

1. Sign with Ethers.js - TypeScript
2. Sign with ethereum-cryptography - TypeScript
3. Sign with alloy - Rust

# 1. Sign with Ethers.js - TypeScript

```
# cd typescript/lib

# pnpm install

# export PRIVATE_KEY="your private key"

# pnpm run sign ./tx.json
```

# 2. Sign with ethereum-cryptography - TypeScript

```
# cd typescript/raw

# pnpm install

# export PRIVATE_KEY="your private key"

# pnpm run sign ./tx.json
```

# 3. Sign with alloy - Rust

```
# cd rust

# export PRIVATE_KEY="your private key"

# cargo install

# ./target/debug/signer -p ./tx.json

```

// https://sepolia.etherscan.io/tx/0xe77ab69482d32afdb63f7ff1e6dc4c39db5c849d3a18db0d8acf73b68719050d
