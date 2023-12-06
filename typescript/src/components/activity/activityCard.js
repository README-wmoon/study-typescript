import { CardLikeButton, CardContent, CardDetail, CardImg, CardTitle, CardWrap } from "../../styles/dashboard/activityCard.styles";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";
const ActivityCard = (props) => {
    // console.log(props.activity.imgURL)
    const [isLiked, setIsLiked] = useState(props.activity.liked === 'yes');

    const navigate = useNavigate();
    const {accessToken} = useContext(UserContext)
    const onLikedClick = async() => {
        if(accessToken === null) {
            alert('로그인 만료됨...!!!!');
            return;
        }
        if(isLiked === false){ // 하트가 안눌린 상태에서 하트를 누른것
            // 지금 로그인한사람이, 해당 게시물에 하트를 누른것 --> 데이터베이스 테이블에 추가
            // id:id 에서 왼쪽은 key값 오른쪽 id는 위의 매개변수로 받아온것 이다(생략되서 id로만 써도됨)
            try{
                await axios.post('/api/like', 
                    {id:props.activity.id}, 
                    {headers:{Authorization:`Bearer ${accessToken}`}}
                );
                setIsLiked(true);
            }catch(err){
                console.log(err);
                alert('현재 서버에 문제가 있습니다 잠시후 다시 시도하세요!')
            }
        }else { //하트가 눌린 상태에서 하트를 해제한것
            // 지금 로그인한 사람이 해당 게시물 하트 해제한것 --> 테이블에서 삭제
            try{
                axios.delete('/api/like', {
                    data : {id:props.activity.id}, 
                        headers:{Authorization:`Bearer ${accessToken}`}
                });
                setIsLiked(false);
            }catch(err){
                console.log(err);
                alert('잠시후 다시 실행 하세요')
            }
        }
    }

    return(
        <CardWrap>
            <CardImg imgURL = {props.activity.img_url[0]}>
                <CardLikeButton onClick={onLikedClick}>
                    {isLiked ? <FavoriteIcon style={{color:'red'}} /> : <FavoriteBorderIcon/>}
                </CardLikeButton>
            </CardImg>
            <CardContent>
                <CardTitle>{props.activity.title}</CardTitle>
                <CardDetail>
                    {props.activity.content}
                </CardDetail>
                <CardDetail>
                    작성자 : {props.activity.writer_email}
                </CardDetail>
                <CardDetail>
                    작성일자 : {props.activity.created_date}
                </CardDetail>
                <CardDetail>좋아요: {props.activity.activity_like}</CardDetail>
                <CardDetail>조회수: {props.activity.activity_view}</CardDetail>
                <button onClick={()=>{
                    navigate(`/activity/${props.activity.id}`)
                }}>자세히 보기</button>
            </CardContent>
        </CardWrap>
    );
}

export default ActivityCard;