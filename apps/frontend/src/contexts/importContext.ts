import { Dispatch, SetStateAction, createContext } from "react";

interface ImportContextTypes {
    rowSelection: Record<number, true>;
    setRowSelection: Dispatch<SetStateAction<Record<number, true>>>;
}

export const ImportContext = createContext<ImportContextTypes>({
    rowSelection: {},
    setRowSelection: () => {}
});
