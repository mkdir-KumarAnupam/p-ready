import Link from "next/link";
import Image from "next/image";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";

export const dynamic = 'force-dynamic';
const mockUrls = [
  "https://9jv9plfoq5.ufs.sh/f/0lyXt49U6bSwLSf8J1HXrdlVDik2gIYQGzwt3eLovRTN9ySW",
  "https://9jv9plfoq5.ufs.sh/f/0lyXt49U6bSwLMaCN8HXrdlVDik2gIYQGzwt3eLovRTN9ySW",
  "https://9jv9plfoq5.ufs.sh/f/0lyXt49U6bSwbt1ggceGNlhfaPjZ38mx5qwubOQVK2YyXSng",
  "https://9jv9plfoq5.ufs.sh/f/0lyXt49U6bSwYMHyAWC1NcSAj7VWuUPzC5EKIosimhvbf0Od",
  "https://9jv9plfoq5.ufs.sh/f/0lyXt49U6bSwRuNq6W7SWvOKRPlJioMTZqm15ABzgrIxNCXb"

]

const mockImages = mockUrls.map((url, index) => ({
  id: index+1,
  url,
})) 

export default async function HomePage() {

  const post = await db.query.posts.findMany();

  console.log("From server:", post);
  return (
    <main className="">
      <div className="flex flex-wrap gap-4 ">
        {post.map((post) => (
          <div key={post.id} className="w-48">
            <div className="flex flex-col gap-2">
              <div className="w-full bg-gray-200 rounded-md"></div>
              <div className="text-sm font-medium">{post.name}</div>
            </div>
          </div>
        ))}
        {mockImages.map((image) => (
          <div key={image.id} className="w-48">
            <img src={image.url} alt ="image" />
          </div>
        ))}
      </div>      
    </main>
  );
}
