"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  PlusIcon,
  EllipsisVerticalIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Board } from "@/lib/boardManager";
import { TodoCompo } from "./TodoCompo";
import { Todo } from "@/lib/todoManager";

interface BoardProps extends React.ComponentProps<"div"> {
  board: Board;
  setBoard: (board: Board) => void;
  createTodo: () => void;
  editBoardName: (name: string) => void;
  deleteBoard: () => void;
  changeTodoName: (todoId: string, name: string) => void;
  deleteTodo: (todoId: string) => void;
  draggingTodo: { todo: Todo; boardId: string } | null;
  setDraggingTodo: React.Dispatch<
    React.SetStateAction<{ todo: Todo; boardId: string } | null>
  >;
  moveTodo: (
    todo: Todo,
    boardId: string,
    toBoardId: string,
    newIndex: number
  ) => void;
}

export function BoardCompo({
  board,
  createTodo,
  editBoardName,
  deleteBoard,
  changeTodoName,
  deleteTodo,
  moveTodo,
  draggingTodo,
  setDraggingTodo,
  ...props
}: BoardProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleDragStart = (todo: Todo) => {
    setDraggingTodo({ todo, boardId: board.id });
  };

  const handleDragOver = (index: number) => {
    if (!draggingTodo) {
      return;
    }
    if (hoverIndex === index) {
      return;
    }
    setHoverIndex(index);
  };

  const handleDragEnd = () => {
    resetDragging();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (draggingTodo !== null && hoverIndex !== null) {
      // todo를 옮길때는 부모로 이벤트 전파 막음
      e.stopPropagation();
      let newIndex = hoverIndex;
      if (hoverIndex <= 0) {
        newIndex = 0;
      } else if (hoverIndex >= board.todos.length) {
        newIndex = board.todos.length;
      }
      // todo가 하나도 없는 board인 경우
      if (board.todos.length === 0) {
        newIndex = 0;
      }

      moveTodo(draggingTodo.todo, draggingTodo.boardId, board.id, newIndex);
    }
    resetDragging();
  };

  const resetDragging = () => {
    setDraggingTodo(null);
    setHoverIndex(null);
  };

  const onClickEdit = () => {
    nameInputRef.current?.focus();
  };

  return (
    <Card
      className="w-[20vw] h-[70vh] flex flex-col"
      {...props}
      onDragLeave={() => setHoverIndex(null)}
    >
      <CardHeader
        className="grid grid-cols-[50%_auto_.25fr_.25fr] items-center"
        onDragOver={(e) => {
          e.preventDefault();
          handleDragOver(-1);
        }}
        onDrop={(e) => handleDrop(e)}
      >
        <CardTitle className="mr-4">
          <Input
            className="text-ellipsis text-xl md:text-lg"
            ref={nameInputRef}
            value={board.name}
            onChange={(e) => editBoardName(e.target.value)}
          />
        </CardTitle>
        <span>{board.todos.length}</span>
        <Button variant={"icon"} className="w-fit" onClick={createTodo}>
          <PlusIcon />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"icon"} className="w-fit">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24">
            <DropdownMenuItem onClick={createTodo}>
              <PlusIcon />
              <span>할 일 추가</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClickEdit}>
              <EditIcon />
              <span>이름 수정</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-700 focus:text-red-700"
              onClick={deleteBoard}
            >
              <TrashIcon />
              <span>보드 삭제</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent
        className="flex flex-col gap-2 flex-1 overflow-y-auto"
        onDragOver={(e) => {
          e.preventDefault();
          if (board.todos.length === 0) {
            handleDragOver(0);
          }
        }}
        onDrop={(e) => handleDrop(e)}
      >
        {board.todos.map((t, index) => (
          <div
            key={t.id}
            className={`relative rounded-lg `}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              handleDragStart(t);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDragOver(index);
            }}
            onDrop={(e) => handleDrop(e)}
            onDragEnd={handleDragEnd}
          >
            <div
              className={`w-full h-[4px] bg-blue-500 ${
                index === 0 && hoverIndex === -1 ? "visible" : "invisible"
              }`}
            ></div>

            <TodoCompo
              className={`${
                draggingTodo?.todo.id === t.id ? "opacity-50" : ""
              }`}
              todo={t}
              changeTodoName={changeTodoName}
              deleteTodo={deleteTodo}
            />
            {hoverIndex === index && (
              <div className="absolute bottom-[-4px] left-0 w-full h-[4px] bg-blue-500"></div>
            )}
          </div>
        ))}
        <div
          className={`w-full flex-1`}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDragOver(board.todos.length - 1);
          }}
        ></div>
      </CardContent>
    </Card>
  );
}
