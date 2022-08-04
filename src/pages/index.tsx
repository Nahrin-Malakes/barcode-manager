import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Barcode Manager</title>
        <meta name="description" content="Manage your shop and warehouse" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Barcode Manager
        </h1>
        <Link href="/api/auth/signin">
          <button className="bg-gray-700 px-4 py-2 rounded-xl text-gray-200">
            Sign in
          </button>
        </Link>
        <Link href="/product">
          <button className="bg-gray-700 px-4 py-2 mt-4 rounded-xl text-gray-200">
            Home
          </button>
        </Link>
      </main>
    </>
  );
};

export default Home;

