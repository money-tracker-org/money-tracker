import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function CreateTransactionForm() {
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="transaction-title"
        label="Transaction title"
        variant="outlined"
      />
      <TextField
        id="transaction-date"
        label="Transaction date"
        variant="outlined"
      />
    </Box>
  );
}
