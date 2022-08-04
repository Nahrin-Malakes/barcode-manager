import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../utils/trpc";
// @ts-ignore
import Barcode from "react-barcode";
import { BsFillTrashFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { BiBarcodeReader } from "react-icons/bi";

interface Props {
  name: string;
  barcode: string;
  price: number;
}

export const ProductCard = ({ name, barcode, price }: Props) => {
  const deleteProduct = trpc.useMutation(["product.deleteByBarcode"]);
  const editProduct = trpc.useMutation(["product.editByBarcode"]);
  const router = useRouter();

  const DeleteProductModal = () => {
    const [showModal, setShowModal] = useState(false);

    const handleDelete = () => {
      deleteProduct.mutate({
        barcode,
      });

      if (deleteProduct.data?.success) {
        setShowModal(false);
        router.reload();
      }
    };

    return (
      <>
        {" "}
        <button
          className="text-white mt-2 cursor-pointer bg-red-700 hover:bg-blue-800 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700"
          type={"submit"}
          onClick={() => setShowModal(true)}
        >
          <BsFillTrashFill />
        </button>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-700 outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between  border-slate-200 rounded-t">
                    <button
                      className="p-1 ml-auto bg-transparent border-0 opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <h1 className="my-4 text-gray-300 text-2xl leading-relaxed">
                      Are you sure you want to delete this product?
                    </h1>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      onClick={handleDelete}
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                    >
                      Yes, {"I'm"} sure
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      No, cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    );
  };

  const EditProductModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [editName, setEditName] = useState(name);
    const [editPrice, setEditPrice] = useState(price);

    const handleEdit = () => {
      setShowModal(false);
      editProduct.mutate({
        barcode,
        name: editName,
        price: editPrice,
      });
      router.reload();
    };

    return (
      <>
        <button
          className="text-white mt-2 cursor-pointer bg-blue-700 hover:bg-blue-800 mx-2 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-700 dark:hover:bg-blue-800"
          type={"submit"}
          onClick={() => setShowModal(true)}
        >
          <FiEdit />
        </button>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-96 mx-auto max-w-xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-700 outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between  border-slate-200 rounded-t">
                    <button
                      className="p-1 ml-auto bg-transparent border-0 opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEdit();
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
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
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
                        value={editPrice.toString()}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </form>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      onClick={handleEdit}
                      type="button"
                      className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    );
  };

  const ShowBarcodeModal = () => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <button
          className="text-white mt-2 cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-700 dark:hover:bg-blue-800"
          type={"submit"}
          onClick={() => setShowModal(true)}
        >
          <BiBarcodeReader />
        </button>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-700 outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between  border-slate-200 rounded-t">
                    <button
                      className="p-1 ml-auto bg-transparent border-0 opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <Barcode value={barcode} />
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    );
  };

  return (
    <div className="max-w-sm bg-white flex rounded-lg shadow-md dark:bg-gray-800 justify-center dark:border-gray-700">
      <div className="px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mt-4">
          שם מוצר: {name}
        </h5>
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white ">
          ברקוד: {barcode}
        </h5>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            מחיר: {price + "₪"}
          </span>
        </div>
        <DeleteProductModal />
        <EditProductModal />
        <ShowBarcodeModal />
      </div>
    </div>
  );
};
