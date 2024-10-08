import React, { useState } from "react";
// import { Draggable, Droppable } from "react-beautiful-dnd";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { XCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import TodoCard from "./TodoCard";
import Sockette from "sockette";
import "./Card.css";

type dndItemsObject = {
  itemId: string;
  title: string;
  status: string;
};

type Props = {
  id: string;
  todos: dndItemsObject[];
  index: number;
  ws: Sockette;
};

export default function Column({ id, todos, index, ws }: Props) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [alert, setAlert] = useState("");
  const options = [
    { value: "", label: "-- Please Select --" },
    { value: "todo", label: "To Do" },
    { value: "inprogress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  function createCard() {
    if (inputTitle && selectedValue) {
      ws.send(
        JSON.stringify({
          action: "createItem",
          title: inputTitle,
          status: selectedValue,
        })
      );
      setAlert("");
      setSelectedValue("");
      setInputTitle("");
      setIsOpenModal(false);
    } else {
      setAlert("Alert: Title And Status Cannot Be Empty!");
    }
  }

  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Droppable droppableId={index.toString()} type="card">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`p-2 rounded-2xl shadow-sm border-b-4 border-teal-700 ${
                    snapshot.isDraggingOver ? "bg-pink-100" : "bg-teal-100"
                  }`}
                >
                  <h1 className="flex flex-row justify-center text-lg">
                    <span className="">{id}</span>{" "}
                    <span className="pl-2">{todos.length}</span>
                  </h1>

                  <div className="space-y-2 mt-2">
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
                            ws={ws}
                          />
                        )}
                      </Draggable>
                    ))}

                    {/* Provide space when drag and drop */}
                    {provided.placeholder}

                    <div className="flex items-end justify-end p-4">
                      <button
                        className="text-green-600 hover:text-green-700"
                        onClick={() => setIsOpenModal(true)}
                      >
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
      {isOpenModal ? (
        <div className="window-modal">
          <div className="data-card-edit flex flex-col justify-center items-center">
            <h2 className="text-2xl">Add New Todo</h2>
            <input
              className="w-4/5 min-w-[200px] h-10 border-2 mt-6"
              id="input"
              type="text"
              placeholder="Todo Title"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
            ></input>
            <select
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="w-4/5 py-2 mt-4"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex flex-row justify-between w-3/5 mt-4">
              <button
                className="text-pink-600 hover:text-pink-700"
                onClick={() => {
                  setIsOpenModal(false);
                  setAlert("");
                }}
              >
                <XCircleIcon className="h-12 w-12" />
              </button>
              <button
                className="text-green-600 hover:text-green-700"
                onClick={() => createCard()}
              >
                <PlusCircleIcon className="h-12 w-12" />
              </button>
            </div>
            <p className="text-red-500 mt-4">{alert}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
