import { Input } from "@/components/ui/input";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const InputCompo = () => {
  const [text, setText] = useState("input");
  return <Input value={text} onChange={(e) => setText(e.target.value)} />;
};

const meta = {
  title: "Shadcn/Input",
  component: InputCompo,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
