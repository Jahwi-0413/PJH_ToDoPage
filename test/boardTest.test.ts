import { Board } from "@/lib/board.class";
import StorageManager, { STORAGE_KEY_BOARD } from "@/lib/storageManage";
import { Todo } from "@/lib/todo.class";
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
    JSON.stringify([new Board(board.id, board.name, board.todos)])
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
    JSON.stringify([new Board(board.id, newName, board.todos)])
  );
});

test("Add a new todo", () => {
  const board = StorageManager.addBoard();
  const newTodo = StorageManager.addNewTodo();

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([new Board(board.id, board.name, [newTodo])])
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
    JSON.stringify([new Board(board.id, board.name, [newTodo])])
  );
});

test("Delete todo", () => {
  const board = StorageManager.addBoard();
  const newTodo = StorageManager.addNewTodo();
  StorageManager.deleteTodo(board.id, newTodo.id);

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([new Board(board.id, board.name, [])])
  );
});

test("Change board order", () => {
  const board1 = new Board();
  board1.name = "To Do";
  const board2 = new Board();
  board2.name = "In Progress";
  StorageManager.setBoards([board1, board2]);
  StorageManager.changeBoardOrder(board1.id, 1);

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([board2, board1])
  );
});

test("Change todo order", () => {
  const board = new Board();
  const todo1 = board.createTodo();
  const todo2 = board.createTodo();
  const todo3 = board.createTodo();
  todo2.name = "Target To Do"; // todo name 순서 : "New To Do" -> "Target To Do" -> "New To Do"
  StorageManager.setBoards([board]);
  StorageManager.changeTodoOrder(board.id, todo2.id, 2); // todo name 순서 : "New To Do" -> "New To Do" -> "Target To Do"

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([new Board(board.id, board.name, [todo1, todo3, todo2])])
  );
});

test("Move a todo from A to B", () => {
  const boardA = new Board();
  boardA.name = "A";
  const boardB = new Board();
  boardB.name = "B";
  const todo1 = new Todo(boardA.id, "To Do 1");
  const todo2 = new Todo(boardA.id, "To Do 2");
  boardA.addTodo([todo1, todo2], 0); //boardA.todos = [todo1, todo2], boardB.todos = []
  StorageManager.setBoards([boardA, boardB]);
  StorageManager.moveTodoToAnotherBoard(boardA.id, boardB.id, todo1.id, 0); // boardA.todos = [todo2], boardB.todos = [todo1]

  expect(localStorage.setItem).toHaveBeenCalledWith(
    STORAGE_KEY_BOARD,
    JSON.stringify([
      new Board(boardA.id, boardA.name, [todo2]),
      new Board(boardB.id, boardB.name, [todo1]),
    ])
  );
});
