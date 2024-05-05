import React from 'react'
import { SkeletonStyle } from './style'

export default function Skeleton({shape='rectangle', width, height, children, className }) {
    return (
        <SkeletonStyle className={`${shape} ${className}`} style={{ width: width, height }}>{children}</SkeletonStyle>
    )
}
