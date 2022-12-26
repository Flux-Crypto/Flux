import fs from "fs";
import readline from "readline";

import { Transaction } from "./types";

const stream = fs.createReadStream("./__tests__/cointracker.csv");
const reader = readline.createInterface({ input: stream });

const data: Transaction[] = [];

let idx = 0;
reader.on("line", (row: string) => {
    if (idx == 0) {
        idx++;
        return;
    }

    const rawTxn = row.split(",")

    const txn: Transaction = {
        date: rawTxn[0],
        receivedQuantity: parseFloat(rawTxn[1]) || 0,
        receivedCurrency: rawTxn[2] || "",
        sentQuantity: parseFloat(rawTxn[3]) || 0,
        sentCurrency: rawTxn[4] || "", 
        feeAmount: parseFloat(rawTxn[5]) || 0,
        feeCurrency: rawTxn[6] || "",
        tag: rawTxn[7] || ""
    }
    data.push(txn);
});

reader.on("close", () => {
  console.log(data);
});