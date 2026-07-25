export type TransactionStatus = "successful" | "processing" | "failed";

export type Transaction
  = | {
    id: string;
    type: "deposit";
    status: TransactionStatus;
    amount: string;
    asset: string;
    createdAt: string;
  }
  | {
    id: string;
    type: "send";
    status: TransactionStatus;
    amount: string;
    asset: string;
    createdAt: string;
    counterpartyName: string;
  }
  | {
    id: string;
    type: "withdrawal";
    status: TransactionStatus;
    amount: string;
    asset: string;
    createdAt: string;
    address: string;
  };
