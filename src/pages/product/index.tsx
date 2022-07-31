import { NextPage, GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { Navbar } from "../../components/Navbar";
import { ProductCard } from "../../components/ProductCard";
import { trpc } from "../../utils/trpc";

const Product: NextPage = () => {
  const session = useSession();
  const products = trpc.useQuery(["product.getAll"]);

  if (
    !session ||
    !session.data ||
    !session.data.user ||
    !session.data.user.image
  )
    return <p>no session</p>;

  return (
    <div className="h-full bg-gray-900 w-full">
      <Navbar session={session.data} />
      <div className="mt-8 px-20 grid grid-rows-6 grid-flow-col gap-4">
        {products.status === "success" &&
          products.data.map((product, index) => (
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

