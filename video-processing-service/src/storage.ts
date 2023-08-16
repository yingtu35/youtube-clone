import { Storage } from '@google-cloud/storage';
import fs from 'fs'; // ?
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage();

const rawVideoBucketName = 'yingtu-raw-videos';
const processedVideoBucketName = 'yingtu-processed-videos';

const localRawVideoPath = './raw-videos';
const localProcessedVideoPath = './processed-videos'

/**
 * Creates the local directories for raw and processed videos.
 */
export const setupDirectories = () => {
  ensureDirectoryExistence(localRawVideoPath);
  ensureDirectoryExistence(localProcessedVideoPath);
}

/**
 * @param fileName - The name of the file to download from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export const downloadRawVideo = async (fileName: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const options = {
      destination: `${localRawVideoPath}/${fileName}`
    };
    try {
      await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download(options)
    
      console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
      );
      resolve()
    } catch (err) {
      console.error(`Failed to download from gs://${rawVideoBucketName}/${fileName}`);
      reject(err);
    }
  })

}

// Process the video and save it in local directories
export const processRawVideo = (rawVideoName: string, processedVideoName: string): Promise<void> => {
  const inputFilePath = `${localRawVideoPath}/${rawVideoName}`;
  const outputFilePath = `${localProcessedVideoPath}/${processedVideoName}`
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
    // -vf indicates video file, scale is to rescale the video
    .outputOptions(['-vf', 'scale=-1:360'])
    .on('end', () => {
      console.log('Processing video finished');
      resolve();
    })
    .on('error', (error) => {
      console.log(`Internal server error: ${error.message}`)
      reject();
    })
    .save(outputFilePath);
  })
}
// upload video back to Google Cloud Storage
export const uploadProcessedVideo = async (fileName: string): Promise<void> => {
  return new Promise(async(resolve, reject) => {
    const options = {
      destination: fileName,
    };
  
    try {
      await storage.bucket(processedVideoBucketName).upload(`${localProcessedVideoPath}/${fileName}`, options);
      console.log(`${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}`);
    
      // Set the video to be public readable
      await storage.bucket(processedVideoBucketName).file(fileName).makePublic();
      console.log(`gs://${processedVideoBucketName}/${fileName} is now public.`);
      resolve();
    } catch (err) {
      console.error(`Failed to upload to gs://${processedVideoBucketName}/${fileName}`);
      reject(err);
    }
  })
}

// delete local video
export const deleteRawVideo = (fileName: string) => {
  return deletefile(`${localRawVideoPath}/${fileName}`);
}

export const deleteProcessedVideo = (fileName: string) => {
  return deletefile(`${localProcessedVideoPath}/${fileName}`);
}

// helper function
const deletefile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      console.log(`file ${filePath} not found`);
      resolve();
    }

    try {
      fs.unlinkSync(filePath);
      console.log(`successfully delete ${filePath}`);
      resolve();
    } catch (err) {
      console.error(`Failed to delete file at ${filePath}`, err);
      reject(err);
    }
  })
}

const ensureDirectoryExistence = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    const path = fs.mkdirSync(dirPath, { recursive: true }); // recursive enables nested directories
    if (!path) {
      console.log(`Failed to create directory at ${dirPath}`);
    }
    console.log(`Directory created at ${dirPath}`);
  }
}