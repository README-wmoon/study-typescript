import logo from './logo.svg';
import './App.css';
// import Bae from './day01/d01MyComponent';
// import AAA, { a, tmp, Test} from './day02/d01export';
// import Inline from './day02/d03inline';
// import CssFile from './day02/d04cssfile';
// import EmotionComponent from './day03/d01emotion';
// import RouterPage from './day03/d02router';
// import ErrorPage from './day03/d03err';
// import DashboardPage from './dashboard/dashboard';
// import ConditionalPage from './day05/01conditional';
// import StatePage from './day06/d01state';
// import MapPage from './day07/d01map';
// import UseEffectPage from './day08/d01useEffect';
// import BoardListFetch from './day09/d01boardList';
// import BoardListAxios from './day09/d02boardList';
// import ExpressTestPage from './day10/expressTest';
import { BrowserRouter, Route,  RouterProvider,  Routes, createBrowserRouter } from 'react-router-dom';
import JoinPage from './pages/auth/join';
import LoginPage from './pages/auth/login';
import IndexPage from './pages/main';
import ErrorPage from './pages/404';
import ValidateTest from './aaa/day11/validate';
import { createContext, useState } from 'react';
import CareerPage from './pages/dashboard/career';
import ActivityPage from './pages/dashboard/activity';
import RefTestComponent from './aaa/day12/refTest';
import TodoPage from './pages/dashboard/todo';
import ActivityDetailPage from './pages/dashboard/activityDetail';
import ActivityWritePage from './pages/dashboard/activityWrite';
import ActivityUpdatePage from './pages/dashboard/activityUpdate';

const router = createBrowserRouter([
  // {path:'/', element:<Bae/>, errorElement:<ErrorPage/>},
  // {path:'/abc', element:<EmotionComponent/>},
  // {path:'/bbb', element:<RouterPage/>},
  // {path:'/dashboard', element:<DashboardPage/>},
  // {path:'/conditional', element:<ConditionalPage/>},
  // {path:'/state', element:<StatePage/>},
  // {path:'/map', element:<MapPage/>},
  // {path:'/useEffect', element:<UseEffectPage/>},
  // {path:'/fetch-list', element:<BoardListFetch/>},
  // {path:'/axios-list', element:<BoardListAxios/>},
  // {path:'/express', element:<ExpressTestPage/>},
  {path:'/', element: <IndexPage/>, errorElement:<ErrorPage/>},
  {path:'/join', element:<JoinPage/>},
  {path:'/login', element:<LoginPage/>},
  {path:'/validate', element:<ValidateTest/>},
  {path:'/career', element:<CareerPage/>},
  {path:'/activity', element:<ActivityPage/>},
  {path:'/activity/:id', element:<ActivityDetailPage/>},
  {path:'/activity/:id/update', element:<ActivityUpdatePage/>},
  {path:'/activity/new', element:<ActivityWritePage/>},

  {path:'/day12/refTest', element:<RefTestComponent/>},
  {path:'/todo', element:<TodoPage/>}

]);
// export const Test = createContext();
export const UserContext = createContext();

const App = ()=>{
  // 전역에서 사용할 변수
  const [accessToken, setAccessToken] = useState(null);
  return (
    // <Test.Provider value={{age:10, name:'배상엽'}}>
    // </Test.Provider>

      <UserContext.Provider value={{accessToken, setAccessToken}}>
        <RouterProvider router={router}/>
      </UserContext.Provider>
  );
}

// function App() {
//   return (
//     <BrowserRouter >
//       <Routes >
//         <Route errorElement={<ErrorPage/>} path='/' element={<Bae />} />
//         <Route path='/abc' element={<EmotionComponent />} />
//         <Route path='/bbb' element={<RouterPage />} />
//       </Routes>
//     </BrowserRouter>
    
//   );
// }

export default App;
