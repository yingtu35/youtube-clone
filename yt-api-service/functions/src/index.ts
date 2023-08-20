import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import {onCall} from "firebase-functions/v2/https";

import {Storage} from "@google-cloud/storage";

initializeApp();

const storage = new Storage();
const rawVideoBucketName = "yingtu-raw-videos";

const firestore = new Firestore();

const videoCollectionId = "videos";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const createUser = functions.auth.user().onCreate(async (user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoURL: user.photoURL,
  };
  logger.info("Creating user document", user.uid);
  await firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User document created: ${JSON.stringify(userInfo)}`);
});

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "User is not authenticated."
    );
  }

  const uid = request.auth.uid;
  const data = request.data;
  const bucket = storage.bucket(rawVideoBucketName);
  // we have to know the file extension to set the correct content type
  const fileName = `${uid}-${Date.now()}.${data.fileExtension}`;

  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  return {url, fileName};
});

// TODO: add filter to filter out processing videos
// TODO: add pagination or infinite scroll
export const getVideos = onCall({maxInstances: 1}, async () => {
  // no need to check if user is authenticated
  // because unauthenticated users can also view videos
  const querySnapshot =
    await firestore.collection(videoCollectionId).limit(10).get();
  const videos = querySnapshot.docs.map((snapshot) => snapshot.data());
  return videos;
});
