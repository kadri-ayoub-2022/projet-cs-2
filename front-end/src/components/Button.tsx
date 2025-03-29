import React from "react";
import { Link } from "react-router"; // Corrected import for React Router v6+

type BaseProps = {
  text: string;
  icon?: React.ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
};

type ButtonProps = BaseProps & {
  onClick: () => void;
  href?: never;
};

type LinkProps = BaseProps & {
  href: string;
  onClick?: never;
};

type Props = ButtonProps | LinkProps;

const Button = ({ text, icon, onClick, href, className = "", loading = false, disabled = false }: Props) => {
  const isDisabled = loading || disabled;
  
  const classes = `flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition 
    ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-blue-700 text-white"} 
    ${className}`;

  if (href) {
    return (
      <Link to={href} className={classes}>
        {loading ? <span className="animate-spin">🔄</span> : icon && <span>{icon}</span>}
        <span>{text}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} disabled={isDisabled}>
      {loading ? <span className="animate-spin">🔄</span> : icon && <span>{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default Button;
