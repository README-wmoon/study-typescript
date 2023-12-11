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
a.length // 나는 배열이 a 속에 있다고 생각해서 .length 를 사용했는데, a 속에 number타입이 들어있다면?
        --> 오류 발생

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

### 타입스크립트 기본
- 변수에 타입을 알려주기
- 변수 선언시
```
let a:string;

문자열 타입     string
숫자타입        number
불린타입        boolean
null타입        null
undefined 타입  undefined
any 타입 --> 모든 타입 상관없을을 의미하는 타입
```
- 선언할때 1번 만 타입을 지정하면 된다
- 타입을 지정할 떄는 : 뒤에 type이름을 쓰면 된다

### 배열의 타입 표현
```
string[] --> string이 요소로 들어가있는 배열 의미
    ["홍길동", "김철수", "박영희"]
number[] --> number가 요소로 들어가있는 배열 의미
    [10, 20, 30]
boolean[] --> boolean이 요소로 들어가있는 배열 의미
    [true, false, false]


[[10, 20, 30], [100, 200, 300], [1, 2, 3]] --> number[][]
```

### 객체를 표현하는 방법
```
{
    key:value타입,
    key:value타입
}

let a:{title:string, page:number};

a = {title:'홍길동전', page:120}; // --> 타입을 잘 지킨것
a = {title:'홍길동전', page:'120쪽'}; // --> 타입을 못 지킨것
a = {title:'홍길동전'}; // --> 타입을 못 지킨것
a = {title:'홍길동전', page:10, author:'미상'}; // --> 타입을 못 지킨것
```

### interface
내가 사용할 객체 타입에 이름을 붙이기
```
interface 타입이름{
    key:타입,
    key:타입
}
```

### 기본타입 특정 값만 넣을 수 있도록 만들기
```
let a:string;
a = 'ddd'; // 타입 맞음
a = 50; // 타입 오류x

let a : '배상엽'; // a 에는 문자열이면서 '배상엽' 이라는 값만 들어갈 수 있다
a = '배상엽'; // 오류가 안남
a = 50; // 타입오류
a = '안녕'; // 타입오류

// let a : string[]; --> a에는 string 타입이 요소로 들어가있는 배열만 넣을 수 있다
let a:[string, number]; // 튜플타입(길이와, 요소의타입이 정해진 배열)
// a에는 [] 배열인데, 0번쨰 자리에는 string타입이, 1번째 자리에는 number타입이 요소로 들어가있는 배열만 넣을 수 있다
let a = [10, 20]; //타입오류

let a:['홍길동', 10]; // a에는 두칸짜리 배열이면서, 0번째자리는 '홍길동'값이, 1번째 자리에는 10이라는 값이들어있는 배열
```

### ☆★☆★☆★☆★union 타입
연산자 | 사용하여 타입을 지정
```
let a : string | number; // a에는 string 혹은 number 타입이 들어간다
a = 10; // O
a = '홍길동'; // O
a = true; // X

let grade = 'vip' | 'silver' | 'normal';

let ar1 : (string | number)[];
ar1 = ['ddd', 'bbb', 'ccc']; // O
ar1 = [10, 20, 30] // O
ar1 = ['ddd', 100, 'ccc'] // O

let ar2 : string[] | number[];
ar2 = ['ddd', 'bbb', 'ccc']; // O
ar2 = [10, 20, 30] // O
ar2 = ['ddd', 100, 'ccc'] // X

let ar3 : [string | number]; // 1칸짜리 배열, 요소로는 string 혹은 number가 들어있는
ar3 = ['ddd']; // O
ar3 = [10];
ar3 = ['ddd', 'bbb', 'ccc']; // X
ar3 = [10, 20, 30] // X
ar3 = ['ddd', 100, 'ccc'] // X
```

### 객체와 유니온
```
interface IStudent{
    name : string,
    age : number,
    grade : 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'F',
    schoolYear : 1 | 2 | 3 | 4
}

interface ITeacher{
    name : string,
    age : number,
    subject : string,
    salary : number
}

let a: IStudent | ITeacher;


intersection 타입 & 
let a : string & number;

let tmp2 : string & number; // let tmp2 : never; --> 절대 아무런 값도 가질 수 없는 타입
tmp2 = 'd'; // X
```
※ 논리는 학생타입이면서 동시에 선생님 타입을 넣어주겠다는 의미
- 학생이라면 name age grade schoolYear 있어야함
- 선생님이라면 name age subject salary 있어야함
```
let tmp3 : IStudent & ITeacher;
tmp3 = {name : '홍길동', age:20, grade: 'A', schoolYear: 4, subject: '과학', salary: 3000}
```

### type 별칭 짓기
타입에다 나만의 이름을 지을 수 있다 (알아보기 편하기위해서)
```
type mymymy
let a :string;

let b : mymymy; // --> string 타입만 넣을 수 있음

type ourSchoolGrade = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'F'
type ourSchoolYear = 1 | 2 | 3 | 4;
```

### 함수를 만들기
- 이 변수에는 함수만 들어갈 수 있어 라고 타입지정
- 함수에서의 타입을 지정하는 방법 <br><br>
**세가지를 정의해줘야 한다**
1. 매개변수 갯수
2. 함수가 어떻게 동작하는지(내부코드)
3. 함수 실행 결과가 어떤 값이 되는지
옛날방식
```
function 함수이름(매개변수1, 매개변수2) {
    코드;
    코드;
    reutrn 값;
}
```
typescript
```
typescript
function 함수이름(매개변수1:매개변수1타입, 매개변수2:매개변수2타입):return타입 {
    코드;
    코드;
    reutrn 값;
}
```
※ Example
```
function banana(a:number, b:number, c:number): number {
    console.log('안녕');
    console.log('반가워');
    return (a + b) * c;
}

function apple():string {
    return 'dddd';
}

let bbb:(a:number, b:number, c:number)=>number;
bbb = banana; // 함수가능, 타입만족
bbb = apple; // 매개변수가 없어서 불가능
```

### 익명함수 타입지정
```
function banana(a:number, b:number, c:number): number {
    console.log('안녕');
    console.log('반가워');
    return (a + b) * c;
}
```
화살표함수
```
(a:number, b:number, c:number):number =>{
    console.log('안녕');
    console.log('반가워');
    return (a + b) * c;
}
```
- 재네릭 문법
- 타입 지정을 만드는 사람이 지정하는 것이 아니라 사용하는 사람에게
- 유예하는 기법






