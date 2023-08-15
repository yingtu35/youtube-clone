import express from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express();
app.use(express.json());

app.post('/video', (req, res) => {
  console.log(req.body);
  const { inputFilePath, outputFilePath } = req.body;

  if (!inputFilePath || !outputFilePath) {
    res.status(404).send('File path not found');
  }
  ffmpeg(inputFilePath)
  // -vf indicates video file, scale is to rescale the video
  .outputOptions(['-vf', 'scale=-1:360'])
  .on('end', () => {
    console.log('Processing video finished');
    res.status(200).send('Processing video finished');
  })
  .on('error', (error) => {
    console.log(`Internal server error: ${error.message}`)
    res.status(500).send(`Internal server error: ${error.message}`);
  })
  .save(outputFilePath);
})

app.get('/', (req, res) => {
  res.send('Hello World');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
});