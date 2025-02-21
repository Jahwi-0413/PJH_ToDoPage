import { randomId } from "./utils";

export type Todo = {
  id: string;
  name: string;
};

export const TodoManager = {
  createTodo: (): Todo => {
    return { id: randomId(), name: "New To Do" };
  },
};
