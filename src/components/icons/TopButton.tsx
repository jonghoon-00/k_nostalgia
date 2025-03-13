'use client';

const TopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <button
      type="button"
      className="whitespace-nowrap rounded-md text-sm font-medium text-primary-foreground h-10 w-10 flex justify-center items-center"
      onClick={scrollToTop}
    >
      <div className="flex items-center justify-center rounded-full bg-secondary-60 shadow w-10 h-10 p-[6px] cursor-pointer z-50 hover:bg-secondary-40">
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
            d="M11.4707 2.40014C11.7731 2.1333 12.2268 2.1333 12.5293 2.40014L21.0293 9.90014C21.3606 10.1925 21.3922 10.698 21.0998 11.0293C20.8075 11.3606 20.302 11.3922 19.9707 11.0999L12.8 4.77279V21C12.8 21.4418 12.4418 21.8 12 21.8C11.5581 21.8 11.2 21.4418 11.2 21V4.77279L4.02926 11.0999C3.69796 11.3922 3.19241 11.3606 2.90009 11.0293C2.60777 10.698 2.63936 10.1924 2.97066 9.90012L11.4707 2.40014Z"
            fill="#545454"
          />
        </svg>
      </div>
    </button>
  );
};

export default TopButton;
