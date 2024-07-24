# Flare Olympics Bet showcase

Flare Olympics Bet showcase is a simple sports betting application centered around the Olympics, enabling users to view and place bets on various Olympic team sports. This decentralized application (dApp) features a frontend that directly interacts with a smart contract, ensuring all betting data is securely provided by the smart contract.

## Key Features

- **Full dApp Integration**: The application seamlessly integrates with smart contracts, providing a decentralized betting experience. All interactions are handled via smart contract.
- **Flare Data Connector**: The main focus of this showcase is to demonstrate the capabilities of the Flare Data Connector. Data Connector allows applications to securely use data from external blockchains and the internet, supporting multi-chain, cross-chain, or Web2-connected applications. The 
- **Data Connector usage**: This application leverages the Flare Data Connector to fetch Olympic match results from Web2 sources and relay them to the blockchain. The data is verified by Flare's attestation providers. Results from various online sources are aggregated and processed with the help of OpenAI. The verified data is then used by Flare attestation providers to supply accurate information to the Flare network.

The showcase is compatible with both the Coston and Songbird networks.

By harnessing the power of the Flare Data Connector, Flare Olympics Bet exemplifies how decentralized applications can utilize external data to deliver a seamless and trustworthy user experience to Web3.

## Features

- **My Bets**: View your placed bets.
- **Sports Categories**: Place bets on pre-defined team sports
- **All Bets**: Explore all bets which were placed.

## Other components

For a complete setup, the following components need to be running:

- Betting smart contract
- Backend application that calls the provider API for verification
- Verification server

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installing

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/flare-bet.git
    ```
2. **Navigate to the project directory**:
    ```bash
    cd flare-bet
    ```
3. **Install dependencies**:
    ```bash
    npm install
    ```
4. **Start the development server**:
    ```bash
    npm start
    ```

## Usage

Once the development server is running, open your browser and navigate to `http://localhost:3000` to access the app.

## Deployment

To deploy the application, you can use platforms like Vercel, Netlify, or any other static site hosting service.

1. **Build the project**:
    ```bash
    npm run build
    ```
2. **Deploy the contents of the `build` directory** to your preferred hosting service.

## Built With

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Vercel](https://vercel.com/) - Hosting service


## Authors

- **Borut Terpinc** - *Project lead, Technical lead* 
- **Jackob Horgan** - *Project co-lead* 
- **Mitja Kjuder** - *Blockchain development* 
- **Anže Mur** - *Backend and AI development* 
- **Bor Drnovšček** - *Frontend development* 


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.



