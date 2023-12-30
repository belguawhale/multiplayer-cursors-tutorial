// Source: https://github.com/steveruizok/perfect-cursors

import { PerfectCursor } from "perfect-cursors"
import * as React from "react"

export const usePerfectCursor = (cb: (point: number[]) => void, point: number[]) => {
    const [pc] = React.useState(() => new PerfectCursor(cb))

    React.useLayoutEffect(() => {
        if (point) pc.addPoint(point)
        return () => pc.dispose()
    }, [pc])

    const onPointChange = React.useCallback((point: number[]) => pc.addPoint(point), [pc])

    return onPointChange
}