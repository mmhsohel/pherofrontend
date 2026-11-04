export async function uploadToImgbb(file: File): Promise<string> {
    console.warn("IMGBB_DIAGNOSTIC_V2: upload function called");

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_PUBLIC_KEY;

    console.warn("IMGBB_DIAGNOSTIC_V2:", {
        exists: Boolean(apiKey),
        length: apiKey?.length,
        firstFour: apiKey?.slice(0, 4),
        lastFour: apiKey?.slice(-4),
    });

    if (!apiKey) {
        throw new Error("ImgBB API key is missing");
    }

    if (!file || file.size === 0) {
        throw new Error("Please select a valid image");
    }

    const fd = new FormData();
    fd.append("image", file, file.name);

    const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey.trim())}`,
        {
            method: "POST",
            body: fd,
        }
    );

    const json = await res.json();

    if (!res.ok || !json.success) {
        console.error("IMGBB_DIAGNOSTIC_V2 ERROR:", json);
        throw new Error(json.error?.message || "Image upload failed");
    }

    return json.data.url;
}