import { Cursor } from "./Cursor"
import useWebSocket from "react-use-websocket"
import React, { useEffect, useRef } from "react"
import throttle from "lodash.throttle"
import { User } from "./User";

interface Props {
    username: string;
}

type Users = {
    [uuid: string]: User
}


export const Home: React.FC<Props> = ({ username }) => {
    const WS_URL = `ws://127.0.0.1:8000`
    const THROTTLE = 50

    const { sendJsonMessage, lastJsonMessage } = useWebSocket<{ [uuid: string]: User }>(WS_URL, {
        queryParams: { username },
        share: true,
    })
    const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE))

    const [mousePos, setMousePos] = React.useState([0, 0])

    useEffect(() => {
        sendJsonMessage({
            x: 0,
            y: 0,
        })

        window.addEventListener("mousemove", (e) => {
            setMousePos([e.clientX, e.clientY]);
            sendJsonMessageThrottled.current({
                x: e.clientX,
                y: e.clientY,
            })
        })
    }, [])

    const renderCursors = (users: Users) => {
        return Object.keys(users).map((uuid) => {
            const user = users[uuid]
            if (user.username === username) {
                return <Cursor key={uuid} point={mousePos} interpolate={false} />
            }
            return (
                <Cursor key={uuid} point={[user.state.x, user.state.y]} interpolate={true} />
            )
        })
    }

    const renderUsersList = (users: Users) => {
        return (
            <ul>
                {Object.keys(users).map(uuid => {
                    return <li key={uuid}>{JSON.stringify(users[uuid])}</li>
                })}
            </ul>
        )
    }


    if (lastJsonMessage) {
        return <>
            {renderUsersList(lastJsonMessage)}
            {renderCursors(lastJsonMessage)}
        </>
    }
}