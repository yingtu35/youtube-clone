# Use node: 18 as the base image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Run the command to install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the dependencies in the conatiner
RUN npm install

# Copy app source code to the container
COPY . .

# Define the command to run your app using CMD (only one CMD allowed)
CMD [ "npm", "start" ]