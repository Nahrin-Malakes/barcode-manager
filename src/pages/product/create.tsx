import { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";
const BarCodeScanner = dynamic(() => import("barcode-react-scanner"), {
  ssr: false,
});

import { Navbar } from "../../components/Navbar";
import { trpc } from "../../utils/trpc";

const CreateProduct: NextPage = () => {
  const session = useSession();
  const createProduct = trpc.useMutation(["product.create"]);

  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [price, setPrice] = useState<string | null>("");
  const [readBarcode, setReadBarcode] = useState<boolean>(false);

  const handleCreateProduct = () => {
    createProduct.mutate({ name, barcode, price: Number(price) });
  };

  return (
    <div className="h-screen bg-gray-900">
      <Navbar session={session.data!} />
      <div className="mb-6 px-9 mt-4 flex justify-center">
        <div className="w-96">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateProduct();
            }}
          >
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <label
              htmlFor="barcode"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 mt-4"
            >
              Barcode
            </label>
            <input
              type="text"
              id="barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <label
              htmlFor="price"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 mt-4"
            >
              Price
            </label>
            <input
              type="text"
              id="price"
              value={price?.toString()}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <div className="mt-4 mb-4">
              {!readBarcode && (
                <BarCodeScanner
                  onUpdate={(err, res) => {
                    if (err) {
                      console.log(err);
                    } else if (res && res.getText()) {
                      setBarcode(res.getText());
                      setReadBarcode(true);
                    }
                  }}
                />
              )}
            </div>
            <div className="">
              <button
                className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type={"submit"}
              >
                Create Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default CreateProduct;

