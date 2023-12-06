import { AuthBody, AuthBox, AuthForm, BgImg, Button, CancelIcon, ErrMsg, Input, InputBoxWrap, Option, Select, Wrap } from "../../styles/auth/auth.styles";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
const JoinPage = () => {
    // state 변수 9개
    // 사용자가 email에 입력한 값

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [question, setQuestion] = useState(1);
    const [answer, setAnswer] = useState('');
    const [emailErrMsg, setEmailErrMsg] = useState('');
    const [passwordErrMsg, setPasswordErrMsg] = useState('');
    const [passwordCheckErrMsg, setPasswordCheckErrMsg] = useState('');
    const [answerErrMsg, setAnswerErrMsg] = useState('');

    // 모달창이 열려있는지 닫혀있는지 만들어줄 state변수
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    const emailInputHandler = (e) => {
        setEmail(e.target.value);

        const emailText = e.target.value;

        if(emailText === '') {
            setEmailErrMsg('이메일은 필수 입력 값입니다.');
        }else if(!emailText.includes('@')) {
            setEmailErrMsg('이메일 형식을 지켜주세요');
        }else {
            setEmailErrMsg('');
        }
    }

    const passwordInputHandler = (e) => {
        const passwordText = e.target.value;
        setPassword(passwordText);

        if(passwordText === '') {
            setPasswordErrMsg('비밀번호는 필수 입력 값입니다.');
        }else if(passwordText.length < 6) {
            setPasswordErrMsg('비밀번호는 최소 6글자 이상으로 작성해주세요');
        } else {
            setPasswordErrMsg('');
        }


        if(passwordText !== passwordCheck) {
            setPasswordCheckErrMsg('비밀번호가 일치하지 않습니다fffff');
        }
    }

    const passwordCheckInputHandler = (e)=>{ 
        const passwordCheckText = e.target.value;
        setPasswordCheck(passwordCheckText);
    
        if(passwordCheckText ===''){
          setPasswordCheckErrMsg('비밀번호 확인은 필수 입력 값입니다.');
    
        }else if(passwordCheckText !== password){
          setPasswordCheckErrMsg('비밀번호가 일치하지 않습니다.');
        }else{
          setPasswordCheckErrMsg('');
        }
    
    }

    const onSelectHandler = (e) => {
        setQuestion(parseInt(e.target.value));
        // if(e.target.value === '') {
        //     setanswerErrMsg('이메일찾기 응답은 필수입력 값입니다');
        // }else {
        //     setanswerErrMsg('');
        // }
    }

    const onAnswerInputHandler = (e)=>{
        setAnswer(e.target.value);
        if(e.target.value === ''){
          setAnswerErrMsg('이메일 찾기 응답은 필수 입력 값입니다.');
        }else{
          setAnswerErrMsg('');
        }
    }

    const submitHandler = async (e) => {
        // submit Event가 발생하면 실행되는함수,
        // e에는 발생한 이벤트 객체가 대입이 된다.
        // e.preventDefault() 함수는 이벤트의 기본 동작을 막는 함수이고,
        // submit 이벤트의 기본 동작은 데이터를 전송하는 것이므로, 전송을 막는 것이다.

        e.preventDefault();

        let check = true;

        // 이메일 input 태그 확인
        // state변수 eamil 확인
        
        if(email === '') {
            setEmailErrMsg('이메일은 필수 입력 값입니다.');
            check = false;
        }else if(!email.includes('@')) {
            setEmailErrMsg('이메일 형식을 지켜주세요');
            check = false;
        }else {
            setEmailErrMsg('');
        }
        // 비밀번호 입력 확인
        // state변수 password 확인
        if(password === '') {
            setPasswordErrMsg('비밀번호는 필수 입력 값입니다.');
            check = false;
        }else if(password.length < 6) {
            setPasswordErrMsg('비밀번호는 최소 6글자 이상으로 작성해주세요');
            check = false;
        } else {
            setPasswordErrMsg('');
        }
        
        // 비밀번호 확인 입력 확인
        // state변수 passwordCheck
        if(passwordCheck === '') {
            setPasswordCheckErrMsg('비밀번호 확인은 필수 입력 값입니다.');
            check = false;
        }else if(passwordCheck !== password) {
            setPasswordCheckErrMsg('비밀번호가 일치하지않습니다');
            check = false;
        } else {
            setPasswordCheckErrMsg('');
        }

        // 대답 입력 확인
        // state변수 answer 확인
        if(answer === '') {
            setAnswerErrMsg('이메일찾기 응답은 필수입력 값입니다');
            check = false;
        }else {
            setAnswerErrMsg('');
        }

        // 모든 입력 값들이 정상적으로 입력 되었다면
        // submit
        if(check) {
            console.log(e.target);
            // e.target.submit();
            
            try{
                let res = await axios.post('/api/users', {email, password, question, answer});
                console.log(res);
                setIsOpen(true);
            } catch(err){
                console.log(err);
                if(err.response.data.errCode === 1) {
                    // alert('아이디가 너무 깁니다');
                    alert('입력항목에 너무 긴 항목이 있습니다');
                }else if (err.response.data.errCode === 2) {
                    // alert('중복된 아이디 입니다');
                    setEmailErrMsg('중복된 아이디 입니다');
                } else {
                    alert('서버 문제가 발생햇습니다 잠시 뒤에 다시 시도해 주세요');
                }
            }

            // axios.post('/api/users', {
            //     email,
            //     password,
            //     question,
            //     answer
            // }).then((res)=>{
            //     console.log(res);
            //     // f회원가입이 성공했다면 실행시킬 요소들
            //     // alert("회원가입 성공했습니다!");
            //     setIsOpen(true);
            // }).catch((err) => {
            //     console.log(err);
            //     // 회원가입 실패햇다 했다면 실행시킬 코드
            //     if(err.response.data.errCode === 1) {
            //         // alert('아이디가 너무 깁니다');
            //         setEmailErrMsg('아이디가 너무 깁니다');
            //     }else if (err.response.data.errCode === 2) {
            //         // alert('중복된 아이디 입니다');
            //         setEmailErrMsg('중복된 아이디 입니다');
            //     } else {
            //         alert('서버 문제가 발생햇습니다 잠시 뒤에 다시 시도해 주세요');
            //     }
            //     alert("이미 중복된 아이디가 존재합니다");
            // });
        }
    }

    // 모달창 버튼이 클릭되었을 때
    const onModalClick = () => {
        // 로그인 페이지로 이동,
        // 또한 replace써서 뒤로가기 못하게 하기
        navigate('/login', {replace: true});
    }

    const LoginPage = ()=> {
        // 유호성 검사
        // 이메일 입력시 비어있으면안됨, 이메일형식(@포함)
        // 비밀번호입력시 비어있으면 안됨, 6자리 이상()

        // submit 할때도 이메일, 비밀번호 잘 입력되었는지 확인
        // 
    }
    return(
        <BgImg>
            <Wrap>
                <CancelIcon><CloseIcon/></CancelIcon>
                <AuthBox>
                    <h1>회원가입</h1>
                    <AuthBody>
                        <AuthForm onSubmit={submitHandler} method="POST" action="/api/users">
                            <InputBoxWrap>
                                <div className="input-box">
                                    <Input name="email" onChange={emailInputHandler} type="text" placeholder="아이디"/>
                                    <ErrMsg>{emailErrMsg}</ErrMsg>
                                </div>
                                <div className="input-box">
                                    <Input name="pw" onChange={passwordInputHandler} type="password" placeholder="비밀번호"/>
                                    <ErrMsg>{passwordErrMsg}</ErrMsg>
                                </div>
                                <div className="input-box">
                                    <Input onChange={passwordCheckInputHandler} type="password" placeholder="비밀번호 확인"/>
                                    <ErrMsg>{passwordCheckErrMsg}</ErrMsg>
                                </div>
                                <div className="input-box">
                                    <Select name="question" onChange={onSelectHandler}>
                                        <Option value={1}>내가 태어난 곳은</Option>
                                        <Option value={2}>어린시절 나의 별명은</Option>
                                        <Option value={3}>나의 강아지 이름은?</Option>
                                    </Select>
                                    <Input name="answer" onChange={onAnswerInputHandler} type="text" placeholder="이메일을 찾을 떄의 질문에 답하세요"/>
                                    <ErrMsg>{answerErrMsg}</ErrMsg>
                                </div>
                            </InputBoxWrap>
                            <Button>회원가입하기</Button>
                        </AuthForm>
                    </AuthBody>
                </AuthBox>
            </Wrap>
            <ModalWrap isOpen={isOpen}>
                <Modal>
                    <h1>성공!</h1>
                    <p>확인을 누르시면 로그인 페이지로 이동합니다</p>
                    <button onClick={onModalClick}>확인</button>
                </Modal>
            </ModalWrap>
        </BgImg>
    );
}

const ModalWrap = styled.div`

    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    background-color: rgba(0,0,0,0.8);

    display: ${(props)=>{return props.isOpen ? 'flex' : 'none'}};
    justify-content: center;
    align-items: center;
`;

const Modal = styled.div`
    width: 450px;
    background-color: white;

    border-radius: 16px;
    display: flex;
    flex-direction: column;

    align-items: center;
    padding: 30px;
`;

export default JoinPage;