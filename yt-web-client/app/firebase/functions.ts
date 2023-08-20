import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
const getVideos = httpsCallable(functions, "getVideos");

/**
 * The function `uploadVideo` uploads a video file to a server by generating a pre-signed URL and using
 * it to make a PUT request with the file as the request body.
 * @param {File} file - The `file` parameter is of type `File`, which represents a file selected by the
 * user through an input element of type "file". It contains information about the selected file, such
 * as its name, size, and type.
 * @returns The function `uploadVideo` returns the result of the fetch request.
 */

export interface Video {
  id?: string;
  uid?: string;
  fileName?: string;
  title?: string;
  description?: string;
  status?: "processing" | "processed";
  date?: Date;
}

export const uploadVideo = async (file: File) => {
  const fileExtension = file.name.split(".").pop();
  const response: any = await generateUploadUrl({ fileExtension });
  const result = await fetch(response?.data?.url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
  return result;
}

export const getAllVideos = async () => {
  const response = await getVideos();
  return response.data as Video[];
};