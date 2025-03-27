import { IoIosCheckbox } from "react-icons/io";

export default function Checkbox({
  checked,
  handleClick,
}: {
  checked?: boolean;
  handleClick?: () => void;
}) {
  return (
    <div
      className={`w-5 h-5 border rounded-sm border-gray-500 overflow-hidden flex justify-center items-center`}
      onClick={handleClick}
    >
      {checked && <IoIosCheckbox className="w-full h-full text-blue-600" />}
    </div>
  );
}
