import Image from "next/image";

function ProfileImage(user: { name: string; image: string }) {
  return (
    <Image
      unoptimized
      width={48}
      height={48}
      className="w-12 h-12 rounded-full object-cover mr-2"
      src={user.image || "/images/default-profile.webp"}
      alt={"Profile image of " + user.name}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "/images/default-profile.webp";
      }}
    />
  );
}

export default ProfileImage;
