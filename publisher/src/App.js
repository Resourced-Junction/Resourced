import React, { useRef, useState } from "react";
import "./App.css";
import Gun from "gun";
import StreamrClient from "streamr-client";
import CryptoJs from "crypto-js";

const gun = Gun([
  "http://localhost:8765/gun",
  "https://gun-manhattan.herokuapp.com/gun",
]);

function App() {
  const ref = useRef(null);

  const [db] = useState(gun.get("junction").get("test"));
  const streamr = new StreamrClient({
    auth: {
      ethereum: window.ethereum,
    },
  });

  return (
    <div className="App">
      <input type="text" ref={ref} />
      <button
        onClick={() => {
          const randomString = (Math.random() + 1).toString(36).substring(7);
          const newEntry = db.get(randomString);
          console.log(randomString);
          const key = (Math.random() + 1).toString(36).substring(7);
          const encrypted = CryptoJs.AES.encrypt(
            ref.current.value,
            key
          ).toString();
          newEntry.put(encrypted);
          streamr.publish(
            "0xbf259938539458f01d224d09c29d30babc701709/resourced",
            {
              data: [{ address: randomString, key: key }],
            }
          );
        }}
      >
        publish
      </button>
    </div>
  );
}

export default App;

/*
          console.log(test);
          const decriptTest = CryptoJs.AES.decrypt(test, "test");

          console.log(decriptTest.toString(CryptoJs.enc.Utf8));
*/
