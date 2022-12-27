import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Transaction } from "../lib/types";

function CSVImport() {
    const fileInput = useRef<HTMLInputElement>(null);
    const [txns, setTxns] = useState<Transaction[]>([]);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer?.files[0];
        if (file?.type === "text/csv") {
            readFile(file);
        }
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const file = e.target.files[0];
        if (file.type === "text/csv") {
            readFile(file);
        }
    };

    const readFile = (file: File) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            if (!e.target?.result) return;

            const csvData = e.target?.result as string;
            const rawData = csvData.split("\n");

            const txns = [];
            for (let i = 1; i < rawData.length; i++) {
                const rawTxn = rawData[i].split(",");

                const txn: Transaction = {
                    date: rawTxn[0],
                    receivedQuantity: parseFloat(rawTxn[1]) || 0,
                    receivedCurrency: rawTxn[2] || "",
                    sentQuantity: parseFloat(rawTxn[3]) || 0,
                    sentCurrency: rawTxn[4] || "",
                    feeAmount: parseFloat(rawTxn[5]) || 0,
                    feeCurrency: rawTxn[6] || "",
                    tag: rawTxn[7] || ""
                };

                txns.push(txn);
            }

            setTxns(txns);
        };

        reader.readAsText(file);
    };

    const handleClick = () => {
        fileInput.current?.click();
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{
                width: "500px",
                height: "200px",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                border: "1px solid black"
            }}
        >
            <input
                type="file"
                ref={fileInput}
                onChange={handleFileInputChange}
                style={{ display: "none" }}
                accept=".csv"
            />
            <button onClick={handleClick}>Import CSV</button>
            {txns.map(
                ({
                    date,
                    receivedQuantity,
                    receivedCurrency,
                    sentQuantity,
                    sentCurrency,
                    feeAmount,
                    feeCurrency,
                    tag
                }: Transaction) => (
                    <div key={date}>
                        <p>{date}</p>
                        <p>{receivedQuantity}</p>
                        <p>{receivedCurrency}</p>
                        <p>{sentQuantity}</p>
                        <p>{sentCurrency}</p>
                        <p>{feeAmount}</p>
                        <p>{feeCurrency}</p>
                        <p>{tag}</p>
                    </div>
                )
            )}
        </div>
    );
}

export default CSVImport;
