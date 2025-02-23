import 'server-only'
import { db } from './db';
import { auth, currentUser } from '@clerk/nextjs/server';
import { eq, and, or } from 'drizzle-orm';
import { images, folders, imageShares, imageFolders } from './db/schema';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';



export async function getMyImages() {
    const user = await auth();
    const userInfo = await currentUser();
    const email = userInfo?.emailAddresses[0]?.emailAddress;

    if (!user.userId) return [];

    const images = await db.query.images.findMany({
        where: (image) => eq(image.userId, user.userId),
        with: {
            shares: true,
            folders: true
        }
    });

    return images.map(image => ({
        ...image,
        isShared: image.shares.some(share => share.sharedWith === email)
    }));
}

export async function getImage(id: number) {
    const user = await auth();
    const userInfo = await currentUser();
    const email = userInfo?.emailAddresses[0]?.emailAddress;

    if (!user.userId) {
        redirect('/');
    }

    const image = await db.query.images.findFirst({
        where: (image) => eq(image.id, id),
        with: {
            shares: true,
            folders: true
        }
    });

    if (!image) return null;

    return {
        ...image,
        isShared: image.shares.some(share => share.sharedWith === email)
    };
}

export async function deleteImage(id: number) {
    const user = await auth();

    if (!user.userId) {
        throw new Error('User not found');
    }
    
    const image = await db.query.images.findFirst({
        where: (model, { eq }) => eq(model.id, id),
    });

    if (!image) {
        throw new Error('Image not found');
    }

    // Set sharedWith to null before deleting
    await db.update(images)
      .set({ sharedWith: null })
      .where(eq(images.id, id));
    
    await db.delete(images).where(and(eq(images.id, id), eq(images.userId, user.userId)));
    revalidatePath('/');
    redirect('/');
    
}

export async function shareImage(imageId: number, sharedWithEmail: string) {
    const user = await auth();

    if (!user.userId) {
        throw new Error('Not authorized');
    }

    // Check if already shared with this email
    const existingShare = await db.query.imageShares.findFirst({
        where: (share, { eq, and }) => 
            and(eq(share.imageId, imageId), eq(share.sharedWith, sharedWithEmail))
    });

    if (existingShare) {
        throw new Error('Image already shared with this email');
    }

    await db.insert(imageShares).values({
        imageId,
        sharedWith: sharedWithEmail,
    });

    revalidatePath(`/img/${imageId}`);
}

export async function renameImage(imageId: number, newName: string) {
    const user = await auth();

    if (!user.userId) {
        throw new Error('User not found');
    }

    const image = await db.query.images.findFirst({
        where: (model, { eq }) => eq(model.id, imageId),
    });

    if (!image) {
        throw new Error('Image not found');
    }

    await db.update(images)
      .set({ name: newName })
      .where(and(eq(images.id, imageId), eq(images.userId, user.userId)));

    
    
    revalidatePath(`/img/${imageId}`);
}

export async function createFolder(name: string) {
  const user = await auth();

  if (!user.userId || !name) {
    throw new Error('Missing required fields');
  }

  await db.insert(folders).values({
    name,
    userId: user.userId,
  });
  
  revalidatePath('/');
}

export async function getFolders() {
  const user = await auth();
  
  if (!user.userId) return [];

  return await db.query.folders.findMany({
    where: (folder, { eq }) => eq(folder.userId, user.userId),
    orderBy: (folder, { asc }) => [asc(folder.createdAt)],
  });
} 

export async function addImageToFolder(imageId: number, folderId: number) {
  const user = await auth();

  if (!user.userId) {
    throw new Error('Not authorized');
  }

  await db.update(images)
    .set({ folderId })
    .where(and(eq(images.id, imageId), eq(images.userId, user.userId)));

  revalidatePath('/');
}

export async function moveImageToFolder(imageId: number, folderName: string) {
  const user = await auth();

  if (!user.userId) {
    throw new Error('Not authorized');
  }

  const folder = await db.query.folders.findFirst({
    where: (folder, { eq, and }) => 
      and(eq(folder.name, folderName), eq(folder.userId, user.userId))
  });

  if (!folder) {
    throw new Error('Folder not found');
  }

  // Check if image is already in this folder
  const existingFolder = await db.query.imageFolders.findFirst({
    where: (imgFolder, { eq, and }) => 
      and(eq(imgFolder.imageId, imageId), eq(imgFolder.folderId, folder.id))
  });

  if (existingFolder) {
    throw new Error('Image already in this folder');
  }

  await db.insert(imageFolders).values({
    imageId,
    folderId: folder.id,
  });

  revalidatePath(`/img/${imageId}`);
}

export async function getFolderImages(folderId: number) {
  const user = await auth();
  
  if (!user.userId) return [];

  const folderImages = await db.query.imageFolders.findMany({
    where: (imgFolder, { eq }) => eq(imgFolder.folderId, folderId),
    with: {
      image: true
    }
  });

  return folderImages.map(fi => fi.image);
}















