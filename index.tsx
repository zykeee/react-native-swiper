import { Children, PropsWithChildren, useMemo, useRef, useState } from "react"
import { Animated, View } from "react-native"
import { IntRange } from "type-fest"

export type SwiperProps = PropsWithChildren<{
    onIdxChange: (i: SwiperProps["idx"]) => void
    idx: number
    swipeConf: {
        width: number
        flipSensitivity?: IntRange<1, 100>
    }
}>

export const Swiper = (p: SwiperProps) => {
    const [currentX, setCurrentX] = useState(0)
    const [startX, setStartX] = useState(0)
    const [marginLeftOffset, setMarginLeftOffset] = useState(0)
    const marginLeftAnimValue = useRef(new Animated.Value(0)).current
    const pageSize = useMemo(() => p.swipeConf.width, [p.swipeConf])
    const maxIdx = useMemo(() => Children.count(p.children) - 1, [p.children])
    const sensitivity = p.swipeConf.flipSensitivity ?? 50
    return (
        <View
            style={{ overflow: "hidden", width: p.swipeConf.width }}
            onTouchStart={(e) => {
                const pageX = e.nativeEvent.pageX
                setStartX(pageX)
                setCurrentX(pageX)
            }}
            onTouchMove={(e) => {
                const x = e.nativeEvent.pageX
                const delta = x - currentX

                // Case: current at first or last page, and swipe to previous page direction
                // Expect: not moving
                const shouldNotMove = (p.idx === 0 && delta > 0) || (p.idx === maxIdx && delta < 0)
                if (shouldNotMove) {
                    return
                }

                //Else: make content move with touch
                setCurrentX(x)
                Animated.spring(marginLeftAnimValue, {
                    toValue: marginLeftOffset + delta,
                    useNativeDriver: false,
                }).start()
                setMarginLeftOffset(marginLeftOffset + delta)
            }}
            onTouchEnd={(e) => {
                // when touch ends, 2 things to do is:
                // 1. to check should flip page or not
                // 2. flip to previous or next
                const pageX = e.nativeEvent.pageX
                const moved = pageX - startX
                const shouldFlip = Math.abs(moved / pageSize) > sensitivity / 100
                const sign = moved > 0 ? -1 : 1
                const idxChange = sign * (shouldFlip ? 1 : 0)
                const finalIdx = makeItInInterval(p.idx + idxChange, 0, maxIdx)
                p.onIdxChange(finalIdx)
                Animated.spring(marginLeftAnimValue, {
                    toValue: -finalIdx * pageSize,
                    useNativeDriver: false,
                }).start()
                setMarginLeftOffset(-finalIdx * pageSize)
            }}
        >
            <Animated.View
                style={{
                    flexDirection: "row",
                    marginLeft: marginLeftAnimValue,
                }}
            >
                {p.children}
            </Animated.View>
        </View>
    )
}

const makeItInInterval = (num: number, min: number, max: number) => {
    if (num < min) return min
    if (num > max) return max
    return num
}
