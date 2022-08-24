import { SessionCard } from "@/components/SessionCard";
import { Session } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serialize } from "superjson";

interface Props {
  sessions: {
    json: Session[];
  };
}

const AdminPage = ({ sessions }: Props) => {
  return (
    <div className="h-screen bg-gray-900 text-gray-100">
      <h1>Active sessions: </h1>
      {sessions.json &&
        sessions.json.map((session) => (
          <SessionCard
            key={session.id}
            sessionId={session.id}
            userId={session.userId}
          />
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

  const user = await prisma?.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  if (user?.role !== "ADMIN") {
    return {
      notFound: true,
      props: {},
    };
  }

  const sessions = await prisma?.session.findMany({});

  return {
    props: {
      sess: session,
      sessions: serialize(sessions),
    },
  };
};

export default AdminPage;

