interface ChevronRightIconProps {
  width?: string;
  height?: string;
  color?: string;
}
const ChevronRightIcon = ({ width, height, color }: ChevronRightIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? '16'}
      height={height ?? '16'}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.09507 14.3472C3.90337 14.1236 3.92927 13.7869 4.15291 13.5952L10.6805 8.00014L4.15291 2.40508C3.92927 2.21339 3.90337 1.87669 4.09507 1.65305C4.28676 1.42941 4.62345 1.40351 4.84709 1.5952L11.8471 7.5952C11.9653 7.69653 12.0333 7.84445 12.0333 8.00014C12.0333 8.15583 11.9653 8.30375 11.8471 8.40508L4.84709 14.4051C4.62345 14.5968 4.28676 14.5709 4.09507 14.3472Z"
        fill={color ?? '#545454'}
      />
    </svg>
  );
};

export default ChevronRightIcon;
