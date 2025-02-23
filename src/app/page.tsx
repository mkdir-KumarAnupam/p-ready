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
                  {image.favourited && (
                    <div className="absolute top-2 left-2 bg-yellow-500 border-solid border-yellow-500 border-2 rounded-full text-white text-xs px-2 py-1 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03L12 17.27z"
                        clipRule="evenodd"
                        className="text-white"
                      />
                    </svg>
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
        <div key={folder.id} className="w-64 h-64 flex-shrink-0 relative border border-solid border-white bg-white border-2 rounded-lg">
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative w-64 h-64 cursor-pointer flex flex-col items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 100 100">
              <path d="M18.5,90C12.71,90,8,85.29,8,79.5v-55C8,18.71,12.71,14,18.5,14h21.065 c2.43,0,4.801,0.851,6.676,2.396L51.832,21H83.5C89.29,21,94,25.71,94,31.5v48C94,85.29,89.29,90,83.5,90H18.5z" opacity=".35"></path><path fill="#f2f2f2" d="M16.5,88C10.71,88,6,83.29,6,77.5v-55C6,16.71,10.71,12,16.5,12h21.065 c2.43,0,4.801,0.851,6.676,2.396L49.832,19H81.5C87.29,19,92,23.71,92,29.5v48C92,83.29,87.29,88,81.5,88H16.5z"></path><path fill="#ef8630" d="M12.5,77.5v-55c0-2.209,1.791-4,4-4h21.065c0.928,0,1.827,0.322,2.543,0.912l6.284,5.175 c0.716,0.59,1.615,0.912,2.543,0.912H81.5c2.209,0,4,1.791,4,4v48c0,2.209-1.791,4-4,4h-65C14.291,81.5,12.5,79.709,12.5,77.5z"></path><polygon fill="#ffc571" points="13,79 17,81 82,81 85,78 85,34 13,34"></polygon><path fill="none" stroke="#40396e" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M12.5,77.5v-55c0-2.209,1.791-4,4-4h21.065c0.928,0,1.827,0.322,2.543,0.912l6.284,5.175c0.716,0.59,1.615,0.912,2.543,0.912H81.5 c2.209,0,4,1.791,4,4v48c0,2.209-1.791,4-4,4h-65C14.291,81.5,12.5,79.709,12.5,77.5z"></path>
              </svg>
                <span className="ml-0 mt-10 bg-black w-full/50 text-center text-sm text-white p-3 rounded-lg">{folder.name}</span>
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