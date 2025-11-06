import Image from "next/image";

type ProfileImageProps = {
  name: string;
  image: string;
};

function ProfileImage({ name, image }: ProfileImageProps) {
  return (
    <span className="w-16 h-16 min-w-16 min-h-16">
      <Image
        width={120}
        height={120}
        sizes="90px"
        quality={90}
        className={
          "w-full h-full object-cover rounded-full border-2 border-white"
        }
        src={image || "/images/default-profile.webp"}
        alt={`Profile image of ${name}`}
        onError={(event) => {
          const target = event.target as HTMLImageElement;
          target.src = "/images/default-profile.webp";
        }}
      />
    </span>
  );
}

export default ProfileImage;
