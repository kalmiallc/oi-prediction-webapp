interface ApiError extends Error {
  info: any;
  status: number;
}

interface ComponentProps {
  children?: React.ReactNode;
  childrenElement?: JSX.Element;
  style?: React.CSSProperties;
  className?: string;
}

type ChoiceId = 1 | 2 | 3;

type Winner = 0 | ChoiceId;

interface SportEvent {
  uid: string;
  title: string;
  startTime: number;
  duration: number;
  sport: string;
  poolAmount: bigint;
  winner: Winner;
  choices: Choice[];
}

type Choice = {
  choiceId: ChoiceId;
  choiceName: string;
  totalBetsAmount: bigint;
  currentMultiplier: bigint;
  choiceIndex?: number;
};

interface Bet {
  id: bigint;
  eventUID: string;
  bettor: string;
  betAmount: bigint;
  winMultiplier: bigint;
  betTimestamp: bigint;
  betChoice: ChoiceId;
}
