export type TransactionType = "deposit" | "send" | "withdrawal";
export type TransactionStatus = "successful" | "processing" | "failed";
export type TransactionDirection = "debit" | "credit";

export type Transaction = {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  direction: TransactionDirection;
  asset: string;
  amount: string;
  fee: string;
  note: string | null;
  counterpartyUserId: string | null;
  counterpartyUsername: string | null;
  externalAddress: string | null;
  txHash: string | null;
  createdAt: string;
};
