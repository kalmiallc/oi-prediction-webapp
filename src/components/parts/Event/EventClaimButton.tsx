import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../../contexts/global';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';

export default function EventClaimButton({
  event,
  choice,
}: { event: SportEvent; choice?: Choice } & ComponentProps) {
  const { address } = useAccount();
  const router = useRouter();
  const {
    state: { bets },
  } = useGlobalContext();
  const [hasBets, setHasBets] = useState(false);

  function onConfirm() {
    router.replace('/bets');
    return;
  }

  useEffect(() => {
    if (address && bets?.[address]?.length) {
      setHasBets(
        bets?.[address]?.some(
          bet =>
            bet.eventUID === event.uid &&
            (!choice ||
              (bet.betChoice === choice.choiceIndex && bet.event.winner === choice.choiceId)) &&
            !bet.claimed
        )
      );
    }
  }, [bets, address]);

  if (!hasBets) {
    return;
  }
  return (
    <div className="">
      <Button variant="contained" className="w-full px-10 mt-2 capitalize" onClick={onConfirm}>
        {choice ? 'Claim' : 'Refund'}
      </Button>
    </div>
  );
}
