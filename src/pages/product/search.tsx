import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { BiReset } from "react-icons/bi";
const BarCodeScanner = dynamic(() => import("barcode-react-scanner"), {
  ssr: false,
});
import { FaSearch } from "react-icons/fa";

import { Spinner } from "@/components/Spinner";
import { trpc } from "@/utils/trpc";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ShowBarcodeModal } from "@/components/ShowBarcodeModal";
import { Session } from "next-auth";

interface Props {
  sess: Session;
}

const SearchProduct: NextPage<Props> = ({ sess }) => {
  const searchProduct = trpc.useMutation(["product.getByBarcodeOrName"]);

  const [barcodeName, setBarcodeName] = useState("");
  const [stream, setStream] = useState(true);

  const handleSearchData = () => {
    searchProduct.mutate({
      barcodeName: barcodeName,
    });
  };

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-gray-900">
      <Navbar session={sess} />
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
              Barcode / Name
            </label>
            <input
              type="text"
              id="barcode"
              value={barcodeName}
              onChange={(e) => {
                setBarcodeName(e.target.value);
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <div className="mt-4 mb-4">
              {stream && (
                <BarCodeScanner
                  onUpdate={(_, res) => {
                    if (res && res.getText()) {
                      setStream(false);
                      setBarcodeName(res.getText());
                    }
                  }}
                />
              )}
            </div>
            <div className="justify-center flex">
              <button
                className="text-white mb-4 cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type={"submit"}
              >
                <FaSearch />
              </button>
              <button
                type="button"
                onClick={() => {
                  setBarcodeName("");
                  setStream(true);
                }}
                className="text-white mb-4 ml-4 cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <BiReset />
              </button>
              {barcodeName.length > 0 && (
                <ShowBarcodeModal
                  className="text-white mb-4 ml-4 cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  barcode={barcodeName}
                />
              )}
            </div>
          </form>

          <div className="flex justify-center">
            {searchProduct.isLoading && <Spinner />}
          </div>
          {searchProduct.isSuccess &&
            searchProduct.data &&
            searchProduct.data.fetchProduct && (
              <ProductCard
                barcode={searchProduct.data.fetchProduct.barcode}
                name={searchProduct.data.fetchProduct.name}
                price={Number(searchProduct.data.fetchProduct.price)}
              />
            )}
          <div className="mb-4">
            {searchProduct.isSuccess &&
              searchProduct.data &&
              searchProduct.data.fetchByName &&
              searchProduct.data.fetchByName.map((product) => {
                return (
                  <div className="mb-4" key={product.id}>
                    <ProductCard
                      barcode={product.barcode}
                      name={product.name}
                      price={Number(product.price)}
                    />
                  </div>
                );
              })}
          </div>
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
      sess: session,
    },
  };
};

export default SearchProduct;
