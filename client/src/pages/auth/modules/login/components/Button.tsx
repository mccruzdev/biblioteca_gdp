export default function Button({
  isLogin,
  onClick,
  rounded,
  text,
}: {
  isLogin: boolean;
  onClick: () => void;
  text: string;
  rounded: string;
}) {
  return (
    <button
      className={`flex-1 py-1 font-bold ${rounded} ${
        isLogin ? "bg-yellow-500" : ""
      } transition duration-300 rounded-2xl`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
