import React, { useRef, useState } from "react";
import "./App.css";
import Gun from "gun";
import StreamrClient from "streamr-client";

const gun = Gun([
  "http://localhost:8765/gun",
  "https://gun-manhattan.herokuapp.com/gun",
]);

function App() {
  const ref = useRef(null);

  const [db] = useState(gun.get("junction").get("test"));
  const streamr = new StreamrClient({
    auth: {
      privateKey:
        "6ae11887b579787ca910023ffcce549a52eae1bd9a4744a0911ed68dcd648478",
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
          newEntry.put(ref.current.value);
          streamr.publish(
            "0xbf259938539458f01d224d09c29d30babc701709/resourced",
            {
              data: [{ address: randomString, key: "" }],
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
