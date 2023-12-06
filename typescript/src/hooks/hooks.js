import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {UserContext} from "../App";

// accessToken이 있는지 없는지 검사하는 훅함수
// useEffect안에 배열이 비워있으면 최초 한번만 실행이된다
export const useAuth = () => {
    const {accessToken, setAccessToken} = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        // 1. 로그인이 안된 상태 localStorage의 accessToken 없음,
        //      전역 상태변수 accessToken null
        if(localStorage.getItem('accessToken') === null) {
            alert('로그인이 필요한 페이지 입니다');
            navigate('/login', {replace : true});
            return;
        }

        // 2. 로그인은 되었으나 새로고침한 상태 accessToken 있음,
        //      전역 상태변수 accessToken null
        if(accessToken === null) {
            setAccessToken(localStorage.getItem('accessToken'));
            return;
        }

        // 3. 로그인 되었고, 새로고침도 안함
        // localStorage accessToken 있음,
        //      전역 상태변수 accessToken 있음
    }, [accessToken, setAccessToken, navigate]);
}




//  페이지 이동을 위한 hook 함수
export const useMove = (dir) => {
   const navigate = useNavigate();
   return ()=>{navigate(dir)}
}

// 페이지 이동인데 뒤로가기 못하게 이동하는 hook함수
export const useReplace = (dir) => {
    const navigate = useNavigate();
    navigate(dir, {replace : true});
}
