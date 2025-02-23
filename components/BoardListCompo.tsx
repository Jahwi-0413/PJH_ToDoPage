"use client";

import { Board, BoardManager } from "@/lib/boardManager";
import { BoardCompo } from "./BoardCompo";
import { Todo, TodoManager } from "@/lib/todoManager";
import { useState } from "react";

interface BoardListCompo {
  boards: Board[];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
}

export function BoardListCompo({ boards, setBoards }: BoardListCompo) {
  const [draggingBoard, setDraggingBoard] = useState<Board | null>(null);
  const [draggingTodo, setDraggingTodo] = useState<{
    todo: Todo;
    boardId: string;
  } | null>(null);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const editBoardName = (boardId: string, name: string) => {
    setBoards(boards.map((b) => (b.id === boardId ? { ...b, name } : b)));
  };

  const deleteBoard = (boardId: string) => {
    setBoards((prev) => BoardManager.deleteBoard(prev, boardId));
  };

  const setBoard = (board: Board) => {
    setBoards(boards.map((b) => (b.id === board.id ? board : b)));
  };

  const handleDragStart = (board: Board) => {
    setDraggingBoard(board);
  };

  const handleDragOver = (index: number | null) => {
    if (!draggingBoard) return;
    setHoverIndex(index);
  };

  const handleDrop = () => {
    if (draggingBoard !== null && hoverIndex !== null) {
      // e.stopPropagation();
      setBoards((prev) => {
        const newBoards = [...prev];
        let newIndex = hoverIndex;
        if (hoverIndex <= 0) {
          newIndex = 0;
        } else if (hoverIndex >= prev.length) {
          newIndex = prev.length;
        }

        BoardManager.changeBoardOrder(newBoards, draggingBoard.id, newIndex);

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

  const moveTodo = (
    todo: Todo,
    fromBoardId: string,
    toBoardId: string,
    newIndex: number
  ) => {
    if (fromBoardId === toBoardId) {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === toBoardId
            ? { ...board, todos: moveItem(board.todos, todo.id, newIndex) }
            : board
        )
      );
    } else {
      setBoards((prev) => {
        const fromBoard = prev.find((b) => b.id === fromBoardId);
        const toBoard = prev.find((b) => b.id === toBoardId);
        if (!fromBoard || !toBoard) return prev;

        return prev.map((board) => {
          if (board.id === fromBoardId) {
            return {
              ...board,
              todos: board.todos.filter((t) => t.id !== todo.id),
            };
          } else if (board.id === toBoardId) {
            const newTodos = [...toBoard.todos];
            newTodos.splice(newIndex, 0, todo);
            return { ...board, todos: newTodos };
          }
          return board;
        });
      });
    }
  };

  const moveItem = (
    items: Todo[],
    itemId: string,
    newIndex: number
  ): Todo[] => {
    const oldIndex = items.findIndex((item: Todo) => item.id === itemId);
    if (oldIndex === -1) return items;

    const newItems = [...items];
    const [removed] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, removed);
    return newItems;
  };

  return (
    <div
      className="flex flex-row p-4 overflow-x-auto"
      onDrop={handleDrop}
      onDragLeave={() => handleDragOver(null)}
    >
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
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
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
                todos: TodoManager.deleteTodo(board.todos, todoId),
              });
            }}
            draggingTodo={draggingTodo}
            setDraggingTodo={setDraggingTodo}
            moveTodo={moveTodo}
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
