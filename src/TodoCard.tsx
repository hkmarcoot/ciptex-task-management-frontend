import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "@hello-pangea/dnd";
import { XCircleIcon } from "@heroicons/react/24/solid";

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
};

export default function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  return (
    <div
      className="bg-blue-200 rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-4">
        <p>{todo.title}</p>
        <button className="text-pink-600 hover:text-pink-700">
          <XCircleIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
