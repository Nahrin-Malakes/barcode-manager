import { Product } from "@prisma/client";
import { NextPage, GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { ProductCard } from "../../components/ProductCard";
import { trpc } from "../../utils/trpc";

const Product: NextPage = () => {
  const session = useSession();
  const products = trpc.useQuery(["product.getAll"]);

  const [productsState, setProductsState] = useState<Product[] | undefined>(
    undefined
  );

  useEffect(() => {
    setProductsState(products.data);
  }, [products]);

  if (
    !session ||
    !session.data ||
    !session.data.user ||
    !session.data.user.image
  )
    return <p>no session</p>;

  return (
    <div className="h-auto mx-auto my-auto bg-gray-900 w-full pb-4">
      <Navbar session={session.data} />
      <div className="mt-8 px-20 container grid grid-rows-4 grid-flow-col gap-4">
        {products.status === "success" &&
          productsState &&
          productsState.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              barcode={product.barcode}
              price={Number(product.price)}
            />
          ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
      },
      props: {},
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default Product;

