# 타입스크립트 정리

## 타입스크립트
```
javascript
    언어 o
typescript
    언어 x --> 자바스크립트를 작성할때 사용하는 tool

typescript 문법을 따라서 작성 --> javascript로 변환 --> javascript를 실행
```
※ 기존 javascript 기반의 리액트 프로젝트에 typescript 문법을 추가하는 방법
```
npm install typescript @types/react @types/react-dom @types/jest
```
※ 애초에 리액트 프로젝트를 만들 떄 typescript 문법을 사용하는 리액트프로젝트를 만드는 방법
```
npx create-react-app 프로젝트이름 --template typescript
```
- 우리가 추가로 설치한 라이브러리들도 typescript를 지원하는 라이브러리들이 존재한다(버전이 서로 호환이 되는지 확인 필요)
- 예를 들어, emotion --> typescript를 지원하는 emotion
- react-router-dom --> typescrip를 지원하는 react-router-dom

### 타이스크립트 필요성
자바스크립트는 느슨한 언어(타입을 엄격하게 규제하지 않는다)

### 자바스크립트 변수
```
let a;
a = 10; // 오류x
a = '배상엽'; // 오류 x
a = [10, 20, 30]; // 오류 x
```
※ 변수를 선언하면 그 변수 속에 어떤 타입의 값이 들어가도 상관이 없다..!
```
a.length // 나는 배열이 a 속에 있다고 생각해서 .length 를 사용했는데, a 속에 number타입이 들어있다면? --> 오류 발생

애초에 a 에는 배열타입만 들어갈 수 있다 라고 타입을 지정해 주면
a.length // 문제 없겠구나 (실행을 시켜도)

변수 b에는 number타입만 들어갈 수 있다 고 지정
b.length

a 라는 매개변수는 number타입만 넣을 수 있어요
let banana = (a) => {
    return a / 2
}

banana('문우람')
```

### 기본
```
.ts 파일과          .js
.tsx 파일을 구분    .jsx return 자리에 <>><> 가 return 되는 컴포넌트가 존재
```

### tsconfig.json 파일 만들기
- 타입스크립트 설정 파일
- 컴파일 옵션(typescript --> javascript 로 변환)
- 타입스크립트 적용 폴더
- 타입스크립트 적용 안할 폴더
- ... 옵션 설정 <br>
- **https://www.typescriptlang.org/tsconfig** -> 참고
- import a from "ddd"; <-- es6 방식
- const a = require("ddd"); <-- commonjs
























