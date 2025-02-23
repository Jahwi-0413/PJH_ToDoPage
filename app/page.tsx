"use client";

import { useEffect, useState } from "react";
import StorageManager from "@/lib/storageManager";
import { Board, BoardManager } from "@/lib/boardManager";
import { BoardListCompo } from "@/components/BoardListCompo";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TodoManager } from "@/lib/todoManager";

export default function Home() {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    setBoards(StorageManager.getBoards());
  }, []);

  useEffect(() => {
    StorageManager.setBoards(boards);
  }, [boards]);

  const onClickCreateBoard = () => {
    setBoards((prev) => [...prev, BoardManager.createBoard()]);
  };

  const onClickCreateTodo = () => {
    if (boards.length === 0) return;

    // 0번 index의 board에 새로운 todo 추가
    setBoards(([first, ...last]) => [
      { ...first, todos: [...first.todos, TodoManager.createTodo()] },
      ...last,
    ]);
  };

  const onClickResetData = () => {
    setBoards([]);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="self-end m-2" variant={"icon"}>
            <EllipsisVertical className="!w-6 !h-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onClickCreateBoard}>
            <span>보드 추가</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={boards.length === 0}
            onClick={onClickCreateTodo}
          >
            <span>할 일 추가</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-700 focus:text-red-700"
            disabled={boards.length === 0}
            onClick={onClickResetData}
          >
            <span>데이터 초기화</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {boards.length === 0 ? (
        <div>저장된 보드가 없습니다.</div>
      ) : (
        <div>
          <BoardListCompo boards={boards} setBoards={setBoards} />
        </div>
      )}
    </>
  );
}
