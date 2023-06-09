import { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { Box, Typography } from "@mui/material";

const Table = ({ data }) => {
  // let data = [];
  // transactions.forEach((account) => {
  //   account.transactions.forEach((transaction) => {
  //     data.push({
  //       account: account.accountName,
  //       date: transaction.date,
  //       category: transaction.category[0],
  //       name: transaction.name,
  //       amount: transaction.amount,
  //     });
  //   });
  // });

  // const sorted = data.sort((a, b) => (b.date > a.date ? 1 : -1));

  const columns = useMemo(
    () => [
      {
        accessorKey: "account",
        header: "Account",
      },
      {
        accessorKey: "date",
        header: "Date",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
    ],
    []
  );

  return (
    <Box>
      <Typography variant="h6">Transactions</Typography>
      <MaterialReactTable columns={columns} data={data} />
    </Box>
  );
};

export default Table;
