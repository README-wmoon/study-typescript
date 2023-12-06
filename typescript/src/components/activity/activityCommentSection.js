import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { CommentInput, CommentInputWrap, CommentListWrap, CommentWriteBtn } from "../../styles/dashboard/activityComment.styles";
import CommentBlock from "../comment/commentBlock";
import {useInView} from "react-intersection-observer";

const ActivityCommentSection = (props)=>{
    const [commentList, setCommentList] = useState([]);
    const [content, setContents] = useState('');
    const {accessToken} = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEnd, setIsEnd] = useState(false); // 댓글을 끝까지 다 가져왔다면 true 아니면 false가 들어있음

    // 앞에있는 ref는 우리가 관찰할 요소를 알려주는데 사용
    // 뒤에있는 inView는 우리가 관찰할 요소가 화면에 나타나면 true
    // 아니면 false 가 들어있는 변수
    const [ref, inView] = useInView();

    // body에서 객체를 가져오려면 useEffect 써라
    useEffect(()=>{
        let tmp = async ()=>{
            if(accessToken === null) return;
            if(inView === false) return;
            if(isEnd === true) return;
            try{
                let res = await axios.get(`/api/comments?activityId=${props.activityId}&limit=${3}&page=${currentPage}`, {
                    headers:{Authorization: `Bearer ${accessToken}`}
                })
                setCurrentPage(currentPage + 1);
                if(res.data.length === 0) {
                    setIsEnd(true);
                }
                setCommentList([...commentList , ...res.data]);
            }catch(err){
                alert('댓글목록 오류')
            }
        }

        tmp();
    }, [props.activityId, accessToken, inView]);
    
    const onCommentClick = async() =>{
        try{
            let res = await axios.post('/api/comments', {
                    content, 
                    activityId: props.activityId
                },
                {headers:{Authorization:`Bearer ${accessToken}`}}
            );
            // 댓글목록을 끝까지 다 가져온 상태라면 직접 화면에도 보이게 추가
            if(isEnd === true) {
                setCommentList([...commentList, res.data]);
            }
            alert('댓글 추가 성공!!');

        }catch(err) {
            alert('댓글 추가 중 오류 발생...!!!');
        }
    }

    // 댓글 id를 매개변수로 받아서 해당 id를 가진 댓글 삭제
    const onDeleteClick = async(id) => {
        // 삭제하는 것
        let ddd = window.confirm('정말 삭제하시겠습니까?');
        // console.log(ddd);
        if(ddd === false) return;

        // 확인 눌렀을때 실행됨
        // express 에게 삭제 요청
        try{
            await axios.delete('/api/comments', {data:{id: id}});
            // !== 하는 이유 id가 같은거 뺴고는 남겨두기 위해서 commentList에
            setCommentList(commentList.filter((el)=>{return el.id !== id}));
            alert('댓글 삭제 성공~');
        }catch(err){
            alert('댓글 삭제 실패, 잠시후 다시 시도해보세요!');
        }
    }

    return(
        <section>
            <CommentInputWrap>
                <CommentInput onChange={(e)=>{setContents(e.target.value)}} value={content}/>
                <CommentWriteBtn onClick={onCommentClick}>댓글달기</CommentWriteBtn>
            </CommentInputWrap>
            <CommentListWrap>
                {
                    commentList.map((comment)=> <CommentBlock 
                        key={comment.id} 
                        onDeleteClick={onDeleteClick} 
                        comment={comment}
                    /> )
                }
                <div ref={ref} style={{backgroundColor:'red'}}>ddddd</div>
            </CommentListWrap>
        </section>
    );
}

export default ActivityCommentSection;