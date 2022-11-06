import { StreamrClient } from "streamr-client";
import { readFile, writeFile } from "node:fs";
import * as dotenv from "dotenv";
dotenv.config();

const STREAM_ID = "0xbf259938539458f01d224d09c29d30babc701709/resourced";
let resources = [];

// Read resources from json file
const resourceFile = "./resources.json";
readFile(resourceFile, (err, data) => {
  resources = JSON.parse(data);
});

const streamrClient = new StreamrClient({
  auth: {
    privateKey: process.env.WALLET_KEY,
  },
});

function addResourceIfNotExists(newResource) {
  if (!resources.find(resource => resource.address === newResource.address)) {
    resources.push(newResource);
  }
}

function saveResources() {
  writeFile(resourceFile, JSON.stringify(resources), (err) => {
    console.error(err);
  });
}

// Subscribe to a stream
streamrClient.subscribe(
  STREAM_ID,
  (message) => {
    // This function will be called when new messages occur
    message.data.forEach((publishedResource) => {
      addResourceIfNotExists(publishedResource);
    });
    saveResources();
  }
);

setInterval(async () => {
  try {
    await streamrClient.publish(STREAM_ID, { data: resources });
  } catch (error) {
    console.error(error);
  }
}, 1000);
