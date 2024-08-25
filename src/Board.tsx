// import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import Column from "./Column";

type dndItemsObject = {
  itemId: string;
  title: string;
  status: string;
};

export default function Board({
  dnditems,
}: {
  dnditems: Array<Array<dndItemsObject>>;
}) {
  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    console.log(destination);
    console.log(source);
    console.log(type);
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
