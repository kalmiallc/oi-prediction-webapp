export default function AboutPage() {
  return (
    <div className="px-5 lg:px-10 max-w-[1400px] m-auto bg-white py-4 rounded-[24px]">
      <h1 id="flare-olympics-bet-showcase" className="typo-h1 mb-1">
        Flare Olympics Bet Showcase
      </h1>
      <p className="mb-2">
        Welcome to Flare Olympics Bet, an innovative on-chain betting system utilizing Flare Oracle
        Data connector to enhance your betting experience with Olympic sports data.
      </p>
      <p>This showcase was developed in cooperation with:</p>
      <ul className="mb-4">
        <li>
          <strong>Flare network: </strong>
          <a href="https://flare.network/" target="_blank">
            https://flare.network/
          </a>
        </li>
        <li>
          <strong>Kalmia: </strong>
          <a href="https://kalmia.si/" target="_blank">
            https://kalmia.si/
          </a>
        </li>
        <li>
          <strong>AF Labs: </strong>
          <a href="https://aflabs.si/" target="_blank">
            https://aflabs.si/
          </a>
        </li>
      </ul>
      <h2 id="what-is-flare-olympics-bet-showcase" className="typo-h2 mb-1">
        What is Flare Olympics Bet Showcase?
      </h2>
      <p className="mb-2">
        <strong>Note</strong>: This application is intended for testing purposes only. There is no
        real business value behind.
      </p>
      <p className="mb-4">
        Flare Olympics Bet Showcase is a decentralized sports betting application designed
        specifically for the Olympics. Users can place bets on various team sports events with
        simple outcomes: win, lose, or draw. This open-source project showcases the powerful
        capabilities of Flare&#39;s advanced features, ensuring that sports results are directly
        reflected on the blockchain for secure and transparent betting.
      </p>
      <h2 id="key-features" className="typo-h2 mb-1">
        Key Features
      </h2>
      <ul className="mb-4">
        <li>
          <strong>User-Friendly Interface</strong>: The frontend is designed for ease of use,
          allowing you to deposit funds, place bets, and withdraw winnings efficiently using your
          wallet credentials.
        </li>
        <li>
          <strong>Flare Data Connector</strong>: This application leverages the Flare Data Connector
          to fetch Olympic match results from Web2 sources and relay them to the blockchain. The
          data is verified by Flare&#39;s attestation providers, ensuring accuracy and reliability.
        </li>
        <li>
          <strong>Full dApp Integration</strong>: Seamlessly integrates with smart contracts for a
          decentralized betting experience, handling all interactions securely on-chain.
        </li>
        <li>
          <strong>Dynamic Betting Multipliers</strong>: The betting logic uses dynamic multipliers
          to ensure fair and balanced payouts based on the pool of bets.
        </li>
      </ul>
      <h2 id="how-it-works" className="typo-h2 mb-1">
        How It Works
      </h2>
      <ol className="mb-2">
        <li>
          <strong>Place Bets</strong>: Use your wallet to deposit funds and place bets on Olympic
          events.
        </li>
        <li>
          <strong>Data Verification</strong>: The Flare Data Connector fetches and verifies match
          results from multiple online sources, processed with the help of OpenAI.
        </li>
        <li>
          <strong>Secure Payouts</strong>: Verified results are used by the smart contract to manage
          payouts, ensuring transparency and security.
        </li>
      </ol>
      <strong>Key points:</strong>
      <ul className="mb-2">
        <li>
          Bets can be placed until the match starts. No betting is allowed once the match has begun.
        </li>
        <li>The maximum bet is 10% of the pool size.</li>
        <li>
          Bets can be claimed after the final results are finalized, which is expected to be
          approximately 2 hours after the match&#39;s expected end time.
        </li>
        <li>
          If the match is canceled, the invested funds can be withdrawn 14 days after the match
          start time (only supported by the contract).
        </li>
      </ul>

      <h2 id="components" className="typo-h2 mb-1">
        Components
      </h2>
      <p>
        To fully set up and run the Flare Olympics Bet system, the following components need to be
        in place:
      </p>
      <ul className="mb-4">
        <li>
          <strong>Betting Smart Contract</strong>: Manages all betting logic and interactions.
        </li>
        <li>
          <strong>Front-End Application</strong>: User interface for placing bets and managing
          funds.
        </li>
        <li>
          <strong>Backend Application</strong>: Calls provider API for verification.
        </li>
        <li>
          <strong>Verification Server</strong>: Ensures the integrity of match results data.
        </li>
      </ul>
      <h2 id="betting-logic" className="typo-h2 mb-1">
        Betting Logic
      </h2>
      <p className="mb-2">
        The betting logic operates on dynamic multipliers. Users purchase multiplied amounts (bet
        amounts multiplied by the win multiplier). When a bet is placed, the multiplied amount is
        stored, guaranteeing the claim amount will be paid when the event concludes.
      </p>
      <p className="mb-2">
        All multiplied bets for each game are placed in a bet pool. The sum of amounts for each
        choice cannot exceed the total bets in the pool.
      </p>
      <p className="mb-2">
        The multiplier is calculated each time a user places a bet. The number of bets against the
        complete pool defines the multiplier factor. The more bets placed on one choice, the lower
        the multiplier factor for that choice, and the higher the multiplier factors for other
        choices.
      </p>
      <p className="mb-4">
        An initial pool and factors need to be set by the administrator, along with the initial pool
        of tokens. Each bet can only be 1/10 of the pool size.
      </p>
      <h2 id="flare-data-connector-results" className="typo-h2">
        Flare Data Connector - Results
      </h2>
      <p className="mb-2">
        The results of each match are provided using the{' '}
        <a href="https://flare.network/dataconnector/">Flare Data Connector</a>. The documentation
        for the connector can be found{' '}
        <a href="https://docs.flare.network/tech/state-connector/">here</a>.
      </p>
      <p className="mb-2">
        The project provides its own attestation type, the <code>Match result</code> attestation
        type. This attestation type defines how data can be verified by the attestation providers.
        To identify the match, data is mathed against date,sport,gender and teams.
      </p>
      <p className="mb-2">
        This attestation is specific to one event (Olympic games) but can be easily extended to
        other team sports.
      </p>
      <p className="mb-2">
        A verifier server is implemented for the defined <code>Match result</code> attestation type.
        For this attestation type, the verifier server calls a Web2 API, which returns the match
        results. If the data aligns with the expected results, it is considered valid. The verifier
        server is used by the attestation provider. If the verification passes, the data is passed
        to a voting round and then included in the Merkle tree, which is use to pass the data to the
        contract.
      </p>
      <p className="mb-2">
        More developer oriented documentation can be found{' '}
        <a href="https://github.com/flare-foundation/songbird-state-connector-protocol/blob/main/README.md">
          here
        </a>
      </p>
      <p className="mb-2">
        Flare Olympics Bet is compatible with both the Coston and Songbird networks, showcasing its
        flexibility and interoperability.
      </p>
      <p className="mb-2">
        By utilizing the Flare Data Connector, Flare Olympics Bet demonstrates how decentralized
        applications can effectively use external data to provide a seamless and trustworthy betting
        experience on the blockchain.
      </p>
    </div>
  );
}
