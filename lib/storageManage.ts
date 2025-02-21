import { Board } from "./board.class";
import { Todo } from "./todo.class";

export const STORAGE_KEY_BOARD = "boards";

const StorageManager = {
  setItem: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
  initData: () => {
    StorageManager.setItem(STORAGE_KEY_BOARD, []);
  },

  setBoards: (boards: Board[]) => {
    StorageManager.setItem(STORAGE_KEY_BOARD, boards);
  },

  getBoards: (): Board[] => {
    return StorageManager.getItem(STORAGE_KEY_BOARD).map((item: BoardJson) => {
      const todos = item._todos.map((t) => new Todo(item._id, t._name, t._id));
      return new Board(item._id, item._name, todos);
    });
  },
  addBoard: (): Board => {
    const boards: Board[] = StorageManager.getBoards();
    boards.push(new Board());
    StorageManager.setBoards(boards);
    return boards[boards.length - 1];
  },
  deleteBoard: (boardId: string) => {
    const filteredBoards = StorageManager.getBoards()?.filter(
      (b) => b.id !== boardId
    );
    StorageManager.setItem(STORAGE_KEY_BOARD, filteredBoards);
  },
  changeBoardName: (boardId: string, newName: string) => {
    const boards = StorageManager.getBoards();
    const targetIndex = boards.findIndex((b) => b.id === boardId);
    if (targetIndex === -1) {
      throw new Error("보드가 존재하지 않습니다.");
    }
    boards[targetIndex].name = newName;
    StorageManager.setBoards(boards);
  },
  addNewTodo: () => {
    const boards = StorageManager.getBoards();
    if (boards.length === 0) {
      throw new Error("To Do를 생성할 보드가 없습니다.");
    }
    const result = boards[0].createTodo();
    StorageManager.setBoards(boards);
    return result;
  },
  changeTodoName: (boardId: string, todoId: string, newName: string) => {
    const boards = StorageManager.getBoards();
    const boardIndex = boards.findIndex((b) => b.id === boardId);
    if (boardIndex === -1) {
      throw new Error("보드가 존재하지 않습니다.");
    }
    const todoIndex = boards[boardIndex].todos.findIndex(
      (t) => t.id === todoId
    );
    if (todoIndex === -1) {
      throw new Error("To Do가 보드에 존재하지 않습니다.");
    }
    boards[boardIndex].todos[todoIndex].name = newName;
    StorageManager.setBoards(boards);
  },
  deleteTodo: (boardId: string, todoId: string) => {
    const boards = StorageManager.getBoards();
    const boardIndex = boards.findIndex((b) => b.id === boardId);
    if (boardIndex === -1) {
      throw new Error("보드가 존재하지 않습니다.");
    }
    boards[boardIndex].removeTodo(todoId);
    StorageManager.setBoards(boards);
  },

  changeBoardOrder: (boardId: string, targetIndex: number) => {
    const boards = StorageManager.getBoards();
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
    StorageManager.setBoards(boards);
  },

  changeTodoOrder: (boardId: string, todoId: string, targetIndex: number) => {
    const boards = StorageManager.getBoards();
    // invalid index
    if (targetIndex > boards.length + 1) {
      throw new Error("보드를 옮길 수 없는 자리입니다.");
    }
    const boardIndex = boards.findIndex((b) => b.id === boardId);
    if (boardIndex === -1) {
      throw new Error("해당하는 보드가 존재하지 않습니다.");
    }
    boards[boardIndex].changeTodoOrder(todoId, targetIndex);
    StorageManager.setBoards(boards);
  },

  moveTodoToAnotherBoard: (
    fromBoardId: string,
    toBoardId: string,
    todoId: string,
    targetIndex: number
  ) => {
    const boards = StorageManager.getBoards();
    const fromBoard = boards.find((b) => b.id === fromBoardId);
    const toBoard = boards.find((b) => b.id === toBoardId);

    if (!fromBoard || !toBoard) {
      throw new Error("보드 정보를 찾을 수 없습니다.");
    }
    const targetTodo = fromBoard.todos.find((t) => t.id === todoId);
    if (!targetTodo) {
      throw new Error("To Do가 보드에 존재하지 않습니다.");
    }

    toBoard.addTodo([targetTodo], targetIndex);
    fromBoard.removeTodo(todoId);
    StorageManager.setBoards(boards);
  },
};

export type BoardJson = {
  _id: string;
  _name: string;
  _todos: TodoJson[];
};

export type TodoJson = {
  _id: string;
  _name: string;
  _boardId: string;
};

export default StorageManager;
