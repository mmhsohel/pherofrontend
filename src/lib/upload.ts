
export async function uploadToImgbb(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_PUBLIC_KEY;

  if (!apiKey) {
    throw new Error("ImgBB API key is missing");
  }

  if (!file || file.size === 0) {
    throw new Error("Please select a valid image");
  }

  const fd = new FormData();
  fd.append("image", file, file.name);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    {
      method: "POST",
      body: fd,
    }
  );

  const json = await res.json();

  if (!res.ok || !json.success) {
    console.error("ImgBB error:", json);

    throw new Error(
      json.error?.message || "Image upload failed"
    );
  }

  return json.data.url;
}
