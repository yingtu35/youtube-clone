import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import {
  setupDirectories,
  downloadRawVideo,
  processRawVideo,
  uploadProcessedVideo,
  deleteRawVideo,
  deleteProcessedVideo,
} from './storage';

setupDirectories();

const app = express();
app.use(express.json());

// Process a video file from Cloud Storage into 360p
app.post('/video', async (req, res) => {
  // Get the bucket and fileName from Cloud pub/sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message)
    if (!data.name) {
      throw new Error('Invalid message payload received.');
    }
  } 
  catch (err) {
    console.error(err);
    res.status(400).send('Bad Request: missing filename.');
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  try {
    await downloadRawVideo(inputFileName);
  } catch (err) {
    await deleteRawVideo(inputFileName);
    res.status(500).send('Processing Failed');
  }

  try {
    await processRawVideo(inputFileName, outputFileName);
  } catch (err) {
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ])
    res.status(500).send('Processing failed');
  }
  try {
    await uploadProcessedVideo(outputFileName);
  } catch (err) {
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ])
    res.status(500).send('processing failed');
  }

  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
  ])

  res.status(200).send(`Processing video successfully`);
})

// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
});