import { Board, BoardManager } from "./boardManager";

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
    let boards: Board[] | null = StorageManager.getItem(STORAGE_KEY_BOARD);
    // 데이터가 없는 경우에는 강제로 만들어준다
    if (!boards) {
      StorageManager.initData();
      return [];
    }
    return boards;
  },
  addBoard: (): Board => {
    const boards: Board[] = StorageManager.getBoards();
    boards.push(BoardManager.createBoard());
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
    const result = BoardManager.createTodo(boards[0]);
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
    BoardManager.removeTodo(boards[boardIndex], todoId);
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
    BoardManager.changeTodoOrder(boards[boardIndex], todoId, targetIndex);
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

    BoardManager.addTodo(toBoard, [targetTodo], targetIndex);
    BoardManager.removeTodo(fromBoard, todoId);
    StorageManager.setBoards(boards);
  },
};

export default StorageManager;
