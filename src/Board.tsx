// import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import Column from "./Column";
import Sockette from "sockette";

type dndItemsObject = {
  itemId: string;
  title: string;
  status: string;
};

export default function Board({
  dnditems,
  ws,
}: {
  dnditems: Array<Array<dndItemsObject>>;
  ws: Sockette;
}) {
  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    let newStatus = "";
    let getItemId = "";

    if (!destination) return;

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

    ws.send(
      JSON.stringify({
        action: "updateStatus",
        itemId: getItemId,
        status: newStatus,
      })
    );
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
            <Column id="todo" todos={dnditems[0]} index={0} />
            <Column id="inprogress" todos={dnditems[1]} index={1} />
            <Column id="done" todos={dnditems[2]} index={2} />

            {/* Provide space when drag and drop */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
