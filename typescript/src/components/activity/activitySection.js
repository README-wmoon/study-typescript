import { Pagination } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {  ActivityBody, ActivityFooter, ActivityInput, ActivitySectionHeader, ActivitySelect, ActivityWriteBtn } from "../../styles/dashboard/activity.styles";
import ActivityCard from "./activityCard";
import {debounce} from "lodash";
import { UserContext } from "../../App";

const ActivitySection = () =>{
    const cntPerPage = 4;
    const [activityList, setActivityList] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [order, setOrder] = useState('dateDesc');
    // 처음에는 검색이 없으니 빈문자열로 넣었음
    const [searchText, setSearchText] = useState('');
    
    const {accessToken} = useContext(UserContext);

    useEffect(()=>{
    let tmp = async () => {

        try{
            if(accessToken === null) {
                return;
            }

            let res = await axios.get(
                        `/api/activities?order=${order}&limit=${cntPerPage}&page=${currentPage}&q=${searchText}`,
                        {headers : {Authorization : `Bearer ${accessToken}`}}
            );
            // res.data.total_cnt ==> 전체 게시물 갯수 --> 계산 총 필요한 페이지 갯수
            // 전체게시물갯수   한페이지당게시물갯수    총페이지
            // 10               3                       4
            // 총페이지 갯수 = 올림(전체게시물갯수 / 한페이지당게시물 갯수)
           setTotalPage(Math.ceil(res.data.total_cnt / cntPerPage));
           setActivityList(res.data.activityList);

        } catch(err){
            console.log(err);
            alert('잠시 게시글을 불러오다 문제가 발생했습니다');
        }
    }
    
    tmp();
    }, [currentPage, order, searchText, accessToken]);

    const onPageChange = (e, value) => {
        setCurrentPage(value);
    }

    const onOrderChange = (e)=> {
        // console.log(e.target.value);
        setOrder(e.target.value);
        setCurrentPage(1);
    }

    const onSearchChange = debounce((e) => {
        setSearchText(e.target.value);
        setCurrentPage(1);
    }, 500);

    return(
        <section>
            <ActivitySectionHeader>
                <ActivityInput 
                    onChange={onSearchChange} 
                    placeholder="제목으로 검색"/>
                <ActivitySelect value={order} onChange={onOrderChange}>
                    <option value="dateDesc">최신순</option>
                    <option value="dateAsc">오래된순</option>
                    <option value="like">좋아요순</option>
                    <option value="view">조회수순</option>
                </ActivitySelect>
                <ActivityWriteBtn>글 쓰기</ActivityWriteBtn>
            </ActivitySectionHeader>
            <ActivityBody>
                {
                    activityList.map((el) => <ActivityCard key={el.id} activity={el}/>)
                }
            </ActivityBody>
            <ActivityFooter>
                <Pagination onChange={onPageChange} page={currentPage} count={totalPage}/>
            </ActivityFooter>
        </section>
    );
}

export default ActivitySection;