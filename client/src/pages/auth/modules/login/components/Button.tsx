export default function Button({
  isLogin,
  onClick,
  rounded,
  text,
  className,
}: {
  isLogin: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
  rounded: string;
  className?: string;
}) {
  return (
    <button
      className={`flex-1 py-1 font-bold ${rounded} ${className} ${
        isLogin ? "bg-yellow-500" : ""
      } transition duration-300 rounded-2xl`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
