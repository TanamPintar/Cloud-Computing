import fs from "fs";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: "projectname",
  keyFilename: "./tanam-pintar-bucket.json",
});

export const uploadImageToBucket = async (
  bucketName,
  folderName,
  imageFile,
  imageName,
) => {
  const tempPath = `${imageFile}`;
  try {
    // Uploading Image to Buckets
    const bucket = storage.bucket(bucketName);
    const destFileName = `${folderName}/${imageName}.jpg`;

    console.log(tempPath);

    await bucket.upload(tempPath, {
      destination: destFileName,
    });

    console.log("Here 1");

    fs.unlinkSync(tempPath);

    const uploadedFile = bucket.file(destFileName);
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uploadedFile.name}`;

    return {
      status: "success",
      data: {
        image_url: publicUrl,
      },
    };
  } catch (error) {
    fs.unlinkSync(tempPath);
    return {
      status: "failed",
      message: error.message,
    };
  }
};
