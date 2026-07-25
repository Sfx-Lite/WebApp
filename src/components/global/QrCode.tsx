/* eslint-disable react/no-array-index-key */
export default function QRCode() {
  const finders: Array<[number, number]> = [
    [10, 10],
    [150, 10],
    [10, 150],
  ];

  const dataCells: Array<[number, number]> = [
    [70, 14],
    [86, 14],
    [102, 22],
    [118, 14],
    [66, 30],
    [98, 34],
    [130, 30],
    [22, 66],
    [38, 74],
    [54, 62],
    [70, 70],
    [86, 66],
    [102, 74],
    [118, 62],
    [134, 70],
    [150, 66],
    [22, 86],
    [54, 82],
    [86, 90],
    [118, 86],
    [150, 82],
    [22, 102],
    [38, 98],
    [70, 106],
    [102, 98],
    [134, 106],
    [150, 102],
    [22, 118],
    [54, 114],
    [86, 122],
    [118, 114],
    [150, 118],
    [70, 134],
    [86, 142],
    [102, 130],
    [118, 138],
    [66, 150],
    [98, 158],
    [130, 150],
    [70, 166],
    [86, 174],
    [102, 166],
    [118, 174],
  ];

  return (
    <svg viewBox="0 0 180 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="180" height="180" rx="16" fill="white" />

      {finders.map(([x, y], i) => (
        <g key={`finder-${i}`} className="text-sfx-ink">
          <rect x={x} y={y} width="36" height="36" rx="8" fill="none" stroke="currentColor" strokeWidth="7" />
          <rect x={x + 11} y={y + 11} width="14" height="14" rx="3" fill="currentColor" />
        </g>
      ))}

      {dataCells.map(([x, y], i) => (
        <rect key={`cell-${i}`} x={x} y={y} width="7" height="7" rx="1.5" className="fill-sfx-ink" />
      ))}
      <rect x="82" y="82" width="16" height="16" rx="4" className="fill-sfx-primary" />
    </svg>
  );
}
