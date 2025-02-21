import { Todo } from "./todo.class";
import { randomId } from "./utils";

export class Board {
  private _id: string = randomId();
  private _name: string = "New Board";
  private _todos: Todo[] = [];

  constructor(id?: string, name?: string, todos?: Todo[]) {
    if (id) {
      this._id = id;
    }
    if (name) {
      this._name = name;
    }
    if (todos) {
      this._todos = todos;
    }
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }
  public set name(name: string) {
    this._name = name;
  }

  public get todos() {
    return this._todos;
  }

  public createTodo(): Todo {
    const todo = new Todo(this._id);
    this._todos.push(todo);
    return todo;
  }

  public addTodo(todo: Todo[], targetIndex: number) {
    this._todos.splice(targetIndex, 0, ...todo);
  }

  public changeTodoName(todoId: string, name: string) {
    const target = this._todos.find((t) => t.id === todoId);

    if (!target) {
      return new Error("todo를 찾을 수 없습니다.");
    }
    target.name = name;
  }

  public removeTodo(todoId: string) {
    const index = this._todos.findIndex((t) => t.id === todoId);
    if (index !== -1) {
      this._todos.splice(index, 1);
    }
  }

  public changeTodoOrder(todoId: string, newIndex: number) {
    const originIndex = this._todos.findIndex((t) => t.id === todoId);

    if (originIndex === -1) {
      return new Error(
        `${this.name} 보드에서 TO Do(${todoId})를 찾을 수 없습니다.`
      );
    }

    const tmpTodo = this._todos[newIndex];
    const targetTodo = this._todos[originIndex];
    this._todos[newIndex] = targetTodo;
    this._todos[originIndex] = tmpTodo;
  }

  public moveTodoFromBoard(
    todoId: string,
    targetBoard: Board,
    newIndex: number
  ) {
    const originIndex = this._todos.findIndex((t) => t.id === todoId);

    if (originIndex === -1) {
      return new Error(
        `${this.name} 보드에서 TO Do(${todoId})를 찾을 수 없습니다.`
      );
    }

    const removedTodo = this.todos.splice(originIndex, 1);
    targetBoard.addTodo(removedTodo, newIndex);
  }
}
