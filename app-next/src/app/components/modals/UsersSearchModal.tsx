import { useEffect, useState } from "react";
import context from "@/lib/api/helpers/context";
import { useRouter } from "next/navigation";

interface UsersSearchModalProps {
  users: { id: string; name: string; image: string }[];
  modalRef: React.RefObject<HTMLDivElement | null>;
}

interface User {
  id: string;
  name: string;
  image: string;
}

export default function UsersSearchModal(props: UsersSearchModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    setUsers(props.users);
  }, [props.users]);

  const handleProfile = (
    event: React.MouseEvent<HTMLAnchorElement>,
    userIdProfile: string
  ) => {
    event.preventDefault();
    router.push(`/profile/${userIdProfile}/posts`);
  };

  return (
    <div
      ref={props.modalRef}
      className="fixed top-14 left-48 flex flex-col items-center mr-2"
    >
      <div className="modal-peak"></div>
      {users?.length > 0 ? (
        <div className="bg-white flex flex-col items-center justify-center rounded-xl">
          {users?.map((user) => (
            <article className="px-2 py-1" key={user.id}>
              <div className="flex items-center">
                <img
                  className="rounded-full mr-1 w-12 h-12 object-cover"
                  src={user.image}
                  alt={user.name}
                />
                <a
                  onClick={(event) => handleProfile(event, user.id)}
                  className="font-semibold text-color1 text-lg"
                >
                  {user.name}
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white flex flex-col items-center justify-center rounded-xl">
          <article className="px-2 py-1">
            <h2 className="font-semibold text-color1 text-lg">Not found</h2>
          </article>
        </div>
      )}
    </div>
  );
}
