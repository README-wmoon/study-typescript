import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import ActivityCU from "../../components/activity/activityCU";
import DashboardLayout from "../../components/common/layout";
import { useAuth } from "../../hooks/hooks";

const ActivityWritePage = () => {
    useAuth();

    const [userEmail, setUserEmail] = useState('');

    const {accessToken} = useContext(UserContext);


     // 로그인 한 사람 이메일 정보 가죠오기
     useEffect(()=>{
        const tmp = async()=>{
            if(!accessToken) return;
            let res = await axios.get('/api/loggedInEmail', {
                headers:{Authorization:`Bearer ${accessToken}`}
            });
            setUserEmail(res.data);
            
        }

        tmp();


    }, [accessToken]);

    return(
        <DashboardLayout target="활동게시판">
            <ActivityCU isUpdate={false} userEmail = {userEmail}/>
        </DashboardLayout>
    )
}

export default ActivityWritePage;