"use server";

import { createFolder } from "./queries";

export async function handleCreateFolder(formData: FormData) {
  const name = formData.get('folderName');
  if (typeof name !== 'string' || !name) return;
  
  await createFolder(name);
} 