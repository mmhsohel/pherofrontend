export async function uploadToImgbb(file: File): Promise<string> {
    let a = new FormData();
    a.append("image", file);
    
    // Put your actual 32-character API key directly here if environment variables are failing
    const apiKey = "46db9b678fc5c74f3bcb4cc3c2487ffb"; 
    console.warn("ADD_STUDIO_UPLOAD_V3: Uploading to imgbb with API key:", apiKey);
    
    let t = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: a
    });
    
    let i = await t.json();
    if (!i.success) throw Error(i.error?.message || "Image upload failed");
    return i.data.url;
}