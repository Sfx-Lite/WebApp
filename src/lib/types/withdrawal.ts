export type WithdrawalStatus = "processing" | "successful" | "failed";

export type WithdrawalResult = {
  transactionId: string;
  status: WithdrawalStatus;
  amount: string;
  fee: string;
  total: string;
  externalAddress: string;
  txHash: string;
  balanceAfter: string;
};
