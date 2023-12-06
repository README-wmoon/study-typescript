import { useParams } from "react-router-dom";
import ActivityCommentSection from "../../components/activity/activityCommentSection";
import ActivityDetailSection from "../../components/activity/activityDetailSection";
import DashboardLayout from "../../components/common/layout";
import { useAuth } from "../../hooks/hooks";
const ActivityDetailPage = () => {
    useAuth()
   const params = useParams();
//    console.log(params);
    return(
        <DashboardLayout target="활동게시판">
            <h1>{params.id}게시글 상세 페이지</h1>
            <ActivityDetailSection activityId={params.id} />
            <ActivityCommentSection activityId={params.id} />
        </DashboardLayout>
    );
}

export default ActivityDetailPage;