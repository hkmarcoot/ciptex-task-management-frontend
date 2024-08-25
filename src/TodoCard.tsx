import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "@hello-pangea/dnd";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Sockette from "sockette";

type dndItemsObject = {
  itemId: string;
  title: string;
  status: string;
};

type Props = {
  todo: dndItemsObject;
  index: number;
  id: string;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  ws: Sockette;
};

export default function TodoCard({
  todo,
  // index,
  // id,
  innerRef,
  draggableProps,
  dragHandleProps,
  ws,
}: Props) {
  function deleteCard(itemId: string) {
    ws.send(
      JSON.stringify({
        action: "deleteItem",
        itemId: itemId,
      })
    );
  }

  return (
    <div
      className="bg-blue-200 rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-4">
        <p>{todo.title}</p>
        <button
          className="text-pink-600 hover:text-pink-700"
          onClick={() => deleteCard(todo.itemId)}
        >
          <XCircleIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
