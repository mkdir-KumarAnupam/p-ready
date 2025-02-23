import { getFolderImages } from "~/server/queries";
import Image from "next/image";
import Link from "next/link";

export async function FolderContent({ folderId }: { folderId: number }) {
  const images = await getFolderImages(folderId);

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <Link key={image.id} href={`/img/${image.id}`}>
          <div className="relative w-full h-48">
            <Image
              src={image.url}
              alt={image.name ?? ""}
              fill
              className="object-cover rounded"
            />
          </div>
        </Link>
      ))}
    </div>
  );
} 