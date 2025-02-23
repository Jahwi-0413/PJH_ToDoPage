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

  deleteBoard(boards: Board[], targetId: string): Board[] {
    return boards.filter((b) => b.id !== targetId);
  },

  changeBoardOrder(boards: Board[], boardId: string, targetIndex: number) {
    // invalid index
    if (targetIndex > boards.length + 1) {
      throw new Error("보드를 옮길 수 없는 자리입니다.");
    }

    const boardIndex = boards.findIndex((b) => b.id === boardId);
    if (boardIndex === -1) {
      throw new Error("해당하는 보드가 존재하지 않습니다.");
    }
    const tmp = boards[targetIndex];
    boards[targetIndex] = boards[boardIndex];
    boards[boardIndex] = tmp;
    return boards;
  },

  addTodo(board: Board, todo: Todo[], targetIndex: number) {
    board.todos.splice(targetIndex, 0, ...todo);
  },

  removeTodo(board: Board, todoId: string) {
    board.todos = TodoManager.deleteTodo(board.todos, todoId);
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

  moveTodoToAnotherBoard: (
    boards: Board[],
    fromBoardId: string,
    toBoardId: string,
    todoId: string,
    targetIndex: number
  ) => {
    const fromBoard = boards.find((b) => b.id === fromBoardId);
    const toBoard = boards.find((b) => b.id === toBoardId);

    if (!fromBoard || !toBoard) {
      throw new Error("보드 정보를 찾을 수 없습니다.");
    }
    const targetTodo = fromBoard.todos.find((t) => t.id === todoId);
    if (!targetTodo) {
      throw new Error("To Do가 보드에 존재하지 않습니다.");
    }

    BoardManager.addTodo(toBoard, [targetTodo], targetIndex);
    BoardManager.removeTodo(fromBoard, todoId);
    return boards;
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
