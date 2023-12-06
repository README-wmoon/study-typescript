import styled from "@emotion/styled";

export const CardWrap = styled.div`
    box-shadow: 3px 4px 12px rgba(0, 0, 0, 0.08);
    border-radius: 6px;
    overflow: hidden;
    width: 350px;
`;

export const CardImg = styled.div`
    background-image: url(${(props)=>{return props.imgURL === undefined ? 'activity-default.jpg' : props.imgURL}});
    height: 250px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    position: relative;
`;

export const CardContent = styled.div`
    padding: 15px 20px;
`;

export const CardTitle = styled.h2`
    font-size: 18px;
    color: black;
    margin: 5px 0;
`;

export const CardDetail = styled.p`
    font-size 16px;
    color: silver;
    margin: 5px;
`;

export const CardLikeButton = styled.div`
    position: absolute;
    top: 20px;
    left: 20px;
    curosr: pointer;
`;