import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import BetListItem from './BetListItem';

export default function BetListTable({
  bets,
  onClaim,
}: { bets: BetWithEvent[]; onClaim: (bet: BetWithEvent) => void } & ComponentProps) {
  const [pagination, setPagination] = useState({ page: 0, total: bets.length || -1, perPage: 10 });

  const currentPageNumber = pagination.page * pagination.perPage;
  const paginatedBets = bets.slice(currentPageNumber, currentPageNumber + pagination.perPage);

  function changePage(newPage: number) {
    setPagination({ ...pagination, page: newPage });
  }
  function changePerPage(newPerPage: number) {
    setPagination({ ...pagination, page: 0, perPage: newPerPage });
  }
  useEffect(() => {
    setPagination({ page: 0, total: bets.length || -1, perPage: 10 });
  }, [bets]);
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Match</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Bet</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Multiplier</TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Winnings</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedBets.map(bet => (
            <BetListItem
              key={bet.id}
              bet={bet}
              event={bet.event as SportEvent}
              onClaim={() => onClaim(bet)}
              onRefund={() => onClaim(bet)}
            />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={bets.length}
        rowsPerPage={pagination.perPage}
        page={pagination.page}
        onPageChange={(x, newPage) => changePage(newPage)}
        onRowsPerPageChange={x => changePerPage(Number(x.target.value))}
      />
    </>
  );
}
