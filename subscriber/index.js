import { StreamrClient } from "streamr-client";
import GUN from "gun";
import CryptoJs from "crypto-js";

const streamr = new StreamrClient();
const db = GUN();

const getFile = (address, encKey) => {
  return new Promise((resolve, reject) => {
    db.get("junction")
      .get("test")
      .get(address)
      .once(
        (data, key) => {
          const decrypt = CryptoJs.AES.decrypt(data, encKey);
          const text = decrypt.toString(CryptoJs.enc.Utf8);

          resolve(text);
        },
        { wait: 1000 }
      );
  });
};

const streamId = "0xbf259938539458f01d224d09c29d30babc701709/resourced";

streamr.subscribe(streamId, async (message) => {
  for (const resource of message.data) {
    const data = await getFile(resource.address, resource.key);
    console.log(data);
  }

  console.log();
});
