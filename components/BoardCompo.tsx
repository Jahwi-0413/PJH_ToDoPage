"use client";

import { useRef } from "react";
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

interface BoardProps extends React.ComponentProps<"input"> {
  board: Board;
  createTodo: () => void;
  editBoardName: (name: string) => void;
  deleteBoard: () => void;
  changeTodoName: (todoId: string, name: string) => void;
  deleteTodo: (todoId: string) => void;
}

export function BoardCompo({
  board,
  createTodo,
  editBoardName,
  deleteBoard,
  changeTodoName,
  deleteTodo,
  ...props
}: BoardProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const onClickEdit = () => {
    nameInputRef.current?.focus();
  };

  return (
    <Card className="w-[20vw] h-[70vh]" {...props}>
      <CardHeader className="grid grid-cols-[50%_auto_.25fr_.25fr] items-center">
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
      <CardContent className="flex flex-col gap-6">
        {board.todos.map((t) => (
          <TodoCompo
            key={t.id}
            todo={t}
            draggable
            changeTodoName={changeTodoName}
            deleteTodo={deleteTodo}
          />
        ))}
      </CardContent>
    </Card>
  );
}
