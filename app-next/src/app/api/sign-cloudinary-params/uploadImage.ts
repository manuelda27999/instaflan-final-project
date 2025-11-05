import cloudinary from "./cloudinary";

export async function uploadImage(imagePath: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "instaflan",
      transformation: [{ width: 1080, crop: "limit" }],
    });
    return result.secure_url;
  } catch (error) {
    throw new Error("Failed to upload image to Cloudinary.");
  }
}
