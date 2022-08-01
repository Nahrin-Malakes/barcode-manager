import { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";
const BarCodeScanner = dynamic(() => import("barcode-react-scanner"), {
  ssr: false,
});

import { Navbar } from "../../components/Navbar";
import { ProductCard } from "../../components/ProductCard";
import { trpc } from "../../utils/trpc";

const SearchProduct: NextPage = () => {
  const session = useSession();
  const searchProduct = trpc.useMutation(["product.getByBarcode"]);

  const [barcode, setBarcode] = useState("");
  const [stream, setStream] = useState(true);

  const handleSearchData = () => {
    searchProduct.mutate({
      barcode,
    });
  };

  return (
    <div className="h-screen w-screen bg-gray-900">
      <Navbar session={session.data!} />
      <div className="mb-6 px-9 mt-4 flex justify-center">
        <div className="w-96">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchData();
            }}
          >
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
              onChange={(e) => {
                setBarcode(e.target.value);
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <div className="mt-4 mb-4">
              {stream && (
                <BarCodeScanner
                  onUpdate={(err, res) => {
                    if (err) {
                      console.log(err);
                    } else if (res && res.getText()) {
                      setStream(false);
                      setBarcode(res.getText());
                    }
                  }}
                />
              )}
            </div>
            <div className="">
              <button
                className="text-white mb-4 cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type={"submit"}
              >
                Search Product
              </button>
            </div>
          </form>

          {searchProduct.isSuccess && searchProduct.data.fetchProduct && (
            <ProductCard
              barcode={searchProduct.data.fetchProduct.barcode}
              name={searchProduct.data.fetchProduct.name}
              price={Number(searchProduct.data.fetchProduct.price)}
            />
          )}
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

export default SearchProduct;

