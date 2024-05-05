import styled from "styled-components";

export const ButtonStyled = styled.button`
    width: 100%;
    height: 60px;
    font-size: 20px;
    background-color: white;
    border: 1px solid #2C3591;
    box-sizing: border-box;

    &:hover{
        cursor: pointer;
        background-color: #2C3591;
        color: white;
    }
    &:disabled{
        opacity: 0.5;
        pointer-events: none;
    }
`