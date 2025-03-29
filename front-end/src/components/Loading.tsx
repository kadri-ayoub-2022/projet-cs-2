import logo from '../assets/logo.png'

type LoadingProps = {
  size?: "small" | "medium" | "large";
  color?: string;
  className?: string;
};

const sizeClasses = {
  small: "w-6 h-6 border-2",
  medium: "w-10 h-10 border-4",
  large: "w-16 h-16 border-4",
};

const Loading = ({
  size = "medium",
  color = "border-blue-500",
  className,
}: LoadingProps) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]} ${color} ${className}`}
      />
    </div>
  );
};


export function LoadingScreen() {
  return (
    <div className="h-screen flex justify-center items-center flex-col gap-6">
      <img src={logo} alt="" />
      <Loading />
    </div>
  )
}


export default Loading;
