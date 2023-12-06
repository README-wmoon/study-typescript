import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../../App";
import { Comment, CommentBtn, CommentDate, CommentHeader, CommentItem, CommentWriter } from "../../styles/dashboard/activityComment.styles";

const CommentBlock = (props) => {
    const [comment, setComment] = useState(props.comment);
    let onDeleteClick = props.onDeleteClick;
    const [isEdit, setIsEdit] = useState(false);
    const [content, setContent] = useState(comment.content);

    const {accessToken} = useContext(UserContext);

    const onUpdateComment = async ()=> {
        if(accessToken === null) return;

        // express 한테 기존댓글을 수정해줘~
        try{
            let res = await axios.put('/api/comments', {
                id: comment.id,
                // content: content // 똑같으니 생략해도됨
                content
            }, {headers: {Authorization: `Bearer ${accessToken}`}});
            // res.data => 수정 완료된 댓글이 객체로 들어있다
            setIsEdit(false);
            setComment(res.data);

        }catch(err){
            alert('댓글 수정 실패!!');
        }
    } 

    return(
        <CommentItem>
            <CommentHeader>
                <CommentWriter>
                    작성자 id : {comment.writer_email}
                </CommentWriter>
                <CommentDate>(작성일){comment.created_date}</CommentDate>   
                <CommentDate>(수정일){comment.updated_date}</CommentDate>   
                {comment.owner && <CommentBtn onClick={()=>onDeleteClick(comment.id)}>삭제</CommentBtn>}
            </CommentHeader>
            { isEdit ? 
            <input onBlur={onUpdateComment} onChange={(e)=>setContent(e.target.value)} value={content} /> 
            : <Comment onClick={()=>{
                if(comment.owner){ 
                    setIsEdit(true)
                }
            }}>{comment.content}</Comment>}
        </CommentItem>
    );
}

export default CommentBlock;