import Link from "next/link";
import Image from "next/image";
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

export default function HomePage() {
  return (
    <main className="">
      <div className="flex flex-wrap gap-4 ">
        {[...mockImages, ...mockImages, ...mockImages, ...mockImages].map((image) => (
          <div key={Math.random()} className="w-48">
            <img src={image.url} alt ="image" />
          </div>
        ))}
      </div>      
    </main>
  );
}
