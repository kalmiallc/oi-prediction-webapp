export const betAbi = [
  { type: 'constructor', stateMutability: 'nonpayable', inputs: [] },
  {
    type: 'event',
    name: 'BetPlaced',
    inputs: [
      { type: 'uint256', name: 'id', internalType: 'uint256', indexed: false },
      { type: 'bytes32', name: 'eventUUID', internalType: 'bytes32', indexed: false },
      { type: 'address', name: 'bettor', internalType: 'address', indexed: false },
      { type: 'uint256', name: 'amount', internalType: 'uint256', indexed: false },
      { type: 'uint16', name: 'choice', internalType: 'uint16', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'BetSettled',
    inputs: [
      { type: 'bytes32', name: 'eventUUID', internalType: 'bytes32', indexed: false },
      { type: 'uint32', name: 'winner', internalType: 'uint32', indexed: false },
      { type: 'uint256', name: 'winMultiplier', internalType: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      { type: 'address', name: 'previousOwner', internalType: 'address', indexed: true },
      { type: 'address', name: 'newOwner', internalType: 'address', indexed: true },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SportEventCreated',
    inputs: [
      { type: 'bytes32', name: 'uuid', internalType: 'bytes32', indexed: false },
      { type: 'string', name: 'title', internalType: 'string', indexed: false },
      { type: 'string', name: 'sport', internalType: 'string', indexed: false },
      { type: 'uint256', name: 'startTime', internalType: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'DAY',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'uint256', name: 'id', internalType: 'uint256' },
      { type: 'bytes32', name: 'eventUUID', internalType: 'bytes32' },
      { type: 'address', name: 'bettor', internalType: 'address' },
      { type: 'uint256', name: 'betAmount', internalType: 'uint256' },
      { type: 'uint256', name: 'winMultiplier', internalType: 'uint256' },
      { type: 'uint256', name: 'betTimestamp', internalType: 'uint256' },
      { type: 'uint16', name: 'betChoice', internalType: 'uint16' },
      { type: 'bool', name: 'claimed', internalType: 'bool' },
    ],
    name: 'betById',
    inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'uint256', name: 'id', internalType: 'uint256' },
      { type: 'bytes32', name: 'eventUUID', internalType: 'bytes32' },
      { type: 'address', name: 'bettor', internalType: 'address' },
      { type: 'uint256', name: 'betAmount', internalType: 'uint256' },
      { type: 'uint256', name: 'winMultiplier', internalType: 'uint256' },
      { type: 'uint256', name: 'betTimestamp', internalType: 'uint256' },
      { type: 'uint16', name: 'betChoice', internalType: 'uint16' },
      { type: 'bool', name: 'claimed', internalType: 'bool' },
    ],
    name: 'betsByDateAndUser',
    inputs: [
      { type: 'uint256', name: '', internalType: 'uint256' },
      { type: 'address', name: '', internalType: 'address' },
      { type: 'uint256', name: '', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'uint256', name: 'id', internalType: 'uint256' },
      { type: 'bytes32', name: 'eventUUID', internalType: 'bytes32' },
      { type: 'address', name: 'bettor', internalType: 'address' },
      { type: 'uint256', name: 'betAmount', internalType: 'uint256' },
      { type: 'uint256', name: 'winMultiplier', internalType: 'uint256' },
      { type: 'uint256', name: 'betTimestamp', internalType: 'uint256' },
      { type: 'uint16', name: 'betChoice', internalType: 'uint16' },
      { type: 'bool', name: 'claimed', internalType: 'bool' },
    ],
    name: 'betsByEvent',
    inputs: [
      { type: 'bytes32', name: '', internalType: 'bytes32' },
      { type: 'uint256', name: '', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'uint256', name: 'id', internalType: 'uint256' },
      { type: 'bytes32', name: 'eventUUID', internalType: 'bytes32' },
      { type: 'address', name: 'bettor', internalType: 'address' },
      { type: 'uint256', name: 'betAmount', internalType: 'uint256' },
      { type: 'uint256', name: 'winMultiplier', internalType: 'uint256' },
      { type: 'uint256', name: 'betTimestamp', internalType: 'uint256' },
      { type: 'uint16', name: 'betChoice', internalType: 'uint16' },
      { type: 'bool', name: 'claimed', internalType: 'bool' },
    ],
    name: 'betsByEventStartDate',
    inputs: [
      { type: 'uint256', name: '', internalType: 'uint256' },
      { type: 'uint256', name: '', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'calculateAproximateBetReturn',
    inputs: [
      { type: 'uint256', name: 'amount', internalType: 'uint256' },
      { type: 'uint32', name: 'choiceId', internalType: 'uint32' },
      { type: 'bytes32', name: 'eventUUID', internalType: 'bytes32' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'claimWinnings',
    inputs: [{ type: 'uint256', name: '_betId', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'createSportEvent',
    inputs: [
      { type: 'string', name: 'title', internalType: 'string' },
      { type: 'uint256', name: 'startTime', internalType: 'uint256' },
      { type: 'uint32', name: 'duration', internalType: 'uint32' },
      { type: 'string', name: 'sport', internalType: 'string' },
      { type: 'string', name: 'choiceA', internalType: 'string' },
      { type: 'string', name: 'choiceB', internalType: 'string' },
      { type: 'string', name: 'choiceC', internalType: 'string' },
      { type: 'uint32', name: 'initialVotesA', internalType: 'uint32' },
      { type: 'uint32', name: 'initialVotesB', internalType: 'uint32' },
      { type: 'uint32', name: 'initialVotesC', internalType: 'uint32' },
      { type: 'uint256', name: 'initialPool', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'tuple[]',
        name: '',
        internalType: 'struct OIBetShowcase.Bet[]',
        components: [
          { type: 'uint256', name: 'id', internalType: 'uint256' },
          { type: 'bytes32', name: 'eventUUID', internalType: 'bytes32' },
          { type: 'address', name: 'bettor', internalType: 'address' },
          { type: 'uint256', name: 'betAmount', internalType: 'uint256' },
          { type: 'uint256', name: 'winMultiplier', internalType: 'uint256' },
          { type: 'uint256', name: 'betTimestamp', internalType: 'uint256' },
          { type: 'uint16', name: 'betChoice', internalType: 'uint16' },
          { type: 'bool', name: 'claimed', internalType: 'bool' },
        ],
      },
    ],
    name: 'getBetsByDate',
    inputs: [{ type: 'uint256', name: 'date', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'tuple[]',
        name: '',
        internalType: 'struct OIBetShowcase.Bet[]',
        components: [
          { type: 'uint256', name: 'id', internalType: 'uint256' },
          { type: 'bytes32', name: 'eventUUID', internalType: 'bytes32' },
          { type: 'address', name: 'bettor', internalType: 'address' },
          { type: 'uint256', name: 'betAmount', internalType: 'uint256' },
          { type: 'uint256', name: 'winMultiplier', internalType: 'uint256' },
          { type: 'uint256', name: 'betTimestamp', internalType: 'uint256' },
          { type: 'uint16', name: 'betChoice', internalType: 'uint16' },
          { type: 'bool', name: 'claimed', internalType: 'bool' },
        ],
      },
    ],
    name: 'getBetsByDateAndUser',
    inputs: [
      { type: 'uint256', name: 'date', internalType: 'uint256' },
      { type: 'address', name: 'user', internalType: 'address' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'tuple[]',
        name: '',
        internalType: 'struct OIBetShowcase.Bet[]',
        components: [
          { type: 'uint256', name: 'id', internalType: 'uint256' },
          { type: 'bytes32', name: 'eventUUID', internalType: 'bytes32' },
          { type: 'address', name: 'bettor', internalType: 'address' },
          { type: 'uint256', name: 'betAmount', internalType: 'uint256' },
          { type: 'uint256', name: 'winMultiplier', internalType: 'uint256' },
          { type: 'uint256', name: 'betTimestamp', internalType: 'uint256' },
          { type: 'uint16', name: 'betChoice', internalType: 'uint16' },
          { type: 'bool', name: 'claimed', internalType: 'bool' },
        ],
      },
    ],
    name: 'getBetsByEvent',
    inputs: [{ type: 'bytes32', name: 'uuid', internalType: 'bytes32' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'tuple',
        name: '',
        internalType: 'struct OIBetShowcase.SportEvent',
        components: [
          { type: 'bytes32', name: 'uuid', internalType: 'bytes32' },
          { type: 'string', name: 'title', internalType: 'string' },
          { type: 'uint256', name: 'startTime', internalType: 'uint256' },
          { type: 'uint32', name: 'duration', internalType: 'uint32' },
          { type: 'string', name: 'sport', internalType: 'string' },
          { type: 'uint256', name: 'poolAmount', internalType: 'uint256' },
          { type: 'uint16', name: 'winner', internalType: 'uint16' },
          {
            type: 'tuple[]',
            name: 'choices',
            internalType: 'struct OIBetShowcase.Choices[]',
            components: [
              { type: 'uint16', name: 'choiceId', internalType: 'uint16' },
              { type: 'string', name: 'choiceName', internalType: 'string' },
              { type: 'uint256', name: 'totalBetsAmount', internalType: 'uint256' },
              { type: 'uint256', name: 'currentMultiplier', internalType: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'getSportEventFromUUID',
    inputs: [{ type: 'bytes32', name: 'uuid', internalType: 'bytes32' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'tuple[]',
        name: '',
        internalType: 'struct OIBetShowcase.SportEvent[]',
        components: [
          { type: 'bytes32', name: 'uuid', internalType: 'bytes32' },
          { type: 'string', name: 'title', internalType: 'string' },
          { type: 'uint256', name: 'startTime', internalType: 'uint256' },
          { type: 'uint32', name: 'duration', internalType: 'uint32' },
          { type: 'string', name: 'sport', internalType: 'string' },
          { type: 'uint256', name: 'poolAmount', internalType: 'uint256' },
          { type: 'uint16', name: 'winner', internalType: 'uint16' },
          {
            type: 'tuple[]',
            name: 'choices',
            internalType: 'struct OIBetShowcase.Choices[]',
            components: [
              { type: 'uint16', name: 'choiceId', internalType: 'uint16' },
              { type: 'string', name: 'choiceName', internalType: 'string' },
              { type: 'uint256', name: 'totalBetsAmount', internalType: 'uint256' },
              { type: 'uint256', name: 'currentMultiplier', internalType: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'getSportEventsByDateAndSport',
    inputs: [
      { type: 'uint256', name: 'date', internalType: 'uint256' },
      { type: 'string', name: 'sport', internalType: 'string' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'address' }],
    name: 'owner',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'payable',
    outputs: [],
    name: 'placeBet',
    inputs: [
      { type: 'bytes32', name: 'eventUUID', internalType: 'bytes32' },
      { type: 'uint16', name: 'choice', internalType: 'uint16' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'renounceOwnership',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'bytes32', name: 'uuid', internalType: 'bytes32' },
      { type: 'string', name: 'title', internalType: 'string' },
      { type: 'uint256', name: 'startTime', internalType: 'uint256' },
      { type: 'uint32', name: 'duration', internalType: 'uint32' },
      { type: 'string', name: 'sport', internalType: 'string' },
      { type: 'uint256', name: 'poolAmount', internalType: 'uint256' },
      { type: 'uint16', name: 'winner', internalType: 'uint16' },
    ],
    name: 'sportEvents',
    inputs: [{ type: 'bytes32', name: '', internalType: 'bytes32' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'bytes32', name: 'uuid', internalType: 'bytes32' },
      { type: 'string', name: 'title', internalType: 'string' },
      { type: 'uint256', name: 'startTime', internalType: 'uint256' },
      { type: 'uint32', name: 'duration', internalType: 'uint32' },
      { type: 'string', name: 'sport', internalType: 'string' },
      { type: 'uint256', name: 'poolAmount', internalType: 'uint256' },
      { type: 'uint16', name: 'winner', internalType: 'uint16' },
    ],
    name: 'sportEventsByDateAndSport',
    inputs: [
      { type: 'uint256', name: '', internalType: 'uint256' },
      { type: 'string', name: '', internalType: 'string' },
      { type: 'uint256', name: '', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'transferOwnership',
    inputs: [{ type: 'address', name: 'newOwner', internalType: 'address' }],
  },
];
