// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import React, { useEffect, useState } from "react";
import Testing from "./Testing";
import Sockette from "sockette";

function App() {
  const [message, setMessage] = useState("");
  const [dnditems, setDndItems] = useState([]);
  const [startnget, setStartnget] = useState(false);

  const ws = new Sockette(
    "wss://144lhasnn9.execute-api.eu-north-1.amazonaws.com/production/",
    {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: (e) => {
        console.log("Connected!", e);
      },
      onmessage: (e) => {
        console.log("Received:", e);
        if (e.data !== "") {
          setMessage(e.data);
        }
      },
      onreconnect: (e) => console.log("Reconnecting...", e),
      onmaximum: (e) => console.log("Stop Attempting!", e),
      onclose: (e) => console.log("Closed!", e),
      onerror: (e) => console.log("Error:", e),
    }
  );

  useEffect(() => {
    if (startnget) {
      if (message && JSON.parse(message).response) {
        setDndItems(JSON.parse(message).response.Items);
        setStartnget(false);
      }
    }
  }, [message, startnget]);

  useEffect(() => {
    if (message && JSON.parse(message).Items) {
      setDndItems(JSON.parse(message).Items);
    }
  }, [message]);

  if (message && JSON.parse(message).response) {
    console.log("Items: ", JSON.parse(message).response.Items);
  }
  console.log("dndItems: " + JSON.stringify(dnditems));

  return (
    <>
      <div>
        <p className="text-red-500">Hello world</p>
        <button
          onClick={() => ws.send(JSON.stringify({ action: "test" }))}
          type="button"
          className="border border-red-500"
        >
          Click & Test
        </button>
        <button
          onClick={() => ws.send(JSON.stringify({ action: "scanEntireTable" }))}
          type="button"
          className="border border-red-500 ml-4"
        >
          Click & Get
        </button>
        <button
          onClick={() =>
            ws.send(
              JSON.stringify({
                action: "createItem",
                title: "New task from frontend",
                status: "todo",
              })
            )
          }
          type="button"
          className="border border-red-500 ml-4"
        >
          Click & Create
        </button>
        <button
          onClick={() =>
            ws.send(
              JSON.stringify({
                action: "updateStatus",
                itemId: "thisispartitionkey",
                status: "todo",
              })
            )
          }
          type="button"
          className="border border-red-500 ml-4"
        >
          Click & Update
        </button>
        <Testing />
        <button
          onClick={() => {
            ws.send(JSON.stringify({ action: "scanEntireTable" }));
            setStartnget(true);
          }}
          type="button"
          className="border border-red-500 ml-4"
        >
          Start The Task Management App
        </button>
        <p>{message}</p>
        <br />
        <div></div>
      </div>
    </>
  );
}

export default App;
