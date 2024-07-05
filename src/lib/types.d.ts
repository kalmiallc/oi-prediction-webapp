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

interface GameData {
  uuid: string;
  title: string;
  startTime: number;
  duration: number;
  sport: string;
  poolAmount: string;
  winner: 0 | 1 | 2 | 3;
  choices: {
    choiceId: 1 | 2 | 3;
    choiceName: string;
    totalBetsAmount: string;
    currentMultiplier: string;
  }[];
}
