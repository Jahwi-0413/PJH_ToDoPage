import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { BoardSkeleton } from "@/components/BoardSkeleton";

const meta = {
  title: "BoardSkeleton",
  component: BoardSkeleton,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof BoardSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
