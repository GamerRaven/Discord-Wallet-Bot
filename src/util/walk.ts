import { readdir, stat } from "fs/promises";

export default async function walk(directory: string) {
  const files: string[] = [];
  const readFiles = await readdir(directory);

  for (const file of readFiles) {
    const path = [directory, file].join("/");
    const stats = await stat(path);

    if (!stats.isDirectory()) {
      files.push(path);
    } else files.push(...(await walk(path)));
  }

  return files;
}
