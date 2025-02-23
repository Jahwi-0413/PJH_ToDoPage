import { Skeleton } from "@/components/ui/skeleton";
import { Meta, StoryObj } from "@storybook/react";

const SkeletonCompo = () => {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};

const meta = {
  title: "Shadcn/Skeleton",
  component: SkeletonCompo,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
} satisfies Meta<typeof SkeletonCompo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
