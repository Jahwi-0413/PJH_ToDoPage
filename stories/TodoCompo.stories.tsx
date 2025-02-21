import { TodoCompo } from "@/components/TodoCompo";
import { Button } from "@/components/ui/button";
import { Todo } from "@/lib/todoManager";
import { randomId } from "@/lib/utils";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

function TodoCompoStory() {
  const intialTodo = {
    id: randomId(),
    name: "New To Do",
  };

  const [todo, setTodo] = useState<Todo | null>(intialTodo);

  const changeTodoName = (name: string) => {
    setTodo((prev) => {
      if (!prev) return null;

      return { ...prev, name };
    });
  };

  const deleteTodo = (_: string) => {
    setTodo(null);
  };

  const onClickInit = () => {
    setTodo(intialTodo);
  };

  return (
    <>
      {todo ? (
        <TodoCompo
          todo={todo}
          changeTodoName={changeTodoName}
          deleteTodo={deleteTodo}
        />
      ) : (
        <Button onClick={onClickInit}>Init To Do</Button>
      )}
    </>
  );
}

const meta = {
  title: "TodoCompo",
  component: TodoCompoStory,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
} satisfies Meta<typeof TodoCompoStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
