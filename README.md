# Olympics Prediction Showcase - Web app

This repository contains Frontend part of the Olympics Prediction Showcase.
Olympics Prediction Showcase is a simple sports results prediction application centered around the Olympics, enabling users to view and place predictions on various Olympic team sports. This decentralized application (dApp) features a frontend that directly interacts with a smart contract, ensuring all prediction data is securely provided by the smart contract.

The complete showcase consists of four repositories:

- [Prediction smart contract](https://github.com/kalmiallc/oi-prediction-smartcontract)
- [Front-end application](https://github.com/kalmiallc/oi-prediction-webapp)
- [Backend application](https://github.com/kalmiallc/oi-prediction-backend) which calls the verification provider API for verification
- [Verification server](https://github.com/kalmiallc/oi-match-attestation-server)

The complete guide can be found [here](https://github.com/kalmiallc/oi-flare-prediction-instructions)

## Features

- **My Bets**: View your placed predictions.
- **Sports Categories**: Place predictions on pre-defined team sports
- **All Bets**: Explore all predictions which were placed.

## Other components

For a complete setup, the following components need to be running:

- Betting predictions smart contract
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
    git clone https://github.com/kalmiallc/oi-prediction-webapp
    ```
2. **Navigate to the project directory**:
    ```bash
    cd oi-prediction-webapp
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

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
