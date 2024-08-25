// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import React, { useEffect, useState } from "react";
import Sockette from "sockette";
import Board from "./Board";

function App() {
  const [message, setMessage] = useState("");
  const [dnditems, setDndItems] = useState<Array<Array<dndItemsObject>>>([
    [],
    [],
    [],
  ]);
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
        const input = separateItems(JSON.parse(message).response.Items);
        setDndItems(input);
        setStartnget(false);
      }
    }
  }, [message, startnget]);

  useEffect(() => {
    if (message && JSON.parse(message).Items) {
      const input = separateItems(JSON.parse(message).Items);
      setDndItems(input);
    }
  }, [message]);

  type dndItemsObject = {
    itemId: string;
    title: string;
    status: string;
  };

  function separateItems(arr: Array<dndItemsObject>) {
    const arrTodo = [];
    const arrInprogress = [];
    const arrDone = [];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].status == "todo") {
        arrTodo.push(arr[i]);
      } else if (arr[i].status == "inprogress") {
        arrInprogress.push(arr[i]);
      } else if (arr[i].status == "done") {
        arrDone.push(arr[i]);
      }
    }

    // Sort the items alphabetically
    const sortedArrTodo = arrTodo.sort(function (a, b) {
      if (a.title < b.title) {
        return -1;
      } else if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

    const sortedArrInprogress = arrInprogress.sort(function (a, b) {
      if (a.title < b.title) {
        return -1;
      } else if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

    const sortedArrDone = arrDone.sort(function (a, b) {
      if (a.title < b.title) {
        return -1;
      } else if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

    return [sortedArrTodo, sortedArrInprogress, sortedArrDone];
  }

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
        <br />
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
        {dnditems && message && <Board dnditems={dnditems} />}
      </div>
    </>
  );
}

export default App;
