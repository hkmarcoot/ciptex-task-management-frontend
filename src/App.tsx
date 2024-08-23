// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import Testing from "./Testing";
import Sockette from "sockette";

function App() {
  const ws = new Sockette(
    "wss://144lhasnn9.execute-api.eu-north-1.amazonaws.com/production/",
    {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: (e) => console.log("Connected!", e),
      onmessage: (e) => console.log("Received:", e),
      onreconnect: (e) => console.log("Reconnecting...", e),
      onmaximum: (e) => console.log("Stop Attempting!", e),
      onclose: (e) => console.log("Closed!", e),
      onerror: (e) => console.log("Error:", e),
    }
  );

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
        <Testing />
      </div>
    </>
  );
}

export default App;
