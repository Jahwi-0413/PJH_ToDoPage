import { BoardListCompo } from "@/components/BoardListCompo";
import { Board, BoardManager } from "@/lib/boardManager";
import { TodoManager } from "@/lib/todoManager";
import { randomId } from "@/lib/utils";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta = {
  title: "BoardListCompo",
  component: BoardListCompoStory,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
} satisfies Meta<typeof BoardListCompoStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

function BoardListCompoStory() {
  const intialBoards: Board[] = [
    {
      id: randomId(),
      name: "To Do",
      todos: [
        { id: randomId(), name: "공부하기" },
        { id: randomId(), name: "청소하기" },
      ],
    },
    {
      id: randomId(),
      name: "In Progress",
      todos: [
        { id: randomId(), name: "과제하기" },
        { id: randomId(), name: "빨래하기" },
      ],
    },
    {
      id: randomId(),
      name: "Done",
      todos: [],
    },
  ];
  const [boards, setBoards] = useState(intialBoards);
  return <BoardListCompo boards={boards} setBoards={setBoards} />;
}
