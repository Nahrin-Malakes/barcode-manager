import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { Nav } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { trpc } from "@/utils/trpc";
import { Session } from "next-auth";
import { Container, Grid, Loading } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";

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
    <>
      <Nav user={session.user} />
      <ToastContainer />
      <Container css={{ mt: "$10", maxW: "stretch", mx: "$20" }}>
        <Grid.Container
          justify="flex-start"
          css={{
            gap: "$8",
            xs: 1,
          }}
        >
          {products.isLoading && <Loading />}
          {productsState &&
            productsState.map((product) => (
              <Grid key={product.id}>
                <ProductCard
                  barcode={product.barcode}
                  name={product.name}
                  price={Number(product.price)}
                />
              </Grid>
            ))}
        </Grid.Container>
      </Container>
      {/* {products.isLoading && (
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
      </div> */}
    </>
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

// "@xs": {
//   bg: "$yellow500",
// },
// "@sm": {
//   bg: "$red500",
// },
// "@md": {
//   bg: "$green500",
// },
// "@lg": {
//   bg: "$pink800",
// },
