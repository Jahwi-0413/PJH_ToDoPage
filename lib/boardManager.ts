import { Todo, TodoManager } from "./todoManager";
import { randomId } from "./utils";

export interface Board {
  id: string;
  name: string;
  todos: Todo[];
}

export const BoardManager = {
  createBoard(): Board {
    return { id: randomId(), name: "New Board", todos: [] };
  },
  createTodo(board: Board): Todo {
    const todo = TodoManager.createTodo();
    board.todos.push(todo);
    return todo;
  },

  addTodo(board: Board, todo: Todo[], targetIndex: number) {
    board.todos.splice(targetIndex, 0, ...todo);
  },

  changeTodoName(board: Board, todoId: string, name: string) {
    const target = board.todos.find((t) => t.id === todoId);

    if (!target) {
      return new Error("todo를 찾을 수 없습니다.");
    }
    target.name = name;
  },

  removeTodo(board: Board, todoId: string) {
    const index = board.todos.findIndex((t) => t.id === todoId);
    if (index !== -1) {
      board.todos.splice(index, 1);
    }
  },

  changeTodoOrder(board: Board, todoId: string, newIndex: number) {
    const originIndex = board.todos.findIndex((t) => t.id === todoId);

    if (originIndex === -1) {
      return new Error(
        `${board.name} 보드에서 TO Do(${todoId})를 찾을 수 없습니다.`
      );
    }

    const tmpTodo = board.todos[newIndex];
    const targetTodo = board.todos[originIndex];
    board.todos[newIndex] = targetTodo;
    board.todos[originIndex] = tmpTodo;
  },

  moveTodoFromBoard(
    board: Board,
    todoId: string,
    targetBoard: Board,
    newIndex: number
  ) {
    const originIndex = board.todos.findIndex((t) => t.id === todoId);

    if (originIndex === -1) {
      return new Error(
        `${board.name} 보드에서 TO Do(${todoId})를 찾을 수 없습니다.`
      );
    }

    const removedTodo = board.todos.splice(originIndex, 1);
    BoardManager.addTodo(targetBoard, removedTodo, newIndex);
  },
};
