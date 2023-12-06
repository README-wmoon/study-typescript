import { useContext, useEffect, useState } from "react";
import { AddBox } from "../../styles/dashboard/career.styles";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from "axios";
import { UserContext } from "../../App";
import CareerRow from "./careerRow";

const CareerViewTable = ()=>{
  const [careerList, setCareerList] = useState([]);
  
   // 토큰이 저장되어 있는 전역 상태변수 가져오기 
   const {accessToken, setAccessToken} = useContext(UserContext);

  useEffect( ()=>{
    // CareerViewTable이 최초 렌더링 될때
    // express한테 career목록좀 가져다줘 라고 요청
    const fetchCareerList = async ()=>{
      if(accessToken === null) return;
      try{
        let res = await axios.get('/api/career', 
          {headers : {Authorization: `Bearer ${accessToken}`}}
        );
        setCareerList(res.data);
      }catch(err){
        console.log(err);
      }
    }

    fetchCareerList();

  }, [accessToken]);

  // state 변수 네개 , 사용자가 input 태그에 입력한 값을 기억할 용도
  const [company, setCompany] = useState('');
  const [position , setPosition] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

 


  const onAddCareer = async()=>{
    if(company === ''){
      alert('회사명은 필수로 입력해 주세요!');
      return;
    }

    if(position === ''){
      alert('직책은 필수로 입력해 주세요!');
      return;
    }

    if(startDate === ''){
      alert('시작일은 필수로 입력해 주세요!');
      return;
    }

    // 시작일이 오늘 날짜보다 늦으면 안됨
    const today = new Date();
    const targetStartDate = new Date(startDate);
    if(targetStartDate > today){
      alert('시작일은 오늘 날짜 이후로는 설정할 수 없습니다');
      return;
    }

    // 종료일은 비어있어도 됨
    if(endDate !== ''){
      const targetEndDate = new Date(endDate);
      // console.log(targetEndDate);
      if(targetStartDate > targetEndDate){
        alert('종료일은 시작일 이후로 설정이 가능합니다')
        return;
      }
  
      if(targetEndDate > today){
        alert('종료일은 오늘 날짜 이후로 설정할 수 없습니다');
        return;
      }

    }


    // 정상적으로 실행되는 코드
    try{
      let res = await axios.post('/api/career',
        {company, position, startDate, endDate},
        {headers: {Authorization: `Bearer ${localStorage.getItem('accessToken')}`}} 
      );
      // res.data 가 내가 방금 추가한 객체
      //성공했을때 뭔가 할것
      alert('추가가 완료했습니다!');
      // 새로고침?!
      // window.location.reload();


      // 새로고침 대신 생각해 볼 수 있는 것
      // 방금 추가한 객체를 이미 20개의 객체가 요소로 들어있는
      // 배열의 마지막 요소로 추가
      setCareerList( [ ...careerList ,  res.data] );

    }catch(err){
      console.log(err);
      alert('서버에서 오류가 발생했으니 잠시후 다시 시도해주세요');
    }

  }

  // td셀 클릭시 삭제하는 함수
  const onDeleteRow = async (id)=>{
    // id (4) 에는 몇번 객체가 삭제되는지에 대한 정보가 들어있음
    try{
      let res = await axios.delete('/api/career', { data : {id} } );
      alert('삭제가 성공 했습니다');

      // careerList에서 삭제된 id를 가진 요소를 삭제하고 변경
      // re-rendering되면서 마치 우리 눈에는 사라진 것처럼 보임
      let cpy = careerList.filter(e=>e.id !== id);
      setCareerList(cpy);
    }catch(err){
      alert('삭제 도중 문제가 발생했습니다!');
    }
  }

// 전체 체크가 되었는지 아닌지 확인하기 위한 state 변수
  const [isSelectAll, setIsSelectAll] = useState(false);

// 차라리 전체 체크 되었다 아니다 이분법적 접근x
// 개별적으로 체크된 요소의 id를 배열에 보관
// rendering 할 때 배열안에 있는 행을 그릴때는 체크된채로,
// 배열 안에 없는 행을 그릴때는 해제된채로
  const [checkedRowId, setCheckedRowId] = useState([]);

// 개별적으로 체크 했을 떄
  const onSelect = (id) => {
    // console.log('ㅇㅇㅇ');
    if(checkedRowId.includes(id)) {
       setCheckedRowId(checkedRowId.filter((el)=> el !== id));
       setIsSelectAll(false);
       return;
    }
    setCheckedRowId([...checkedRowId, id]);
  }

//   전체선택(표의 헤더부분에 있는 체크박스 클릭시 실행)
    const onSelectAll = (e) => {
        // console.log(e.target.checked);
        // setIsSelectAll(e.target.checked);
        if(e.target.checked) {  // 체크 되어 실행된다면
           setCheckedRowId(careerList.map((e)=>e.id));
           setIsSelectAll(true);
        } else {  // 체크 해제되어 실행 된다면
            setCheckedRowId([]);
            setIsSelectAll(false);
        }
    }

    const deleteAll = async() => {
        // 익스프레스한테 선택된 id를 모두 삭제 요청
        // axios.delete('/api/career', {data: {id: checkedRowId}})
        let cpy = careerList;
        try{
          for(let i=0; i<checkedRowId.length; i++) {
            let id = checkedRowId[i];
            await axios.delete('/api/career', {data : {id}})
            //    setCareerList(careerList.filter((e)=> e.id !== id));
            //  setCareerList((cl)=>{return cl.filter((e)=> e.id !== id)})
            cpy = cpy.filter(row => row.id !== id);
          }
          setCareerList(cpy);
        }catch(err){
          console.log(err);
          alert('삭제 하는 도중 문제가 발생하였습니다!')
        }
        
        // checkedRowId.forEach(async (id)=>{
        //     try{
        //         await axios.delete('/api/career', {data : {id}})
        //     //    setCareerList(careerList.filter((e)=> e.id !== id));
        //       //  setCareerList((cl)=>{return cl.filter((e)=> e.id !== id)})
        //       cpy = cpy.filter(row => row.id !== id);
        //       setCareerList(cpy);
        //     }catch(err){
        //         console.log(err);
        //         alert('삭제 하는 도중 문제가 발생하였습니다!')
        //     }

        // });

        // 한번에 변경
        // 기존 careerList에서 삭제한 요소들을 제외한 배열 만들기
      
    }

  return(
    <>
      <section style={ {marginBottom:'50px'} }>
        <AddBox>
          <thead>
            <tr>
              <th rowSpan={2}>회사명(활동)</th>
              <th rowSpan={2}>직책(활동 내용)</th>
              <th colSpan={2}>활동 일자</th>
            </tr>
            <tr>
              <th>시작일</th>
              <th>종료일</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input onChange={e=>setCompany(e.target.value)}/></td>
              <td><input onChange={e=>setPosition(e.target.value)}/></td>
              <td><input onChange={e=>setStartDate(e.target.value)} type="date"/></td>
              <td><input onChange={e=>setEndDate(e.target.value)} type="date"/></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}> <button onClick={onAddCareer}>추가하기!</button> </td>
            </tr>
          </tfoot>
        </AddBox>
      </section>
      <section>
        <AddBox>
          <thead>
            <tr>
              <th>
                <input 
                    onChange={onSelectAll} 
                    type="checkbox"
                    checked={isSelectAll}
                    />
              </th>
              <th>회사명</th>
              <th>직책</th>
              <th>일자</th>
              <th onClick={deleteAll}><DeleteOutlineIcon/></th>
            </tr>
          </thead>
          <tbody>
            {careerList.map(( e )=> <CareerRow key={e.id} career={e} checkedRowId={checkedRowId} onSelect={onSelect} onDeleteRow={onDeleteRow}/>)}
          </tbody>
        </AddBox>
      </section>
    </>
  );
}

export default CareerViewTable;