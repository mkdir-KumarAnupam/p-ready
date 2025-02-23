import { getMyImages, getFolders } from "~/server/queries";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"
import { auth } from "@clerk/nextjs/server";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { FolderContent } from "~/components/folder-content"

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  

  const image = await getMyImages();
  const folders = await getFolders();

function Images () {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {image.map((image) => (
        <div
          key={image.id}
          className="w-64 h-64 flex-shrink-0 relative"
        >
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="relative w-64 h-64">
                <Link href={`/img/${image.id}`}>
                  <Image
                    src={image.url}
                    fill
                    className="object-cover"
                    alt={image.name ?? ""}
                  />
                  {image.isShared && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
                      Shared
                    </div>
                  )}
                </Link>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="bg-black text-white text-xs border-none">
              {image.name && image.name.length > 30 
                ? `${image.name.slice(0, 27)}...` 
                : image.name ?? image.createdAt.toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })
              } {image.isShared && '(Shared)'}
            </HoverCardContent>
          </HoverCard>
        </div>
      ))}

      {folders.map((folder) => (
        <div key={folder.id} className="w-64 h-64 flex-shrink-0 relative border border-solid border-white border-2 rounded-lg">
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative w-64 h-64 cursor-pointer flex flex-col items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h5.586a1 1 0 01.707.293l1.414 1.414A1 1 0 0012.414 5H20a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 2v10h16V7h-7.586a1 1 0 01-.707-.293L9.293 5.293A1 1 0 008.586 5H4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="mt-2">{folder.name}</span>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{folder.name}</DialogTitle>
              </DialogHeader>
              <FolderContent folderId={folder.id} />
            </DialogContent>
          </Dialog>
        </div>
      ))}


    </div>
  );
}



  return (
    <main className="">

      <SignedOut>
        <div className="w-full h-screen bg-black text-3xl text-white justify-center">Please sign in</div>
      </SignedOut>
      <SignedIn>
        <div className="w-full h-screen bg-black text-3xl text-white justify-center">
          <Images />
        </div>

        

        
      </SignedIn>
    </main>
  );
}
