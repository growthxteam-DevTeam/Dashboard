import Image from "next/image";

import { cn } from "@/lib/utils";

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

interface AvatarProps {
  name: string;
  src?: string | null;
  className?: string;
}

// Defaults to size-9; pass a `size-*` class to resize.
const Avatar = ({ name, src, className }: AvatarProps) =>
  src ? (
    <Image
      src={src}
      alt={name}
      width={36}
      height={36}
      unoptimized
      className={cn("size-9 shrink-0 rounded-full object-cover", className)}
    />
  ) : (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );

export default Avatar;
