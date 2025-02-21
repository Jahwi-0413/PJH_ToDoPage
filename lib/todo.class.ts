import { randomId } from "./utils";

export class Todo {
  private readonly _id: string = randomId();
  private _name: string = "New To Do";
  private _boardId: string;

  constructor(boardId: string, name?: string, id?: string) {
    this._boardId = boardId;
    if (name) {
      this._name = name;
    }
    if (id) {
      this._id = id;
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

  public get boardId() {
    return this._boardId;
  }

  public changeBoard(id: string) {
    this._boardId = id;
  }
}
