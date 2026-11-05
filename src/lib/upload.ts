// app/actions/upload.ts
"use server";

export async function uploadAction(formData: FormData) {
    const file = formData.get("image") as File;
    if (!file) throw new Error("No file provided");

    const imgbbData = new FormData();
    imgbbData.append("image", file);

    const apiKey = "46db9b678fc5c74f3bcb4cc3c2487ffb";

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: imgbbData,
    });

    const result = await response.json();
    if (!result.success) {
        throw new Error(result.error?.message || "Upload failed");
    }

    return result.data.url;
}