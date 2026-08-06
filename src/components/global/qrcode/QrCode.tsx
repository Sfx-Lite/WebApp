import { QRCodeSVG } from "qrcode.react";

type QrCodeProps = {
  value: string;
  size?: number;
};

export default function QrCode({ value, size = 200 }: QrCodeProps) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      bgColor="#ffffff"
      fgColor="#1a1a2e"
      level="M"
      className="w-full h-full"
    />
  );
}
