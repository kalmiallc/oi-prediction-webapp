import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import AdminBetListItem from './AdminBetListItem';

export default function AdminBetListTable({
  bets,
  events,
}: { bets: Bet[]; events: SportEvent[] } & ComponentProps) {
  const [pagination, setPagination] = useState({ page: 0, total: bets.length || -1, perPage: 10 });

  const currentPageNumber = pagination.page * pagination.perPage;
  const paginatedBets = bets.slice(currentPageNumber, currentPageNumber + pagination.perPage);

  function getEvent(uid: string) {
    return events.find(x => x.uid === uid);
  }
  function changePage(newPage: number) {
    setPagination({ ...pagination, page: newPage });
  }
  function changePerPage(newPerPage: number) {
    setPagination({ ...pagination, page: 0, perPage: newPerPage });
  }
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Match</TableCell>
            <TableCell>Bet</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Multiplier</TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Winnings</TableCell>
            <TableCell>Wallet</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedBets.map(bet => (
            <AdminBetListItem key={bet.id} bet={bet} event={getEvent(bet.eventUID) as SportEvent} />
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
