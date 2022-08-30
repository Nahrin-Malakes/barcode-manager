import { useRouter } from "next/router";
import { useState } from "react";
// @ts-ignore
import Barcode from "react-barcode";
import { IoLogoUsd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { BiBarcodeReader, BiRename, BiTrash } from "react-icons/bi";
import { toast } from "react-toastify";

import { trpc } from "@/utils/trpc";
import { Button, Card, Input, Modal, Row, Text } from "@nextui-org/react";

interface Props {
  name: string;
  barcode: string;
  price: number;
}

export const ProductCard = ({ name, barcode, price }: Props) => {
  const deleteProduct = trpc.useMutation(["product.deleteByBarcode"]);
  const editProduct = trpc.useMutation(["product.editByBarcode"]);
  const [errorModalShow, setErrorModalShow] = useState(false);

  const router = useRouter();

  const DeleteProductModal = () => {
    const [visible, setVisible] = useState(false);

    const handler = () => setVisible(true);

    const closeHandler = () => {
      setVisible(false);
    };

    const deleteHandler = () => {
      deleteProduct.mutate(
        {
          barcode,
        },
        {
          onError(error) {
            if (error.data?.code == "UNAUTHORIZED") {
              setErrorModalShow(true);
            }
          },
          onSuccess() {
            setVisible(false);
            router.reload();
          },
        }
      );
    };

    return (
      <>
        <Button auto color="error" shadow onPress={handler}>
          <BiTrash />
        </Button>
        <Modal
          closeButton
          blur
          aria-labelledby="modal-title"
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Header>
            <Text id="modal-title" h4>
              Are you sure you want to delete this product?
            </Text>
          </Modal.Header>

          <Modal.Footer>
            <Button auto flat color="default" onPress={closeHandler}>
              Close
            </Button>
            <Button auto color="error" onPress={deleteHandler}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const EditProductModal = () => {
    const [visible, setVisible] = useState(false);

    const handler = () => setVisible(true);

    const closeHandler = () => {
      setVisible(false);
    };

    const [editName, setEditName] = useState(name);
    const [editPrice, setEditPrice] = useState(price);

    const editHandler = () => {
      setVisible(false);
      editProduct.mutate(
        {
          barcode,
          name: editName,
          price: editPrice,
        },
        {
          onError(err) {
            toast(err.message);
            console.log(err);
          },
          onSuccess() {
            router.reload();
          },
        }
      );
    };

    return (
      <>
        <Button auto color="default" shadow onPress={handler}>
          <FiEdit />
        </Button>
        <Modal
          closeButton
          blur
          aria-labelledby="modal-title"
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Header>
            <Text id="modal-title" size={18}>
              Edit Product
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Name"
              aria-labelledby="name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              contentLeft={<BiRename fill={"currentColor"} />}
            />
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Price"
              aria-labelledby="price"
              value={editPrice}
              onChange={(e) => setEditPrice(Number(e.target.value))}
              contentLeft={<IoLogoUsd />}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button auto flat color="error" onPress={closeHandler}>
              Close
            </Button>
            <Button auto onPress={editHandler}>
              Edit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const ShowBarcodeModal = () => {
    const [visible, setVisible] = useState(false);

    const handler = () => setVisible(true);

    const closeHandler = () => {
      setVisible(false);
    };

    return (
      <>
        <Button auto color="error" shadow onPress={handler}>
          <BiBarcodeReader />
        </Button>
        <Modal
          closeButton
          blur
          aria-labelledby="modal-title"
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Header>
            <div>
              <Barcode value={barcode} />
            </div>
          </Modal.Header>

          <Modal.Footer>
            <Button auto flat color="default" onPress={closeHandler}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const ErrorModal = () => {
    return (
      <>
        {errorModalShow ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 text-gray-100 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-700 outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-2xl font-semibold">
                      You {`can't`} do this
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-gray-100 opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setErrorModalShow(false)}
                    >
                      <span className="bg-transparent text-gray-100 opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>

                  {/*footer*/}
                  <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setErrorModalShow(false)}
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
    <>
      <Card isHoverable variant="bordered" css={{ maxW: "@sm" }}>
        <Card.Body css={{ alignItems: "center" }}>
          <Text h4> שם מוצר: {name}</Text>
          <Text h4> ברקוד: {barcode}</Text>
          <Text h4> מחיר: {price + "₪"}</Text>
          <Card.Divider />
          <Card.Footer>
            <Row
              css={{
                mx: "$12",
              }}
              justify="center"
            >
              <Button size="xs" light>
                <DeleteProductModal />
              </Button>
              <Button size="xs" light>
                <EditProductModal />
              </Button>
              <Button size="xs" light>
                <ShowBarcodeModal />
              </Button>
            </Row>
            <ErrorModal />
          </Card.Footer>
        </Card.Body>
      </Card>
    </>
  );
};
