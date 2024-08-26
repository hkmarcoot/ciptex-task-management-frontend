# ciptex-task-management-frontend

Here is my journey to create a React, TypeScript, Tailwind CSS and Vite project with Sockette websocket and Atlassian Drag and Drop Library.

1. [Initialize React Typescript Tailwind Vite Project](#initialize-react-typescript-tailwind-vite-project)

2. [Use Sockette and Test](#use-sockette-and-test)

3. [Prepare To Use Atlassian Drag And Drop Library](#prepare-to-use-atlassian-drag-and-drop-library)

4. [Use The Atlassian Drag And Drop Library](#use-the-atlassian-drag-and-drop-library)

5. [Switch To hello-pangea's Drag And Drop Library](#switch-to-hello-pangeas-drag-and-drop-library)

6. [Testing: Sync In Other Terminal and Browser](#testing-sync-in-other-terminal-and-browser)

7. [Sort Items Alphabetically Base On Their Title](#sort-items-alphabetically-base-on-their-title)

8. [Sync Updated Items](#sync-updated-items)

9. [Using useEffect And useState To Manage Websocket](#using-useeffect-and-usestate-to-manage-websocket)

10. [Do Nothing When Item Drag And Drop To Nowhere](#do-nothing-when-item-drag-and-drop-to-nowhere)

11. [Do Nothing When Item Drag And Drop Back To The Same Position](#do-nothing-when-item-drag-and-drop-back-to-the-same-position)

12. [Limit Change Can Only Be Made To Item Card But Not Column](#limit-change-can-only-be-made-to-item-card-but-not-column)

13. [Create Modal Window And Dropdown List](#create-modal-window-and-dropdown-list)

14. [Type of Set State](#type-of-set-state)

15. [Algorithm To Update Items On The Client Side](#algorithm-to-update-items-on-the-client-side)

## Initialize React Typescript Tailwind Vite Project

I create and initialize the project by follow this guide: [How to setup React, TypeScript, and Tailwind CSS with Vite in a Project](https://medium.com/@pushpendrapal_/how-to-setup-react-typescript-and-tailwind-css-with-vite-in-a-project-8d9b0b51d1bd).

## Use Sockette and Test

Sockette is a package that simplify using the websocket from the frontend.

The sockette can be found here: [GitHub- sockette](https://github.com/lukeed/sockette)

After a few trials, the frontend can fetch data from AWS WebSocket API. I got this reply after sending { action: "scanEntireTable" } to the api:

```
{"message":"Items scanned","response":{"$metadata":{"httpStatusCode":200,"requestId":"1UVNFTAQCUB3BUM72C5J6C4UINVV4KQNSO5AEMVJF66Q9ASUAAJG","attempts":1,"totalRetryDelay":0},"Count":4,"Items":[{"itemId":"thisispartitionkey","status":"todo","title":"This is the first task created in platform"},{"itemId":"6c2118bd-515b-4d05-a351-2dbac6e2d454","status":"todo","title":"New task from frontend"},{"itemId":"7085b41f-154d-4745-9556-06ce75dd8df4","status":"inprogress","title":"This is the first task from terminal"},{"itemId":"9ddb80ff-6618-4874-a351-eed8466320ea","status":"todo","title":"New task from frontend"}],"ScannedCount":4}}
```

I also found out the backend will reply a message immediately back to the browser when createItem, updateStatus and deleteItem.

Then, I discovered the browser will not delete unused connectionId in the DynamoDB. Hence, it will create an internal server error when the connectionId no longer exists.

I found out data cannot be fetched from WebSocket API immediately after the Sockette is connected to the API. As a reason, I create a "Start The Application" button to initialize the app. i.e. get data from the API.

Three useStates are used to save states:

```
const [message, setMessage] = useState("");
  const [dnditems, setDndItems] = useState<Array<Array<dndItemsObject>>>([
    [],
    [],
    [],
  ]);
  const [startnget, setStartnget] = useState(false);
```

The "Start The Application" button will set startnget state to be true:

```
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
```

The following useEffect is used to get data when "Start The Application" button is clicked:

```
  useEffect(() => {
    if (startnget) {
      if (message && JSON.parse(message).response) {
        const input = separateItems(JSON.parse(message).response.Items);
        setDndItems(input);
        setStartnget(false);
      }
    }
  }, [message, startnget]);
```

## Prepare To Use Atlassian Drag And Drop Library

I create "Click & Create" and "Click & Update" buttons to send websocket create item and update status requests.

```
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
```

And save the fetched data into dnditems state when the buttons are clicked using useEffect.

```
useEffect(() => {
    if (message && JSON.parse(message).Items) {
      const input = separateItems(JSON.parse(message).Items);
      setDndItems(input);
    }
  }, [message]);
```

I create separateItems function to put items in different status into their own categories. The return is an array of array of objects.

```
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
    return [arrTodo, arrInprogress, arrDone];
  }
```

I also solve a typescript error 'type is not assignable to type intrinsicattributes' with this guide: [Type X is not assignable to type IntrinsicAttributes](https://www.reddit.com/r/reactjs/comments/oq1rtp/type_authors_author_is_not_assignable_to_type/).

## Use The Atlassian Drag And Drop Library

The Atlassian drag and drop library can be found here: [GitHub - Atlassian DnD Library](https://github.com/atlassian/react-beautiful-dnd).

I followed this tutorial to setup the columns and todos: [Let’s build TRELLO Clone with REACT! (Next.js 13.4, GPT-4, Drag & Drop, Zustand, Appwrite Cloud)](https://www.youtube.com/watch?v=TI2AvfCj5oM). The tutorial has many more advanced topics, but I only included what I needed in my project.

The drag-and-drop board can display items correctly from the data fetching from the WebSocket API after I put work on it. The original tutorial uses a Map object to set things up, but I use an array of array of objects to simplify the work.

## Switch To hello-pangea's Drag And Drop Library

After the data can be displayed on the drag-and-drop board, I tried to drag the items. However, it gives a warning: unable to find draggable with id with react-beautiful-dnd. I search the solution online and find out a user suggests switching the library to [GitHub - hello-pangea DnD Library](https://github.com/hello-pangea/dnd). I use it, and the warning is gone. Now, the items can be dragged on the board.

I encounter an error message: placeholder could not be found. The solution can be found from this post: [react-beautiful-dnd - DroppableProvided > placeholder could not be found. - how to fix?](https://stackoverflow.com/questions/58802602/react-beautiful-dnd-droppableprovided-placeholder-could-not-be-found-how). In short, the solution is to put {provided.placeholder} as a child of droppable.

## Testing: Sync In Other Terminal and Browser

The test is to create an item in the terminal and observe if the web app will update. The test is passed.

## Sort Items Alphabetically Base On Their Title

I concern whether the items in a column have the same order as in the other browser window. As a result, I improve the separateItems function:

```
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
```

This sorting method is from the [FreeCodeCamp Guide](https://www.freecodecamp.org/news/how-to-sort-alphabetically-in-javascript/).

## Sync Updated Items

The updated items status will be send to API after the drag and drop ends. This is completed by the handleOnDragEnd function in Board.tsx.

```
const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    let newStatus = "";
    let getItemId = "";
    let getItemTitle = "";
    let newdnditems = dnditems;

    // Case if user drag the item to nowhere
    if (!destination) return;
    // Case if user drag the item back to the same position
    if (
      source.index == destination.index &&
      source.droppableId == destination.droppableId
    )
      return;
    // Case if user drag the column
    if (type == "column") return;

    console.log(destination);
    console.log(source);
    console.log(type);

    if (destination.droppableId == "0") {
      newStatus = "todo";
    } else if (destination.droppableId == "1") {
      newStatus = "inprogress";
    } else if (destination.droppableId == "2") {
      newStatus = "done";
    }

    getItemId = dnditems[Number(source.droppableId)][source.index].itemId;

    // Send out updated data only if the drag and drop item is card but not column
    // Notes: Case is handled above in checking if type == "column"

    ws.send(
      JSON.stringify({
        action: "updateStatus",
        itemId: getItemId,
        status: newStatus,
      })
    );
    ...
}
```

In the meantime, the updated items will be showing to other clients i.e. terminal or web app.

## Using useEffect And useState To Manage Websocket

I find out the Sockette will create a lot of connection when running the web app, hence I decided to solve it by trying to use useEffect and useState to save Sockette element into a state:

```
const [ws, setWs] = useState<Sockette>(new Sockette(""));
...
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
```

The web app will now not creating too many connection with the WebSocket API.

## Do Nothing When Item Drag And Drop To Nowhere

Refering back to handleOnDragEnd function, I added the line

```
if (!destination) return;
```

to stop the function from responding when a user drags and drops an item to nowhere.

## Do Nothing When Item Drag And Drop Back To The Same Position

Refering back to handleOnDragEnd function, I added the line

```
if (
      source.index == destination.index &&
      source.droppableId == destination.droppableId
    )
      return;
```

to stop the function from responding when a user drags and drops an item back to the same position.

## Limit Change Can Only Be Made To Item Card But Not Column

Refering back to handleOnDragEnd function, I added the line

```
if (type == "column") return;
```

to stop the function from responding when a user drags and drops the columns.

## Create Modal Window And Dropdown List

A pop-up window is created so that when the user clicks on the plus icon, it will show up and allow the user to input the title and select a status from a dropdown list to create a new todo.

## Type of Set State

I follow this guide [How Can I Define Type For setState](https://stackoverflow.com/questions/65823778/how-can-i-define-type-for-setstate-when-react-dispatchreact-setstateactionstri) to fix a TypeScript warning.

```
export default function Board({
  dnditems,
  ws,
  setDndItems,
}: {
  dnditems: Array<Array<dndItemsObject>>;
  ws: Sockette;
  setDndItems: React.Dispatch<React.SetStateAction<dndItemsObject[][]>>;
}) {
  ...
}
```

setDndItems is the set state needed to define its type. I used `React.Dispatch<React.SetStateAction<dndItemsObject[][]>>` to fix the warning.

## Algorithm To Update Items On The Client Side

An algorithm is created to update items on the client side so that there is no delay in the browser waiting to fetch updated data from the API.

```
const handleOnDragEnd = (result: DropResult) => {
  ...
    // Below will use set state to update the dnditems
    // to avoid delay from fetching from the WebSocket API
    getItemTitle = dnditems[Number(source.droppableId)][source.index].title;

    // Remove the item in source location
    newdnditems = newdnditems.map((inArr) =>
      inArr.filter((item) => item.itemId !== getItemId)
    );

    const itemToBeAdd = {
      itemId: getItemId,
      title: getItemTitle,
      status: newStatus,
    };

    // Add new item to the new destination
    newdnditems[Number(destination.droppableId)].push(itemToBeAdd);

    // Sort the items alphabetically
    newdnditems = newdnditems.map((inArr) =>
      inArr.sort(function (a, b) {
        if (a.title < b.title) {
          return -1;
        } else if (a.title > b.title) {
          return 1;
        }
        return 0;
      })
    );

    // Set state
    setDndItems(newdnditems);
    // Use set state to update the dnditems - end
}
```

Here, a combination of map, filter, sort and push method are used to create the algorithm.

This algorithm is inspired from this tutorial: [How to Remove Multiple Objects from Nested Array of Objects in JavaScript](https://www.geeksforgeeks.org/how-to-remove-multiple-objects-from-nested-array-of-objects-in-javascript/).
