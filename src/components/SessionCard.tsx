import { trpc } from "@/utils/trpc";
import { Session, User } from "@prisma/client";

interface Props {
  session: Session & {
    user: User;
  };
}

export const SessionCard = ({ session }: Props) => {
  const deleteSession = trpc.useMutation(["user.logout-user"]);

  const handleDeleteSession = () => {
    deleteSession.mutate({
      sessionId: session.id,
      userId: session.userId,
    });
  };

  return (
    <div className="max-w-sm bg-white flex rounded-lg shadow-md dark:bg-gray-800 justify-center dark:border-gray-700 px-5 pb-5">
      <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mt-4">
        user: {session.user.name}
      </h5>
      <button onClick={handleDeleteSession}>x</button>
    </div>
  );
};

