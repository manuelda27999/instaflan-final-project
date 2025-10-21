import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import cookiesToken from "@/lib/helpers/cookiesToken";
import toggleFollowUser from "@/lib/api/toggleFollowUser";
import retrieveFollowing from "@/lib/api/retrieveFollowing";
import extractUserIdFromToken from "@/lib/helpers/extractUserIdFromToken";

interface FollowedModalProps {
  onHideFollowingModal: () => void;
}

interface User {
  id: string;
  name: string;
  image: string;
  follow: boolean;
}

export default function FollowingModal(props: FollowedModalProps) {
  const token = cookiesToken.get();
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const pathname = usePathname();
  const userIdProfile = pathname.split("/")[2];

  const userId = extractUserIdFromToken(token);

  useEffect(() => {
    try {
      retrieveFollowing(token, userIdProfile)
        .then((users) => setUsers(users))
        .catch((error: any) => alert(error.message));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  }, []);

  const handleProfile = (
    event: React.MouseEvent<HTMLAnchorElement>,
    userIdProfile: string
  ) => {
    event.preventDefault();
    router.push(`/profile/${userIdProfile}/posts`);
    props.onHideFollowingModal();
  };

  const handleCancelFollowingModal = () => {
    props.onHideFollowingModal();
  };

  function handleFollowUser(userFollowId: string) {
    try {
      toggleFollowUser(token, userFollowId)
        .then(() => {
          setUsers((users) => {
            const users2 = [...users];

            const index = users2.findIndex((user) => user.id === userFollowId);
            const userFind = users2[index];

            const user2 = { ...userFind };

            user2.follow = !user2.follow;

            users2[index] = user2;

            return users2;
          });
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 m-auto bg-black/60 w-full h-full z-10 flex flex-col items-center justify-center">
      <div className="flex flex-col justify-center items-center p-4 bg-color5 border-3 border-solid border-black border-4 rounded-lg w-5/6">
        {users?.length === 0 ? (
          <div className="flex flex-col justify-center items-center">
            <p className="text-color2">Zero following</p>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center w-full">
            <h3 className="text-2xl font-bold text-color1 mb-4">Following</h3>
            {users?.map((user) => (
              <article key={user.id} className="flex w-full">
                <div className="flex justify-between items-center w-full bg-white m-1 p-1 px-2 rounded-2xl">
                  <div className="flex flex-start items-center">
                    <img
                      className="rounded-full mr-1 w-12 h-12 object-cover"
                      src={user.image}
                      alt={user.name}
                    />
                    <a
                      onClick={(event) => handleProfile(event, user.id)}
                      className="font-semibold text-color1 text-lg cursor-pointer"
                    >
                      {user.name}
                    </a>
                  </div>
                  {userId === userIdProfile && (
                    <button
                      onClick={() => handleFollowUser(user.id)}
                      className="button bg-color4 text-white border-none rounded-xl px-3 py-1 ml-4 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3 edit-profile-button"
                    >
                      {user?.follow ? "Unfollow" : "Follow"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        <button
          onClick={handleCancelFollowingModal}
          type="button"
          className="bg-color4 text-white border-none rounded-xl px-3 py-1 mt-3 font-bold text-xl cursor-pointer transition duration-300 hover:bg-color3"
        >
          Back
        </button>
      </div>
    </div>
  );
}
