"use client";
import { SignedIn } from "@clerk/nextjs";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { useRouter } from "next/navigation";


function TopNav() {
    const router = useRouter();
    return (
      <div className="flex flex-row justify-between items-center p-4 text-xl border-b font-semibold ">
        <div>ProReady</div>
        <SignedIn>
          <div className="flex flex-row gap-4">
            <UploadButton endpoint="imageUploader" onClientUploadComplete={() => router.refresh()} />
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    );
  }
  
  export default TopNav;