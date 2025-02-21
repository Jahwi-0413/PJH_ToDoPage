import { Board, BoardManager } from "@/lib/boardManager";
import StorageManager, { STORAGE_KEY_BOARD } from "@/lib/storageManager";
import { Todo, TodoManager } from "@/lib/todoManager";
import { beforeAll, beforeEach, expect, jest, test } from "@jest/globals";

beforeAll(() => {
  let storage: { [key: string]: any } = {};

  Object.defineProperty(window, "localStorage", {
    value: {
      setItem: jest.fn((key: string, value: any) => {
        storage[key] = value;
      }),
      getItem: jest.fn((key: string) => {
        return storage[key] || null;
      }),
      removeItem: jest.fn((key: string) => {
        delete storage[key];
      }),
      clear: jest.fn(() => {
        storage = {};
      }),
    },
    writable: true,
  });
});

beforeEach(() => {
  StorageManager.clear();
  StorageManager.initData();
});

test("Add a new board", () => {
  // 새로운 보드 추가
  const board = StorageManager.addBoard();

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([board])
  );
});

test("Delete a board", () => {
  const board = StorageManager.addBoard();
  StorageManager.deleteBoard(board.id);

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([])
  );
});

test("Change board name", () => {
  const board = StorageManager.addBoard();
  const newName = "To Do";
  StorageManager.changeBoardName(board.id, newName);

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([{ ...board, name: newName }])
  );
});

test("Add a new todo", () => {
  const board = StorageManager.addBoard();
  const newTodo = StorageManager.addNewTodo();

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([{ ...board, todos: [newTodo] }])
  );
});

test("Change todo name", () => {
  const board = StorageManager.addBoard();
  const newTodo = StorageManager.addNewTodo();
  const newTodoName = "공부하기";
  newTodo.name = newTodoName;
  StorageManager.changeTodoName(board.id, newTodo.id, newTodoName);

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([{ ...board, todos: [newTodo] }])
  );
});

test("Delete todo", () => {
  const board = StorageManager.addBoard();
  const newTodo = StorageManager.addNewTodo();
  StorageManager.deleteTodo(board.id, newTodo.id);

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([{ ...board, todos: [] }])
  );
});

test("Change board order", () => {
  const board1 = BoardManager.createBoard();
  board1.name = "To Do";
  const board2 = BoardManager.createBoard();
  board2.name = "In Progress";
  StorageManager.setBoards([board1, board2]);
  StorageManager.changeBoardOrder(board1.id, 1);

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([board2, board1])
  );
});

test("Change todo order", () => {
  const board = BoardManager.createBoard();
  const todo1 = TodoManager.createTodo();
  const todo2 = TodoManager.createTodo();
  todo2.name = "Target To Do"; // todo name 순서 : "New To Do" -> "Target To Do" -> "New To Do"
  const todo3 = TodoManager.createTodo();
  board.todos = [todo1, todo2, todo3];
  StorageManager.setBoards([board]);
  StorageManager.changeTodoOrder(board.id, todo2.id, 2); // todo name 순서 : "New To Do" -> "New To Do" -> "Target To Do"

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([
      { id: board.id, name: board.name, todos: [todo1, todo3, todo2] },
    ])
  );
});

test("Move a todo from A to B", () => {
  const boardA = BoardManager.createBoard();
  boardA.name = "A";
  const boardB = BoardManager.createBoard();
  boardB.name = "B";
  const todo1 = { ...TodoManager.createTodo(), name: "To Do 1" };
  const todo2 = { ...TodoManager.createTodo(), name: "To Do 2" };
  boardA.todos = [todo1, todo2]; // boardA.todos = [todo1, todo2], boardB.todos = []
  StorageManager.setBoards([boardA, boardB]);
  StorageManager.moveTodoToAnotherBoard(boardA.id, boardB.id, todo1.id, 0); // boardA.todos = [todo2], boardB.todos = [todo1]

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([
      { ...boardA, todos: [todo2] },
      { ...boardB, todos: [todo1] },
    ])
  );
});
