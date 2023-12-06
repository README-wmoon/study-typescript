import DashboardLayout from "../../components/common/layout";
import { AddBox, Title } from "../../styles/dashboard/career.styles";
import CareerViewTable from "../../components/career/careerViewTable";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/hooks";

const CareerPage = ()=>{
    useAuth();

    return(
        <DashboardLayout target="경력">
        <Title>나의 경력을 관리하세요</Title>
        <p>회사, 직위, 일자를 입력한 후 경력을 추가해 보세요!</p>
        
        <CareerViewTable/>
        </DashboardLayout>
    );
}

export default CareerPage;
