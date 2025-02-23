import { randomId } from "./utils";

export type Todo = {
  id: string;
  name: string;
};

export const TodoManager = {
  createTodo: (): Todo => {
    return { id: randomId(), name: "New To Do" };
  },
  deleteTodo(todos: Todo[], todoId: string): Todo[] {
    return todos.filter((t) => t.id !== todoId);
  },
  changeTodoOrder: (
    todos: Todo[],
    todoId: string,
    newIndex: number
  ): Todo[] => {
    const originIndex = todos.findIndex((t) => t.id === todoId);

    if (originIndex === -1) {
      throw new Error(`할 일 정보를 찾을 수 없습니다.`);
    }

    const tmpTodo = todos[newIndex];
    const targetTodo = todos[originIndex];
    todos[newIndex] = targetTodo;
    todos[originIndex] = tmpTodo;
    return todos;
  },
};
