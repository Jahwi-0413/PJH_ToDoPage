"use client";

import { Board } from "@/lib/boardManager";
import { BoardCompo } from "./BoardCompo";
import { Todo, TodoManager } from "@/lib/todoManager";

interface BoardListCompo {
  boards: Board[];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
}

export function BoardListCompo({ boards, setBoards }: BoardListCompo) {
  const editBoardName = (boardId: string, name: string) => {
    setBoards(boards.map((b) => (b.id === boardId ? { ...b, name } : b)));
  };

  const deleteBoard = (boardId: string) => {
    setBoards(boards.filter((b) => b.id !== boardId));
  };

  const setBoard = (board: Board) => {
    setBoards(boards.map((b) => (b.id === board.id ? board : b)));
  };

  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {boards.map((board) => (
        <BoardCompo
          key={board.id}
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
      ))}
    </div>
  );
}
