
# Flare Olympics Bet Showcase

Welcome to Flare Olympics Bet, an innovative on-chain betting system utilizing Flare Oracle Data connector to enhance your betting experience with Olympic sports data.

This showcase was developed in cooperation with:

- Flare network: https://flare.network/
- Kalmia: https://kalmia.si/
- AF Labs: https://aflabs.si/

## What is Flare Olympics Bet Showcase?

**Note**: This application is intended for testing purposes only. There is no real business value behind.

Flare Olympics Bet Showcase is a decentralized sports betting application designed specifically for the Olympics. Users can place bets on various team sports events with simple outcomes: win, lose, or draw. This open-source project showcases the powerful capabilities of Flare's advanced features, ensuring that sports results are directly reflected on the blockchain for secure and transparent betting.

## Key Features

- **User-Friendly Interface**: The frontend is designed for ease of use, allowing you to deposit funds, place bets, and withdraw winnings efficiently using your wallet credentials.
- **Flare Data Connector**: This application leverages the Flare Data Connector to fetch Olympic match results from Web2 sources and relay them to the blockchain. The data is verified by Flare's attestation providers, ensuring accuracy and reliability.
- **Full dApp Integration**: Seamlessly integrates with smart contracts for a decentralized betting experience, handling all interactions securely on-chain.
- **Dynamic Betting Multipliers**: The betting logic uses dynamic multipliers to ensure fair and balanced payouts based on the pool of bets.

## How It Works

1. **Place Bets**: Use your wallet to deposit funds and place bets on Olympic events.
2. **Data Verification**: The Flare Data Connector fetches and verifies match results from multiple online sources, processed with the help of OpenAI.
3. **Secure Payouts**: Verified results are used by the smart contract to manage payouts, ensuring transparency and security.

## Components

To fully set up and run the Flare Olympics Bet system, the following components need to be in place:

- **Betting Smart Contract**: Manages all betting logic and interactions.
- **Front-End Application**: User interface for placing bets and managing funds.
- **Backend Application**: Calls provider API for verification.
- **Verification Server**: Ensures the integrity of match results data.

## Betting Logic

The betting logic operates on dynamic multipliers. Users purchase multiplied amounts (bet amounts multiplied by the win multiplier). When a bet is placed, the multiplied amount is stored, guaranteeing the claim amount will be paid when the event concludes.

All multiplied bets for each game are placed in a bet pool. The sum of amounts for each choice cannot exceed the total bets in the pool.

The multiplier is calculated each time a user places a bet. The number of bets against the complete pool defines the multiplier factor. The more bets placed on one choice, the lower the multiplier factor for that choice, and the higher the multiplier factors for other choices.

An initial pool and factors need to be set by the administrator, along with the initial pool of tokens. Each bet can only be 1/10 of the pool size.

## Flare Data Connector - Results

The results of each match are provided using the [Flare Data Connector](https://flare.network/dataconnector/). The documentation for the connector can be found [here](https://docs.flare.network/tech/state-connector/).

The project provides its own attestation type, the `Match result` attestation type. This attestation type defines how data can be verified by the attestation providers. To identify the match, data is mathed against date,sport,gender and teams.

This attestation is specific to one event (Olympic games) but can be easily extended to other team sports.

A verifier server is implemented for the defined `Match result` attestation type. For this attestation type, the verifier server calls a Web2 API, which returns the match results. If the data aligns with the expected results, it is considered valid. The verifier server is used by the attestation provider. If the verification passes, the data is passed to a voting round and then included in the Merkle tree, which is use to pass the data to the contract.

More developer oriented documentation can be found [here](https://github.com/flare-foundation/songbird-state-connector-protocol/blob/main/README.md)

Flare Olympics Bet is compatible with both the Coston and Songbird networks, showcasing its flexibility and interoperability.

By utilizing the Flare Data Connector, Flare Olympics Bet demonstrates how decentralized applications can effectively use external data to provide a seamless and trustworthy betting experience on the blockchain.
