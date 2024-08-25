// import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import Column from "./Column";
import Sockette from "sockette";
import React from "react";

type dndItemsObject = {
  itemId: string;
  title: string;
  status: string;
};

export default function Board({
  dnditems,
  ws,
  setDndItems,
}: {
  dnditems: Array<Array<dndItemsObject>>;
  ws: Sockette;
  setDndItems: React.Dispatch<React.SetStateAction<dndItemsObject[][]>>;
}) {
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

    // if (type == "card") {
    ws.send(
      JSON.stringify({
        action: "updateStatus",
        itemId: getItemId,
        status: newStatus,
      })
    );
    // }

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
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {/* <Column key="0" id="0" todos={dnditems[0]} index="0" /> */}
            <Column id="todo" todos={dnditems[0]} index={0} ws={ws} />
            <Column id="inprogress" todos={dnditems[1]} index={1} ws={ws} />
            <Column id="done" todos={dnditems[2]} index={2} ws={ws} />

            {/* Provide space when drag and drop */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
