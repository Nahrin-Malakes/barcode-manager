import Link from "next/link";

interface Props {
  name: string;
  barcode: string;
  price: number;
}

export const ProductCard = ({ name, barcode, price }: Props) => {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="px-5 pb-5">
        <a href="#">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mt-4">
            {name}
          </h5>
        </a>
        <h5 className="text-l font-semibold tracking-tight text-gray-900 dark:text-white ">
          {barcode}
        </h5>
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {price}
          </span>
        </div>
      </div>
    </div>
  );
};

