# PJH_TodoPage

## 기능 구현 체크리스트

### 보드 관리

[x] 보드 추가
[x] 보드 삭제
[x] 보드 이름 수정
[x] 보드 순서 변경

## 할 일 관리

[x] 할 일 생성
[x] 할 일 이름 수정
[x] 보드 안에서 할 일 삭제
[x] 보드 안에서 할 일 순서 수정
[x] 다른 보드의 원하는 위치로 할 일 위치 이동

## 어플리케이션 설치 및 실행

### dependency 설치

```
npm ci
```

### 어플리케이션 실행

```
npm run dev
```

### 스토리북 실행

```
npm run storybook
```

### 테스트 코드 실행

```
npm test
```

테스트 코드 위치 : /test/boardTest.test.ts

## 사용한 라이브러리

- next.js v15.1.7 (app router)
- tailwindcss v3.4.1
- storybook v8.5.8
- jest v29.7.0
- shadcn
  - button
  - card
  - dropdown-menu
  - input
  - skeleton
