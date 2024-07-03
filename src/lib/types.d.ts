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
