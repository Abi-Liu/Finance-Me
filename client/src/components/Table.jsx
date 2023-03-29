import { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { Container } from "@mui/material";

const Table = ({ transactions }) => {
  let data = [];
  transactions.forEach((account) => {
    account.transactions.forEach((transaction) => {
      data.push({
        account: account.accountName,
        date: transaction.date,
        category: transaction.category[0],
        name: transaction.name,
        amount: transaction.amount,
      });
    });
  });

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
    <Container sx={{ mt: 5 }}>
      <MaterialReactTable columns={columns} data={data} />;
    </Container>
  );
};

export default Table;
