import { BoardCompo } from "@/components/BoardCompo";
import { Button } from "@/components/ui/button";
import { Board } from "@/lib/boardManager";
import { randomId } from "@/lib/utils";
import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

const meta = {
  title: "BoardCompo",
  component: BoardCompoStory,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
} satisfies Meta<typeof BoardCompoStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

function BoardCompoStory() {
  const initialBoard = {
    id: randomId(),
    name: "To Do",
    todos: [
      { id: randomId(), name: "빨래하기" },
      { id: randomId(), name: "청소하기" },
    ],
  };

  const [board, setBoard] = useState<Board | null>(initialBoard);
  const createTodo = () => {
    if (!board) return;

    setBoard((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        todos: [...prev.todos, { id: randomId(), name: "New To Do" }],
      };
    });
  };

  const editBoardName = (name: string) => {
    setBoard((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        name,
      };
    });
  };

  const deleteBoard = () => {
    setBoard(null);
  };

  const onClickInit = () => {
    setBoard(initialBoard);
  };

  const changeTodoName = (todoId: string, name: string) => {
    setBoard((prev) => {
      if (!prev) return null;

      const todoIndex = prev.todos.findIndex((t) => t.id === todoId);
      if (todoIndex === -1) throw new Error("");

      const newTodos = JSON.parse(JSON.stringify(prev.todos));
      newTodos[todoIndex].name = name;

      return {
        ...prev,
        todos: newTodos,
      };
    });
  };

  const deleteTodo = (todoId: string) => {
    setBoard((prev) => {
      if (!prev) return null;

      const todoIndex = prev.todos.findIndex((t) => t.id === todoId);
      if (todoIndex === -1) throw new Error("");

      return { ...prev, todos: prev.todos.filter((t) => t.id !== todoId) };
    });
  };

  return board ? (
    <BoardCompo
      board={board}
      setBoard={setBoard}
      createTodo={createTodo}
      editBoardName={editBoardName}
      deleteBoard={deleteBoard}
      changeTodoName={changeTodoName}
      deleteTodo={deleteTodo}
    />
  ) : (
    <Button onClick={onClickInit}>Init Board</Button>
  );
}
