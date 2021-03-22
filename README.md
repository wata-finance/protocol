# Wata Finance Protocol

This repository contains the smart contracts source code and markets configuration for WATA. The repository uses Hardhat as development environment for compilation, testing and deployment tasks.

# What is WATA?

Wata is the first decentralized standard hashrate mining platform based on the heco chain ecology. We hope to make mining simple and efficient. Everyone can participate and users no longer have high thresholds.They do not have to calculate various complicated costs by themselves, do not have to worry about the operating efficiency of the mining machines, only need to care about the benefits. Let's mine together.

# Documentation

- EN [Wata protocol document](https://docs.wata.finance/v/en/)
- CN [Wata protocol document](https://docs.wata.finance/)

# Audits

- Beosin (03/01/2021 - 03/20/2021): In progress ...

# Connect with the community

You can join at the [Discord](https://discord.com/invite/ngabJZfwbv) channel or at the [Telegram](https://t.me/joinchat/CAODSe-p2MQyMWU1) for asking questions about the protocol or talk about Wata with other peers.

# Setup

Follow the next steps to setup the repository:

- Create an environment file named .env and fill the next environment variables

```
# Mnemonic, only first address will be used
MNEMONIC=""
```

- deploy bsc network

```
npm run deploy-bscTest
```

- execute test

```
npm run test
```