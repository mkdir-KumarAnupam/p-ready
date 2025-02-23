import { clerkClient } from "@clerk/nextjs/server";
import { getImage, deleteImage, shareImage, renameImage, moveImageToFolder } from "~/server/queries";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { revalidatePath } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"




export default async function FullPageImageView(props: {id: number}) {
  const imageId = props.id;
  const image = await getImage(imageId);
  
  if (!image?.userId) {
    redirect('/');
    return null;
  }
  
  async function deleteAction() {
    "use server";
    await deleteImage(imageId);
  }

  const clerk = await clerkClient();
  const uploaderInfo = await clerk.users.getUser(image.userId);

  async function handleShare(formData: FormData) {
    "use server";
    const email = formData.get('email')?.toString();
    if (!email) return;
    await shareImage(imageId, email);
  }

  async function handleRename(formData: FormData) {
    "use server";
    const newName = formData.get('newName')?.toString();
    if (!newName) return;
    await renameImage(imageId, newName);
  }

  async function handleMoveToFolder(formData: FormData) {
    "use server";
    const folderName = formData.get('folderName')?.toString();
    if (!folderName) return;
    await moveImageToFolder(imageId, folderName);
  }

  return (
    <div className="flex h-full justify-between min-w-0">
        <div className="w-full flex-shrink flex justify-center items-center bg-black/50">
            <Image 
              src={image.url ?? ""} 
              alt={image.name ?? "Image"} 
              width={800}
              height={600}
              className="object-cover" 
            />
        </div>

        <div className="flex flex-col w-96 h-full bg-black flex-shrink-0 border-l-2 border-white gap-2">
            <div className="text-xl text-white text-center border-b-2 border-white p-2">
              {image.name}
              
              
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="ml-5">
                    Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rename Image</DialogTitle>
                      <DialogDescription>Enter a new name for the image below.</DialogDescription>
                    </DialogHeader>
                    <form action={handleRename}>
                      <input type="text" name="newName" placeholder="New Name" className="bg-transparent border rounded p-2 text-white"/>
                      <Button type="submit" className="ml-5 justify-center">Submit</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              
            </div>
            <div className="text-white p-2">
              <span>Uploaded By </span>
              {uploaderInfo?.firstName} {uploaderInfo?.lastName}
            </div>
            <div className="text-white p-2">
              <span>Uploaded At </span>
              {image.createdAt?.toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
            <div className="text-white p-2">
              <form action={deleteAction}>
                <Button type="submit" variant="destructive">Delete</Button>
              </form>
            </div>

            <div className="text-white p-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Share</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Image</DialogTitle>
                    <DialogDescription>Enter an email to share the image with.</DialogDescription>
                  </DialogHeader>
                  <form action={handleShare} className="flex flex-col gap-2">
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Enter email to share with"
                      className="text-white bg-transparent border rounded p-2" 
                      required
                    />
                    <Button type="submit" variant="outline">Share</Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Move to Folder</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Move Image to Folder</DialogTitle>
                    <DialogDescription>Select a folder to move the image to.</DialogDescription>
                  </DialogHeader>
                  <form action={handleMoveToFolder}>
                    <input type="text" name="folderName" placeholder="Enter folder name" className="bg-transparent border rounded p-2 text-white"/>
                    <Button type="submit" className="ml-5 justify-center">Submit</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
        </div>
    </div>    
  );
}