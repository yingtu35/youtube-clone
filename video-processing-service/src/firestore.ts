import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

initializeApp({ credential: credential.applicationDefault()});

const firestore = new Firestore();

const videoCollectionId = "videos";

export interface Video {
  id?: string;
  uid?: string;
  fileName?: string;
  title?: string;
  description?: string;
  status?: "processing" | "processed";
  date?: Date;
}

 const getVideo = async(videoId: string) => {
  const videoSnapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
  return (videoSnapshot.data() as Video) ?? {};
};

export const setVideo = (videoId: string, video: Video) => {
  // does not need to wait for the promise to resolve
  return firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .set(video, { merge: true});
};

export const isVideoNew = async(videoId: string) => {
  const video = await getVideo(videoId);
  return video?.status === undefined;
};