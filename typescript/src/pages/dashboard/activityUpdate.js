import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import ActivityCU from "../../components/activity/activityCU";
import DashboardLayout from "../../components/common/layout";
import { useAuth } from "../../hooks/hooks";

const ActivityUpdatePage = () => {
    useAuth();

    const {accessToken} = useContext(UserContext);

    const [activity, setActivity] = useState(null);

    let params = useParams();

    const navigate = useNavigate();

    useEffect(()=>{
        const tmp = async()=>{
            if(accessToken === null) return;
            try{
                let res = await axios.get(`/api/activities/${params.id}`, {
                    headers:{Authorization:`Bearer ${accessToken}`}
                });
                if(res.data.owner === false) {
                    alert('잘못된 접근입니다!! 사유: 작성자가 아님');
                    navigate('/activity', {replace: true});
                    return;
                }

                setActivity(res.data);

            }catch(err){
                console.log(err)
                alert('오류가 발생함');
            }
        }

        tmp();
    }, [accessToken]);

    
    return(
        <DashboardLayout target="활동게시판">
            {activity ? <ActivityCU activity={activity} isEdit={true} activityId = {params.id}/>
            : <h1>로딩중</h1>}
        </DashboardLayout>
    );
}

export default ActivityUpdatePage;