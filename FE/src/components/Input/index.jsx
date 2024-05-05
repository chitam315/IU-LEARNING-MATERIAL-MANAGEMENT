import React from "react";
import { ErrorText, InputStyle } from "./style";
import classNames from "classnames";

export default function Input({handleKeyDown , className, disabled = false , error, type = 'text', ...props }) {
    return (
        <InputStyle className={classNames(className, { error })}>
            <input disabled={disabled} onKeyDown={handleKeyDown} type={type} {...props} style={error && {marginBottom: '40px'}} />
            {
                error && <ErrorText>{error}</ErrorText>
            }
        </InputStyle>
    )
}