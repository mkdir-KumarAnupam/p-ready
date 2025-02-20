import Link from "next/link";
import Image from "next/image";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";

export const dynamic = 'force-dynamic';

export default async function HomePage() {

  const image = await db.query.posts.findMany({
    orderBy: (model, { asc }) => [asc(model.createdAt)],
  });

  console.log("From server:", image);
  return (
    <main className="">
      <div className="flex flex-wrap gap-4 ">
        {image.map((image) => (
          <div key={image.id} className="w-48">
            <img src={image.url} alt="image" />
            <div className="flex flex-col gap-2">
              <div className="w-full bg-gray-200 rounded-md"></div>
              <div className="text-sm font-medium">{image.name}</div>
            </div>
          </div>
        ))}
      </div>      
    </main>
  );
}
