import { Link } from "react-router";

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export default function Button({
  className = "",
  children,
  href,
  variant = "primary",
  onClick,
}: ButtonProps) {
  const baseStyles =
    "inline-block px-4 py-2 rounded hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-color duration-200";
  const variantStyles =
    variant === "primary"
      ? "bg-white text-black hover:bg-gray-200 focus:ring-blue-500"
      : "text-gray-800 hover:bg-black focus:ring-gray-400";

  const combinedStyles = `${baseStyles} ${variantStyles} ${className}`;

  if (href) {
    return (
      <Link to={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} onClick={onClick}>
      {children}
    </button>
  );
}
