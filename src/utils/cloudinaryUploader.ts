export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "default_apartments_upload"); // Make sure this is your unsigned preset name

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/djgqgpgjb/image/upload", {
      method: "POST",
      body: data,
    });

    const cloudinaryData = await res.json();

    if (cloudinaryData.secure_url) {
      return cloudinaryData.secure_url;
    } else {
      console.error("Cloudinary upload error", cloudinaryData);
      return null;
    }
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
};
