// ts 확장자 혹은 tsx 확장자를 가지면 typescript 문법 적용된다
// 변수 선언
let a;
// a = 10;
a = "배상엽";

let b:number;
// b = '배상엽'
b = 10;

let c:boolean;
c = true;
// c = 10;

let d:null;
d = null;
// d = "ddd";

let e:undefined;
// e = "fefe";
e = undefined;

// 변수 선언과 초기화 동시에 가능
let aa:number = 50;

// 타입 추론
// 이제 원칙은 변수를 만들떄마다 해당 변수에는 어떤 타입만 들어갈 수 있는지 판단하여 타입을 항상 명시해야한다
// 만일 타입 명시를 생략하면? --> 타입 추론이라는 것이 발생한다
let bb = '배상엽'; // --> bb는 string 타입만 넣을 수 있어 라고 타입 추론 발생
// bb = 10;
// 타입 추론은 컴퓨터가 알아서 추론을 하기 떄문에 우리가 원하는 대로 타입을 추론했는지 알 수 없다
// 반드시 타입은 명시해서 작성하자

let cc;     // any 타입이라고 추론 (어떤 타입이든 상관 없이 들어간다는 타입) --> let cc:any --> any 생략됨
cc = 10;
cc = '배상엽'
cc = true;

let aaa:string[];
aaa = ['dd', 'ff']

let bbb:number[];
bbb = [10, 30, 60];

let ccc:number[][];
ccc = [[1, 2, 3], [10, 20, 30]]


let aaaa:{title:string, page:number};

aaaa = {title:'홍길동전', page:120}; // --> 타입을 잘 지킨것
// aaaa = {title:'홍길동전', page:'120쪽'}; // --> 타입을 못 지킨것
// aaaa = {title:'홍길동전'}; // --> 타입을 못 지킨것
// aaaa = {title:'홍길동전', page:10, author:'미상'}; // --> 타입을 못 지킨것

let bbbb:{title:string, page:number, author?:string};

bbbb = {title:'홍길동전', page:200}
bbbb = {title:'홍길동전', page:200, author:'미상'}
// bbbb = {title:'홍길동전', author:'미상'}

interface Ibook{
    title:string,
    page:number,
    author? : string
}

let cccc:Ibook;
cccc = {title: '뽀로로의대모험', page:200, author:'김지은'};

type ourSchoolGrade = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'F';
type ourSchoolYear = 1 | 2 | 3 | 4;

interface IStudent{
    name : string,
    age : number,
    grade : ourSchoolGrade,
    schoolYear : ourSchoolYear
}

interface ITeacher{
    name : string,
    age : number,
    subject : string,
    salary : number
}

let tmp1: IStudent | ITeacher;

tmp1 = {name : '홍길동', age : 20, grade: 'F', schoolYear:1};
tmp1 = {name : '김박사', age : 50, subject: '과학', salary: 5000};

// intersection 타입
let tmp2 : string & number; // let tmp2 : never; --> 절대 아무런 값도 가질 수 없는 타입
// tmp2 = 'd';

// 논리는 학생타입이면서 동시에 선생님 타입을 넣어주겠다는 의미
// --> 학생이라면 name age grade schoolYear 있어야함
// --> 선생님이라면 name age subject salary 있어야함
let tmp3 : IStudent & ITeacher;
tmp3 = {name : '홍길동', age:20, grade: 'A', schoolYear: 4, subject: '과학', salary: 3000}

type myCbType = (a:number, b:number, c:number) => number;

// 너무 길어서 별칭으로 써줘도 된다
// let ddd:(a:number, b:number, c:number)=>number = (a:number, b:number, c:number):number =>{
//     console.log('안녕');
//     console.log('반가워');
//     return (a + b) * c;
// } 

let ddd:myCbType = (a:number, b:number, c:number):number =>{
    console.log('안녕');
    console.log('반가워');
    return (a + b) * c;
} 