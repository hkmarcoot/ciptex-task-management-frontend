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
  const [ws, setWs] = useState<Sockette>(new Sockette(""));
  const [connectStatus, setConnectStatus] = useState("Connecting...");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newWs = new Sockette(
      "wss://144lhasnn9.execute-api.eu-north-1.amazonaws.com/production/",
      {
        timeout: 5e3,
        maxAttempts: 10,
        onopen: (e) => {
          console.log("Connected!", e);
          setConnectStatus("Connected! Please Click The Button To Start.");
          setIsConnected(true);
        },
        onmessage: (e) => {
          console.log("Received:", e);
          if (e.data !== "") {
            setMessage(e.data);
          }
        },
        onreconnect: (e) => {
          console.log("Reconnecting...", e);
          setConnectStatus("Reconnecting...");
          setIsConnected(false);
        },
        onmaximum: (e) => console.log("Stop Attempting!", e),
        onclose: (e) => {
          console.log("Closed!", e);
          setConnectStatus("Closed!");
          setIsConnected(false);
        },
        onerror: (e) => console.log("Error:", e),
      }
    );
    setWs(newWs);
  }, []);

  // const ws = new Sockette(
  //   "wss://144lhasnn9.execute-api.eu-north-1.amazonaws.com/production/",
  //   {
  //     timeout: 5e3,
  //     maxAttempts: 10,
  //     onopen: (e) => {
  //       console.log("Connected!", e);
  //     },
  //     onmessage: (e) => {
  //       console.log("Received:", e);
  //       if (e.data !== "") {
  //         setMessage(e.data);
  //       }
  //     },
  //     onreconnect: (e) => console.log("Reconnecting...", e),
  //     onmaximum: (e) => console.log("Stop Attempting!", e),
  //     onclose: (e) => console.log("Closed!", e),
  //     onerror: (e) => console.log("Error:", e),
  //   }
  // );

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
    // Sorting end

    return [sortedArrTodo, sortedArrInprogress, sortedArrDone];
  }

  if (message && JSON.parse(message).response) {
    console.log("Items: ", JSON.parse(message).response.Items);
  }
  console.log("dndItems: " + JSON.stringify(dnditems));

  return (
    <>
      <div className="h-screen bg-gradient-to-tr from-green-100 to-white">
        <div className="flex flex-col justify-center items-center">
          <p className="text-xl mt-6 underline decoration-teal-700">
            Welcome To The Task Management App
          </p>
          <p>{connectStatus}</p>
          {isConnected ? (
            <button
              onClick={() => {
                ws.send(JSON.stringify({ action: "scanEntireTable" }));
                setStartnget(true);
              }}
              type="button"
              className="border border-red-500 px-2 mt-2 mb-4 hover:border-green-500 bg-white"
            >
              Start The Application
            </button>
          ) : (
            <></>
          )}
        </div>
        {dnditems && message && (
          <Board dnditems={dnditems} ws={ws} setDndItems={setDndItems} />
        )}
      </div>
    </>
  );
}

export default App;
