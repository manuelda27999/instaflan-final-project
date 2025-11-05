import Image from "next/image";

type ProfileImageProps = {
  name: string;
  image: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

const SIZE_MAP: Record<
  NonNullable<ProfileImageProps["size"]>,
  { dimension: string; pixels: number }
> = {
  xs: { dimension: "h-8 w-8", pixels: 32 },
  sm: { dimension: "h-10 w-10", pixels: 40 },
  md: { dimension: "h-12 w-12", pixels: 48 },
  lg: { dimension: "h-16 w-16", pixels: 64 },
};

function ProfileImage({
  name,
  image,
  size = "md",
  className = "",
}: ProfileImageProps) {
  const { dimension, pixels } = SIZE_MAP[size];
  const containerClasses = [
    "relative inline-flex items-center justify-center",
    dimension,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={containerClasses}>
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300/45 via-teal-300/35 to-sky-400/45 opacity-70 blur-[6px]" />
      <Image
        unoptimized
        width={pixels}
        height={pixels}
        className={`relative z-10 ${dimension} rounded-full border border-white/15 bg-slate-900/40 object-cover`}
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
