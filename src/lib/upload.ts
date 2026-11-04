export async function uploadToImgbb(file: File): Promise<string> {
  const apiKey = "46db9b678fc5c74f3bcb4cc3c2487ffb";

  // 1. Use the base endpoint without the key in the path
  const url = new URL("https://api.imgbb.com/1/upload");

  // 2. Append the API key as a proper query parameter
  url.searchParams.append("key", apiKey);

  const fd = new FormData();
  fd.append("image", file, file.name);

  const res = await fetch(url.toString(), {
    method: "POST",
    body: fd,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || "Image upload failed");
  }

  return json.data.url;
}