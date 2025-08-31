import React from 'react';

interface Props {
  width?: number;
  height?: number;
}
const MailIcon: React.FC<Props> = ({ width = 20, height = 20 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ? `${width}` : '20'}
      height={height ? `${height}` : '20'}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M2.5 16.5V9.2016C2.5 8.90434 2.63225 8.62248 2.86088 8.43249L9.36088 3.0311C9.73135 2.72324 10.2686 2.72324 10.6391 3.0311L17.1391 8.43249C17.3677 8.62248 17.5 8.90434 17.5 9.2016V16.5C17.5 17.0523 17.0523 17.5 16.5 17.5H10H3.5C2.94772 17.5 2.5 17.0523 2.5 16.5Z"
        fill="#FFF8EF"
        stroke="#755428"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <path
        d="M4.0835 5.60547V11.9388C4.0835 12.4911 4.53121 12.9388 5.0835 12.9388H15.0002C15.5524 12.9388 16.0002 12.4911 16.0002 11.9388V5.60547C16.0002 5.05318 15.5524 4.60547 15.0002 4.60547H5.0835C4.53121 4.60547 4.0835 5.05318 4.0835 5.60547Z"
        fill="#F7E5CE"
        stroke="#E9D3B6"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.3335 16.6228V9.50295L10.0001 12.8387L16.6668 9.50195V16.6228H3.3335Z"
        fill="#FFF8EF"
      />
      <path
        d="M3.5 16.4469L10 13.0323M10 13.0323L16.5 16.4469M10 13.0323L3.5 9.78027M10 13.0323L16.5 9.78027"
        stroke="#755428"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.4165 6.00879L14.6665 6.00879"
        stroke="#BD873F"
        strokeWidth="0.4"
        strokeLinecap="round"
      />
      <path
        d="M5.4165 7.77344L14.6665 7.77344"
        stroke="#BD873F"
        strokeWidth="0.4"
        strokeLinecap="round"
      />
      <path
        d="M5.4165 9.53809L14.6665 9.53809"
        stroke="#BD873F"
        strokeWidth="0.4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default MailIcon;
