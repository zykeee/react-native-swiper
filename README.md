# React-Native Simple Swiper

A Swiper component with simple implementation for React Native mobile projects.

## Why & How

Most open-source swiper components have overly complicated implementations that produce bugs.

The implementation of this component is quite simple (less than a hundred lines). Instead of trying to be self-righteous or overly clever, it remains simple and straightforward. It does only what is necessary (which is handling touch events) and leaves the rest to the parent component.

If you just want a simple and tiny swiper, try this.

1. `npm i @zzzzk/react-native-swiper`
2. copy the `index.tsx` file to your own project and customize it.

## Demo

<h5>page number</h5>
<img src="./images/swiper-demo-with-page-numbers.gif" alt="page number" width="100" height="auto">

<div style="margin-right: 10px;"></div>

<h5>bubbles</h5>
<img src="./images/swiper-demo-with-page-bubbles.gif" alt="bubbles" width="100" height="auto">

<div style="margin-right: 10px;"></div>

<h5>autoplay</h5>
<img src="./images/swiper-demo-with-autoplay.gif" alt="bubbles" width="100" height="auto">

## Demo code

```typescript react
import { range } from "lodash"
import { useEffect, useState } from "react"
import { Image, Text, View } from "react-native"
import { Swiper } from "@zzzzk/react-native-swiper"

export type SwiperDemoProps = unknown
export const SwiperDemo = (p: SwiperDemoProps) => {
    const [idx, setIdx] = useState(0)
    const imgUrls = [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300",
    ]

    // auto play
    useEffect(() => {
        const interval = setInterval(() => {
            if (idx === imgUrls.length - 1) {
                setIdx(0)
                return
            }
            setIdx(idx + 1)
            console.log("increment:", idx)
        }, 1000)
        return () => clearInterval(interval)
    }, [idx, setIdx])

    return (
        <View
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <View style={{ marginTop: 200 }} />
            <Swiper
                idx={idx}
                onIdxChange={(i) => {
                    console.debug(i)
                    setIdx(i)
                }}
                swipeConf={{
                    width: 220,
                    flipSensitivity: 10,
                }}
            >
                {imgUrls.map((u, i) => (
                    <Image
                        style={{
                            margin: 10,
                            width: 200,
                            height: 300,
                            borderRadius: 20,
                        }}
                        key={i}
                        source={{ uri: u }}
                    />
                ))}
            </Swiper>
            <PageNum total={imgUrls.length} currentPage={idx + 1} />
            <Bubbles total={imgUrls.length} currentIdx={idx} />
        </View>
    )
}

const PageNum = (p: { total: number; currentPage: number }) => {
    return (
        <View style={{ flexDirection: "row" }}>
            <Text>{p.currentPage}</Text>
            <Text>/</Text>
            <Text>{p.total}</Text>
        </View>
    )
}
const Bubbles = (p: { total: number; currentIdx: number }) => {
    return (
        <View
            style={{
                flexDirection: "row",
            }}
        >
            {range(0, p.total).map((_, i) => {
                return (
                    <View
                        key={i}
                        style={{
                            margin: 5,
                            height: 10,
                            width: 10,
                            backgroundColor: p.currentIdx === i ? "grey" : "lavender",
                            borderRadius: 10,
                        }}
                    />
                )
            })}
        </View>
    )
}
```

## Limitations

-   No vertical swipe support
-   No custom animation support
