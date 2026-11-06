export async function uploadAction(file: File): Promise<string> {
    const cloudName = "dwdmomytl"; 
    const uploadPreset = "studio";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.secure_url) {
        console.error("Cloudinary Error:", result);
        throw new Error(result.error?.message || "Cloudinary image upload failed");
    }

    return result.secure_url;
}