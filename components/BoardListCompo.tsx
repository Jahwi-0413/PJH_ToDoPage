"use client";

import { Board } from "@/lib/boardManager";
import { BoardCompo } from "./BoardCompo";
import { Todo, TodoManager } from "@/lib/todoManager";
import { useState } from "react";

interface BoardListCompo {
  boards: Board[];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
}

export function BoardListCompo({ boards, setBoards }: BoardListCompo) {
  const [draggingBoard, setDraggingBoard] = useState<Board | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const editBoardName = (boardId: string, name: string) => {
    setBoards(boards.map((b) => (b.id === boardId ? { ...b, name } : b)));
  };

  const deleteBoard = (boardId: string) => {
    setBoards(boards.filter((b) => b.id !== boardId));
  };

  const setBoard = (board: Board) => {
    setBoards(boards.map((b) => (b.id === board.id ? board : b)));
  };

  const handleDragStart = (board: Board) => {
    setDraggingBoard(board);
  };

  const handleDragOver = (index: number) => {
    if (!draggingBoard) return;
    setHoverIndex(index);
  };

  const handleDrop = () => {
    if (draggingBoard !== null && hoverIndex !== null) {
      setBoards((prev) => {
        const newBoards = [...prev];
        const oldIndex = newBoards.findIndex((b) => b.id === draggingBoard.id);
        newBoards.splice(oldIndex, 1);

        let newIndex = hoverIndex;
        if (hoverIndex <= 0) {
          newIndex = 0;
        } else if (hoverIndex >= prev.length) {
          newIndex = prev.length;
        }
        newBoards.splice(newIndex, 0, draggingBoard);
        return newBoards;
      });
    }
    resetDragging();
  };

  const resetDragging = () => {
    setDraggingBoard(null);
    setHoverIndex(null);
  };

  const handleDragEnd = () => {
    resetDragging();
  };

  return (
    <div className="flex flex-row p-4 overflow-x-auto">
      {boards.map((board, index) => (
        <div
          className="flex flex-row gap-0"
          key={board.id}
          draggable
          onDragStart={() => {
            handleDragStart(board);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            handleDragOver(index);
          }}
          onDrop={() => {
            handleDrop();
          }}
          onDragEnd={handleDragEnd}
        >
          <div
            className={`w-[4px] h-full bg-blue-500 m-auto ${
              hoverIndex === -1 && index === 0 ? "visible" : "invisible"
            }`}
          ></div>
          <BoardCompo
            board={board}
            setBoard={setBoard}
            createTodo={() => {
              const newTodo: Todo = TodoManager.createTodo();
              setBoard({ ...board, todos: [...board.todos, newTodo] });
            }}
            editBoardName={(name) => editBoardName(board.id, name)}
            deleteBoard={() => deleteBoard(board.id)}
            changeTodoName={(todoId, name) => {
              setBoard({
                ...board,
                todos: board.todos.map((t) =>
                  t.id === todoId ? { ...t, name } : t
                ),
              });
            }}
            deleteTodo={(todoId) => {
              setBoard({
                ...board,
                todos: board.todos.filter((t) => t.id !== todoId),
              });
            }}
          />
          <div className={"w-4 h-full"}>
            <div
              className={`w-[4px] h-full bg-blue-500 m-auto ${
                hoverIndex === index ? "visible" : "invisible"
              }`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
