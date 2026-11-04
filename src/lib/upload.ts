export async function uploadToImgbb(file: File): Promise<string> {
  const apiKey = "YOUR_NEW_32_CHARACTER_API_KEY";

  // Check the value inside the deployed JavaScript
  alert(
    `Runtime API key length: ${apiKey.length}\n` +
    `First 4 characters: ${apiKey.slice(0, 4)}`
  );

  const url = new URL("https://api.imgbb.com/1/upload");
  url.searchParams.set("key", apiKey.trim());

  alert(
    `Request API key length: ${url.searchParams.get("key")?.length}`
  );

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