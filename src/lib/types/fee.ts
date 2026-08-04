export type TransferType = "LOCAL" | "INTERNATIONAL";

export type FeeCalculation = {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  transferType: TransferType;
  percentage: number;
  fee: number;
  feeCurrency: string;
  exchangeRate: number;
  feeInDestinationCurrency: number;
  minimumFee: number;
  maximumFee: number;
};
