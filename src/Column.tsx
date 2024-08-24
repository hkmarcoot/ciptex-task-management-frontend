import React from "react";
// import { Draggable, Droppable } from "react-beautiful-dnd";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import TodoCard from "./TodoCard";

type dndItemsObject = {
  itemId: string;
  title: string;
  status: string;
};

type Props = {
  id: string;
  todos: dndItemsObject[];
  index: number;
};

export default function Column({ id, todos, index }: Props) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Droppable droppableId={index.toString()} type="card">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="p-2 rounded-2xl shadow-sm bg-gray-200"
              >
                <h1 className="flex flex-row justify-center">
                  {id} <span className="pl-2">{todos.length}</span>
                </h1>

                <div className="space-y-2">
                  {todos.map((todo, index) => (
                    <Draggable
                      key={todo.itemId}
                      draggableId={todo.itemId}
                      index={index}
                    >
                      {(provided) => (
                        <TodoCard
                          todo={todo}
                          index={index}
                          id={id}
                          innerRef={provided.innerRef}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}

                  {/* Provide space when drag and drop */}
                  {provided.placeholder}

                  <div className="flex items-end justify-end p-4">
                    <button className="text-green-600 hover:text-green-700">
                      <PlusCircleIcon className="h-12 w-12" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
