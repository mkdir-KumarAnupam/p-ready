import Link from "next/link";
import Image from "next/image";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = 'force-dynamic';

export default async function HomePage() {

  const image = await db.query.images.findMany({
    orderBy: (model, { asc }) => [asc(model.createdAt)],
  });

  async function Images () {
    return (
      <div className="flex flex-wrap gap-4 ">
        {image.map((image) => (
          <div key={image.id} className="w-48 h-28 overflow-hidden">
            <img src={image.url} alt="image" className="w-full h-full object-cover" />
            <div className="flex flex-col gap-2">
              <div className="w-full bg-gray-200 rounded-md"></div>
              <div className="text-sm font-medium">{image.name}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  console.log("From server:", image);
  return (
    <main className="">

      <SignedOut>
        <div className="w-full h-screen flex bg-black text-3xl text-white items-center justify-center text-center">Please sign in</div>
      </SignedOut>
      <SignedIn>
        <Images />
      </SignedIn>
    </main>
  );
}
