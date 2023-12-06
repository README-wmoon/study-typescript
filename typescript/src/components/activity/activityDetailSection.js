import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BoardContent, BoardDetailWrap, BoardInfoWrap, BoardTitle, WriteBtn } from "../../styles/dashboard/activityDetail.styles";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

const ActivityDetailSection = (props)=> {
    
    // null 값을 쓰면 다 null 값이 나오지만 activity?.title로 쓰면 undefined가 나와 title이 나온다.
    const [activity, setActivity] = useState(null);
        // res.data안에 writeEmail이 없다 따라서 
        // 첫번쨰 방법
        // writerEmail = res.data.writer_eamil 키값을 가져오는것

        // 두번쨰 방법
        // app.js 515번쨰 줄에 id: result1[0].writer_email front 개발자랑 협의해서 하면됨 
        // 첫번째 방법으로 씀
        // 밑에 초기화를 쓸필요가 없음
        // id: 0,
        // title: '제목이 올 자리',
        // content: '내용이 올 자리',
        // writerEmail : '작성자 이메일이 올 자리',
        // createdDate : '작성일자가 올 자리',
        // updatedDate : '수정일자가 올 자리',
        // view : 0,
        // likeCnt : 0,
        // liked : 'no',
        // imgUrl : []
    // });
    const {accessToken} = useContext(UserContext);

    const navigate = useNavigate();
    
    useEffect(()=>{
        let tmp = async ()=> {
            if(accessToken === null) return;
            try{
                let res = await axios.get(`/api/activities/${props.activityId}`, {
                    headers:{Authorization:`Bearer ${accessToken}`}
                });
                setActivity(res.data);
                // 조회수 증가


            }catch(err){
                console.log(err)
                alert('오류가 발생함')
            }
        }

        tmp();
    }, [props.activityId, accessToken]);

    const onLikedClick = async() => {
        if(activity.liked === 'yes'){
            try{
                await axios.delete('/api/like', {
                    data:{id:activity.id},
                    headers: {Authorization:`Bearer ${accessToken}`}
                });
                setActivity({...activity, liked:'no', activity_like : activity.activity_like - 1});

            }catch(err){
                console.log(err)
                alert('좋아요 현재 수정 불가');
            }
        } else {
            try{
                await axios.post('/api/like', 
                    {id:activity.id},
                    {headers:{Authorization:`Bearer ${accessToken}`}}
                );
                setActivity({...activity, liked:'yes', activity_like:activity.activity_like + 1});


            }catch(err){
                console.log(err);
                alert('오류발생임')
            }
        }
    }

    let onDeleteClick = async() => {
        try{
            await axios.delete(`/api/activities/${props.activityId}`, {headers: {Authorization: `Bearer ${accessToken}`}});
            navigate('/activity', {replace: true});

        }catch(err){
            alert('삭제 실패.ㅠㅠ');
        }
        
    }

    return(
        <section>
            <BoardDetailWrap>
                <BoardTitle>
                    {activity?.title}
                    <div style={{display: 'flex', alignItems:'baseline'}}>
                        <span>좋아요: {activity?.activity_like} </span>
                        <span onClick={onLikedClick}>
                            {activity?.liked === 'yes' ? <FavoriteIcon style={{color:'red'}} /> : <FavoriteBorderIcon />}
                        </span>
                    </div>
                </BoardTitle>
                <BoardInfoWrap>
                    <p>작성자</p>
                    <p>{activity?.writer_email}</p>
                    <p>조회수</p>
                    <p>{activity?.activity_view}</p>
                </BoardInfoWrap>
                <BoardInfoWrap>
                    <p>작성일짜</p>
                    <p>{activity?.created_date}</p>
                    <p>수정일자</p>
                    <p>{activity?.updated_date}</p>
                </BoardInfoWrap>
                <BoardContent>
                    {activity?.img_url.map((img)=>
                            <div> <img style={{width: '50%'}} src={img} alt="이미지"/> 
                            </div>)}
                    {activity?.content}
                </BoardContent>
            </BoardDetailWrap>
            {
                activity?.owner === true &&
                <div style={{alignSelf: 'flex-end',display: 'flex', columnGap: '10px'}}>
                    <WriteBtn>수정하기</WriteBtn>
                    <WriteBtn onClick={onDeleteClick} style={{backgroundColor: 'red'}}>삭제하기</WriteBtn>
                </div>
            }
        </section>
    );
}

export default ActivityDetailSection;