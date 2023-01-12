import { Session } from "next-auth";
import { Dispatch, SetStateAction, createContext } from "react";

import { UserWallets } from "@src/lib/types/api";

export type ModalModes = "verify" | "edit" | "delete" | "closed";

export interface ModalData {
    mode: ModalModes;
    address: string;
    name: string;
    walletAccess: "read-only" | "read-write";
}

interface ManageContextTypes {
    session: Session | null;
    setModalData: Dispatch<SetStateAction<ModalData>>;
    setWallets: Dispatch<SetStateAction<UserWallets>>;
}

export const ManageContext = createContext<ManageContextTypes>({
    session: null,
    setModalData: () => {},
    setWallets: () => {}
});
