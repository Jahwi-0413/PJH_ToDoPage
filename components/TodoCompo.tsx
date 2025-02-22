"use client";

import { Todo } from "@/lib/todoManager";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { EditIcon, TrashIcon } from "lucide-react";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TodoProps extends React.ComponentProps<"div"> {
  todo: Todo;
  changeTodoName: (id: string, name: string) => void;
  deleteTodo: (id: string) => void;
}

export function TodoCompo({
  todo,
  changeTodoName,
  deleteTodo,
  className,
  ...props
}: TodoProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onClickEdit = () => {
    inputRef.current?.focus();
  };

  const onClickDelete = () => {
    deleteTodo(todo.id);
  };

  return (
    <div
      className={cn(
        "group rounded-md grid grid-cols-[2.5fr_.25fr_.25fr] bg-gray-300 p-2 hover:bg-gray-200",
        className
      )}
      {...props}
    >
      <Input
        ref={inputRef}
        className={"text-ellipsis bg-transparent"}
        value={todo.name}
        onChange={(e) => changeTodoName(todo.id, e.target.value)}
      />
      <Button
        className="invisible group-hover:visible group-focus-within:visible hover:bg-transparent"
        variant={"icon"}
        onClick={onClickEdit}
      >
        <EditIcon />
      </Button>
      <Button
        className="invisible group-hover:visible group-focus-within:visible hover:bg-transparent"
        variant={"icon"}
        onClick={onClickDelete}
      >
        <TrashIcon />
      </Button>
    </div>
  );
}
