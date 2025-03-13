type Props = {
  color: string;
};
const PlusIcon = ({ color }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.20001C12.4418 2.20001 12.8 2.55818 12.8 3.00001V11.2H21C21.4418 11.2 21.8 11.5582 21.8 12C21.8 12.4418 21.4418 12.8 21 12.8H12.8V21C12.8 21.4418 12.4418 21.8 12 21.8C11.5582 21.8 11.2 21.4418 11.2 21V12.8H3.00001C2.55818 12.8 2.20001 12.4418 2.20001 12C2.20001 11.5582 2.55818 11.2 3.00001 11.2H11.2V3.00001C11.2 2.55818 11.5582 2.20001 12 2.20001Z"
        fill={color}
      />
    </svg>
  );
};

export default PlusIcon;
