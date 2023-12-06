import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { ActivityForm, ActivityInputWrap, ImgInputWrap } from "../../styles/dashboard/activityWrite.styles";


    const ActivityCU = (props) => {
        // 작성페이지에서 사용되면 props.isEdit에 false들어있음
        // 수정페이지에서 사용되면 props.isEdit에 true 들어있음

        const navigate = useNavigate();

        const [imgList, setImgList] = useState(props.isEdit ? 
            props.activity.img_url.map((el)=>{return {id:el, previewUrl:el, origin:null}})
            : []);
        const [formInfo, setFormInfo] = useState({
            values: {
                title:props.isEdit ? props.activity?.title : '', 
                content:props.isEdit ? props.activity?.content : ''
            },
            errors: {title:props.isEdit ? '' : '제목은 필수 입력값입니다.', 
            content:props.isEdit ? '' : '내용은 필수 입력값입니다.'},
            toched : {title:false, content:false}
    })

    const [deleteImg, setDeleteImg] = useState([])

    const {accessToken} = useContext(UserContext);

   
    const handleBlur = (e) => {
        let cpy = JSON.parse(JSON.stringify(formInfo));
        cpy.toched[e.target.name] = true;
        setFormInfo(cpy);
    }

    // 제목 혹은 내용 입력시 실행되는 함수
    const handleChange = (e)=>{
        // console.log(e);
        // e.target.name이 title 이면 formInfo.values.title을 변경
        // e.target.name이 content 이면 formInfo.values.content을 변경
        // e.target.value
        let cpy = JSON.parse(JSON.stringify(formInfo));
        let inputValue = e.target.value;
        if(e.target.name === 'title'){ // 사용자가 제목에 입력한 부분
            if(inputValue.length === 0){
                cpy.errors[e.target.name] = '제목은 필수 입력 값입니다.';
            } else if(inputValue.length > 30) {
                cpy.errors[e.target.name] = '제목은 30글자 이하로 작성해주세요.';
            }else {
                cpy.errors[e.target.name] = '';
            }
        }else if(e.target.name === 'content'){ // 사용자가 내용에 입력한 부분
            if(inputValue.length === 0) {
                cpy.errors[e.target.name] = '내용은 필수 입력 값입니다.';
            }else if(inputValue.length > 500) {
                cpy.errors[e.target.name] = '내용은 500글자를 초과할 수 없습니다.';
            }else {
                cpy.errors[e.target.name] = '';
            }

        }

        // console.log('복제 직후 cpy', cpy);
        cpy.values[e.target.name] = inputValue;
        // cpy.handleChange = formInfo.handleChange;
        // console.log('수정후 cpy', cpy);
        setFormInfo(cpy);
    }


    console.log(imgList);

    const onImgChanged = (img, e) => {
        // 이미 이미지가 업로드 되었던것을 다시 선택해서 실행될때는
        // 기존의 배열에서 기존에 선택된 이미지를 지우기
        // 기존의 배열에서 id가 동일한 요소 찾기
        // 기존 imgList 라는 state변수(배열) 은 변하면 안되기 떄문에 똑같은 요소를 갖고있는 복제본 생성
        if(props.isEdit) {
            if(!deleteImg.includes(img.id) && img.origin === null){
                setDeleteImg([...deleteImg, img.id]);
            }
        }

        let cpy = JSON.parse(JSON.stringify(imgList));

        let target = cpy.find((el)=>{return el.id === img.id});
        
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        // target.previewUrl = 'fwafasfa';
        reader.onload = () => {
            target.previewUrl = reader.result;
            target.origin = e.target.files[0];
            setImgList(cpy);
        }


    }

    const onImgSelected = (e) => {
        // 새롭게 선택한 이미지를 배열에 넣어준다
        let now = new Date();
        let id = now.toString();
        console.log(e);
        // e.target.files[0] // -> 내가 선택한 파일에 대한 여러가지 정보가 들어있는 객체
    
        // 용량검사 (용량이 2048kb보다 높다면 허용하는 용량을 초과했습니다..)
        // 내가 업로드한 파일을 url로 만들어야함
        let reader = new FileReader();

        reader.readAsDataURL(e.target.files[0]);

        reader.onloadend = () => {
            console.log(reader.result);
            setImgList([...imgList, {id: id, previewUrl : reader.result, origin: e.target.files[0]}])
        }
    }

    const onImgDeleted = (img) => {
       setImgList(imgList.filter((e)=>e.id !== img.id));
       if(img.origin === null && props.isEdit) {
           setDeleteImg([...deleteImg, img.id]);
       }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        let cpy = JSON.parse(JSON.stringify(formInfo));
        cpy.toched.title = true;
        cpy.toched.content = true;
        setFormInfo(cpy);

        // 모든 제목하고, 내용이 정상적으로 입력이 되었다면
        // 제목 에러메시지가 ''이고 내용 에러메시지가 '' 라면 정상적으로 모든 값이 입력됨
        if(formInfo.errors.title === '' && formInfo.errors.content === ''){
            // alert('정상적인 값 입력됨 서버로 전송!!');
            const fd = new FormData();
            imgList.forEach((img)=>{
                if(img.origin !== null) {
                    fd.append('images', img.origin);
                }
            });
            fd.append('title', formInfo.values.title);
            fd.append('content', formInfo.values.content);
            // fd 안에 images 에는 이미지 파일들이 들어있음
            if(props.isEdit) {
                fd.append('deleteImg', JSON.stringify(deleteImg));
                // 위에꺼랑 같은데 더 쉽게 할 수 있는법
                // 하지만 요거는 하나는 삭제할 수 있는데 다른거는 삭제를 할떄 문자열로 나옴
                // deleteImg.forEach((imgUrl) => fd.append('deleteImg', imgUrl));
                // fd.append('deleteImg', deleteImg);
                fd.append('id', props.activityId);
                try{
                    let res = await axios.put('/api/activities', fd, {headers:{Authorization: `Bearer ${accessToken}`}});
                    alert('수정 완료!!');
                    navigate(`/activity/${res.data.id}`, {replace:true});
                }catch(err){
                    console.log(err);
                    alert('오류발생');
                }
            }else {
                try{
                    let res = await axios.post('/api/activities', fd, {headers:{Authorization: `Bearer ${accessToken}`}});
                    // res.data.id; // 방금 추가된 게시글의 id가 들어있다
                    console.log(res.data.id);
                    alert('생성완료', res.data.id);
                    navigate(`/activity/${res.data.id}`, {replace:true});
    
                }catch(err){
                    console.log(err);
                    alert('err');
                }
            }
        
        } 
    }
    
    console.log('delete : ', deleteImg);

    return(
        <section>
            <h1>{props.isEdit ? `${props.activityId}번 게시글 수정하기` : '새 게시글 작성하기'}</h1>
            <ActivityForm onSubmit={handleSubmit}>
                <ActivityInputWrap>
                    <label htmlFor="title">게시글 제목</label>
                    <input
                        onBlur={handleBlur} 
                        onChange={handleChange}
                        value={formInfo.values.title} 
                        name="title" id="title"/>
                    {formInfo.toched.title && <p>{formInfo.errors.title}</p>}
                </ActivityInputWrap>
                <ActivityInputWrap>
                    <label htmlFor="writerEmail">작성자</label>
                    <input disabled value={props.isEdit ? props.activity?.writer_email : props.userEmail} id="writerEmail"/>
                </ActivityInputWrap>
                <ActivityInputWrap>
                    <label htmlFor="content">내용</label>
                    <textarea 
                        onBlur={handleBlur}
                        value={formInfo.values.content}
                        onChange={handleChange} name="content" id="content"></textarea>
                    {formInfo.toched.content && <p>{formInfo.errors.content}</p>}
                </ActivityInputWrap>
                <ActivityInputWrap>
                    <h4>이미지</h4>
                    <ImgInputWrap>
                        {imgList.map((img)=>
                            <label style={{position: 'relative'}} key={img.id}>
                                <img style={{
                                    width:'100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center' 
                                }} src={img.previewUrl}/>                         
                                <input onChange={(e)=>onImgChanged(img, e)} accept="image/*" type="file" />
                                <button 
                                    style={{position: 'absolute', top: '0', right: '0'}} 
                                    type="button"
                                    onClick={()=>onImgDeleted(img)}
                                    >삭제하기</button>
                            </label>

                        )}
                        <label>
                            +                     
                            <input onChange={onImgSelected} accept="image/*" type="file" />
                        </label>
                    </ImgInputWrap>
                </ActivityInputWrap>
                <button>글 {props.isEdit ? '수정' :'작성'}하기</button>
            </ActivityForm>
        </section>
    );
}

export default ActivityCU;