import styled from "styled-components";

export const InputStyle = styled.div`
    position: relative;
    &.error{
        input{
            border-color: red;
        }
    }
`

export const ErrorText = styled.div`
    color: red;
    position: absolute;
    font-size: 0.875rem;
    font-style: italic;
    bottom: 10px;
`