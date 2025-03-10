import React from "react";
import { Link } from "react-router";

type BaseProps = {
  text: string;
  icon?: React.ReactNode;
  className?: string;
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

const Button = ({ text, icon, onClick, href, className } : Props) => {
  const classes = `flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 cursor-pointer transition ${className}`;

  if (href) {
    return (
      <Link to={href} className={classes}>
        {icon && <span>{icon}</span>}
        <span>{text}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default Button;
