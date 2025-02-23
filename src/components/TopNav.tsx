"use client";
import { SignedIn } from "@clerk/nextjs";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "~/app/api/uploadthing/core";
import "@uploadthing/react/styles.css"; 
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "~/components/ui/dialog";
import { handleCreateFolder } from "~/server/actions";
import { Input } from "@/components/ui/input"


function TopNav() {
    const router = useRouter();
    return (
      <div className="flex flex-row justify-between items-center p-4 text-xl border-b font-semibold ">
        <div onClick={() => router.push("/")} className="cursor-pointer">ProReady Gallery</div>
        <SignedIn>
          <div className="flex flex-row gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Create Folder</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Folder</DialogTitle>
                  <DialogDescription>Enter a name for the folder.</DialogDescription>
                </DialogHeader>
                <form action={handleCreateFolder}>
                  <input type="text" name="folderName" placeholder="Folder Name" className="bg-transparent border rounded p-2 text-white"/>
                  <Button type="submit" variant="outline" className="p-5">Create</Button>
                </form>
              </DialogContent>
            </Dialog>
            
            <UploadButton<OurFileRouter>
              endpoint="imageUploader"
              
              onClientUploadError={(error: Error) => {
                toast.error(error.message);
                toast.dismiss();
              }}

              onUploadProgress={() => {
                toast.dismiss();
              }}

              onUploadBegin={() => {
                toast.loading("Uploading...");
              }}

              onClientUploadComplete={() => {
                toast.success("Uploaded successfully");
                router.refresh();
                toast.dismiss();
              }}

              onUploadError={(error: Error) => {
                toast.error("You have reached the upload limit");
                toast.dismiss();
              }}
            />
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