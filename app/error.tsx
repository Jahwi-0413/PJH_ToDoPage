"use client";

import { Button } from "@/components/ui/button";
import StorageManager from "@/lib/storageManager";

export default function HomeError({ reset }: { reset: () => void }) {
  const onClickReset = () => {
    StorageManager.setBoards([]);
    reset();
  };
  return (
    <>
      <span className="tex-xl">예상치 못한 문제가 발견되었습니다.</span>
      <Button variant={"destructive"} onClick={onClickReset}>
        데이터 초기화
      </Button>
    </>
  );
}
