import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Spinner } from "@/components/Spinner";
import { trpc } from "@/utils/trpc";
import { Session } from "next-auth";

interface Props {
  sess: Session;
}

const Product: NextPage<Props> = ({ sess: session }) => {
  const products = trpc.useQuery(["product.getAll"]);

  const [productsState, setProductsState] = useState<Product[] | undefined>(
    undefined
  );

  useEffect(() => {
    setProductsState(products.data);
  }, [products]);

  return (
    <div className="lg:h-max sm:h-max mx-auto my-auto bg-gray-900 w-full pb-4">
      <Navbar session={session} />
      {products.isLoading && (
        <div className="h-screen flex justify-center mt-4">
          <Spinner />
        </div>
      )}
      <div className="mt-4 lg:px-32 px-10 grid md:grid-rows-1 md:grid-flow-row lg:grid-cols-4 lg:grid-rows-4 gap-4">
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

  if (!session)
    return {
      redirect: {
        destination: "/api/auth/signin",
      },
      props: {},
    };

  return {
    props: {
      sess: session,
    },
  };
};

export default Product;
