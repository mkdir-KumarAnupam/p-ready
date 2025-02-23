"use client";
import { Button } from "~/components/ui/button";
import { deleteImage } from "~/server/queries";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteImageButton({ imageId }: { imageId: number }) {
  const router = useRouter();

  async function deleteAction() {
    try {
      await deleteImage(imageId);
      toast.success("Image successfully removed");
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  }

  return (
    <form action={deleteAction}>
      <Button type="submit" variant="destructive">Delete</Button>
    </form>
  );
} 