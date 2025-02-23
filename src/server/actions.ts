"use server";

import { createFolder } from "./queries";
import { redirect } from "next/navigation";

export async function handleCreateFolder(formData: FormData) {
  const name = formData.get('folderName');
  if (typeof name !== 'string' || !name) return;
  
  await createFolder(name);
}

export async function handleSearch(formData: FormData) {
  const search = formData.get("search")?.toString();
  if (!search) return;
  redirect(`/search?q=${search}`);
} 