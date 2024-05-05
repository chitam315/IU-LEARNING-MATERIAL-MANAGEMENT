import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import styled from 'styled-components'
import './style.scss'

export const ErrorStyled = styled.span`
    color: red;
    font-size: 0.8rem;
    position: absolute;
    left: 230px;
    bottom: -26px;
`
const Field = forwardRef(({ label, error, require, renderInput, type = 'text', customField, ...props }, ref) => {
    const inRef = useRef()
    useImperativeHandle(ref, () => {
        return {
            a: 123,
            b: true,
            setValue: (value) => {
                inRef.current.value = value
            }
        }
    }, [])
    return (
        <label id='labelInField' style={{
            position: "relative",
            ...customField,
        }}>
            <p>{label}{require && <span>*</span>}</p>
            {
                renderInput ? renderInput(error, props) : <input style={error ? { border: "1px solid red" } : undefined} ref={inRef} type={type} {...props} />
            }
            {
                error && <ErrorStyled>{error}</ErrorStyled>
            }
        </label>
    )
})

export default Field
