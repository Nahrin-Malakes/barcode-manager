import { Navbar } from "@/components/Navbar";
import { SessionCard } from "@/components/SessionCard";
import { Spinner } from "@/components/Spinner";
import { trpc } from "@/utils/trpc";
import { Session } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

interface Props {
  sess: Session;
}

const AdminPage = ({ sess }: Props) => {
  const user = trpc.useQuery(["user.is-admin"]);
  const sessions = trpc.useQuery(["user.get-sessions"]);

  if (user.data && user.data?.isAdmin == true) {
    console.log(sessions);
  }

  if (!sessions.data?.sessions) return;

  return (
    <div className="h-screen bg-gray-900 text-gray-100">
      {/* @ts-ignore */}
      <Navbar session={sess} />
      <h1>Active sessions: </h1>
      {sessions.isLoading || (sessions.isFetching && <Spinner />)}
      {sessions.data.sessions &&
        sessions.data.sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session)
    return {
      notFound: true,
      props: {},
    };

  return {
    props: {
      sess: session,
    },
  };
};

export default AdminPage;

