import { Board } from "./boardManager";

export const STORAGE_KEY_BOARD = "boards";

const StorageManager = {
  setItem: (key: string, value: unknown) => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key: string) => {
    // 서버 환경에서는 접근할 수 없으니 예외처리
    if (typeof window === "undefined") {
      return null;
    }
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
    const boards: Board[] | null = StorageManager.getItem(STORAGE_KEY_BOARD);
    // 데이터가 없는 경우에는 강제로 만들어준다
    if (!boards) {
      StorageManager.initData();
      return [];
    }
    return boards;
  },
};

export default StorageManager;
