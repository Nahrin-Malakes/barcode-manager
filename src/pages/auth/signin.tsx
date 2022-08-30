import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { Button } from "@nextui-org/react";

// @TODO: implement
const Signin: NextPage = () => {
  signIn("discord");
  return (
    <>
      <Button>test</Button>
    </>
  );
};

export default Signin;

