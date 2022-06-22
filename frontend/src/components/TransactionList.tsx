import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import { TransactionDTO } from "../../../shared/dto/transactionDTO";
//TODO redux toolkit
export default function TransactionList() {
  const emptyTransactionList: TransactionDTO[] = [];
  const [transactions, setTransactions] = useState(emptyTransactionList);
  useEffect(() => {
    const foo = async () => {
      const response = await fetch("http://localhost:3001/transaction");
      // console.dir(await response.json());
      setTransactions(await response.json());
    };

    foo();
  }, []);

  return (
    <div>
      {" "}
      Hallo Welt
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <>
          {transactions.map((x: TransactionDTO) => (
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <CurrencyBitcoinIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={x.title} secondary={x.date} />
            </ListItem>
          ))}
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <CurrencyBitcoinIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Bitcoin investments"
              secondary="-10 000 000"
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <CurrencyBitcoinIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Pizer" secondary="18" />
          </ListItem>
        </>
      </List>
      <pre> {JSON.stringify(transactions, undefined, 2)} </pre>
    </div>
  );
}
