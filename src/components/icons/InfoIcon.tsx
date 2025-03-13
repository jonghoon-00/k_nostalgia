type Props = {
  color: string;
  width: string;
  height: string;
};
const InfoIcon = ({ color, width, height }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20.4C16.6392 20.4 20.4 16.6392 20.4 12C20.4 7.36081 16.6392 3.6 12 3.6C7.36081 3.6 3.6 7.36081 3.6 12C3.6 16.6392 7.36081 20.4 12 20.4ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8ZM12.8 11C12.8 10.5582 12.4418 10.2 12 10.2C11.5582 10.2 11.2 10.5582 11.2 11V17C11.2 17.4418 11.5582 17.8 12 17.8C12.4418 17.8 12.8 17.4418 12.8 17V11Z"
        fill={color}
      />
    </svg>
  );
};

export default InfoIcon;
