/**
 * Various geometry functions
 *
 * Copyright (c) 2021 jsPlumb Pty Ltd
 * https://jsplumbtoolkit.com
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

import {forEach, Grid, LineXY, PointXY, RectangleXY} from "./util"

export type Quadrant = 1 | 2 | 3 | 4

const segmentMultipliers = [null, [1, -1], [1, 1], [-1, 1], [-1, -1] ]
const inverseSegmentMultipliers = [null, [-1, -1], [-1, 1], [1, 1], [1, -1] ]

export const TWO_PI = 2 * Math.PI

// export function pointXYFromArray(a: Array<number>): PointXY {
//     return {x: a[0], y: a[1]}
// }

/**
 * Adds the x and y values of the two points and returns a new point.
 * @param p1
 * @param p2
 */
export function add(p1:PointXY, p2:PointXY):PointXY {
    return { x:p1.x + p2.x, y:p1.y + p2.y }
}

/**
 * Subtracts p2 from p1, returning a new point.
 * @param p1
 * @param p2
 */
export function subtract(p1:PointXY, p2:PointXY):PointXY {
    return { x:p1.x - p2.x, y:p1.y - p2.y }
}

/**
 * @name gradient
 * @function
 * @desc Calculates the gradient of a line between the two points.
 * @param {PointXY} p1 First point in the line
 * @param {PointXY} p2 Second point in the line
 * @return {number} The gradient of a line between the two points.
 */
export function gradient(p1: PointXY, p2: PointXY): number {
    if (p2.x === p1.x)
        return p2.y > p1.y ? Infinity : -Infinity
    else if (p2.y === p1.y)
        return p2.x > p1.x ? 0 : -0
    else
        return (p2.y - p1.y) / (p2.x - p1.x)
}

/**
 * @name normal
 * @function
 * @desc Calculates the gradient of a normal to a line between the two points.
 * @param {PointXY} p1 First point in the line
 * @param {PointXY} p2 Second point in the line
 * @return {number} The gradient of a normal to a line between the two points.
 */
export function normal(p1: PointXY, p2: PointXY): number {
    return -1 / gradient(p1, p2)
}

/**
 * @name lineLength
 * @function
 * @desc Calculates the length of a line between the two points.
 * @param {PointXY} p1 First point in the line
 * @param {PointXY} p2 Second point in the line
 * @return {number} The length of a line between the two points.
 */
export function lineLength(p1: PointXY, p2: PointXY): number {
    return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2))
}

/**
 * @name quadrant
 * @function
 * @desc Calculates the quadrant in which the angle between the two points lies.
 * @param {PointXY} p1 First point in the line
 * @param {PointXY} p2 Second point in the line
 * @return {Quadrant} The quadrant - 1 for upper right, 2 for lower right, 3 for lower left, 4 for upper left.
 */
export function quadrant(p1: PointXY, p2: PointXY): Quadrant {

    if (p2.x > p1.x) {
        return (p2.y > p1.y) ? 2 : 1
    } else if (p2.x == p1.x) {
        return p2.y > p1.y ? 2 : 1
    } else {
        return (p2.y > p1.y) ? 3 : 4
    }
}

/**
 * @name theta
 * @function
 * @desc Calculates the angle between the two points.
 * @param {PointXY} p1 First point
 * @param {PointXY} p2 Second point
 * @return {number} The angle between the two points.
 */
export function theta(p1: PointXY, p2: PointXY): number {

    let m = gradient(p1, p2),
        t = Math.atan(m),
        s = quadrant(p1, p2)

    if ((s == 4 || s == 3)) t += Math.PI
    if (t < 0) t += (2 * Math.PI)

    return t

}

/**
 * @name intersects
 * @function
 * @desc Calculates whether or not the two rectangles intersect.
 * @param {RectangleXY} r1 First rectangle
 * @param {RectangleXY} r2 Second rectangle
 * @return {boolean} True if the rectangles intersect, false otherwise.
 */
export function intersects(r1: RectangleXY, r2: RectangleXY): boolean {
    let x1 = r1.x, x2 = r1.x + r1.w, y1 = r1.y, y2 = r1.y + r1.h,
        a1 = r2.x, a2 = r2.x + r2.w, b1 = r2.y, b2 = r2.y + r2.h

    return ((x1 <= a1 && a1 <= x2) && (y1 <= b1 && b1 <= y2)) ||
        ((x1 <= a2 && a2 <= x2) && (y1 <= b1 && b1 <= y2)) ||
        ((x1 <= a1 && a1 <= x2) && (y1 <= b2 && b2 <= y2)) ||
        ((x1 <= a2 && a1 <= x2) && (y1 <= b2 && b2 <= y2)) ||
        ((a1 <= x1 && x1 <= a2) && (b1 <= y1 && y1 <= b2)) ||
        ((a1 <= x2 && x2 <= a2) && (b1 <= y1 && y1 <= b2)) ||
        ((a1 <= x1 && x1 <= a2) && (b1 <= y2 && y2 <= b2)) ||
        ((a1 <= x2 && x1 <= a2) && (b1 <= y2 && y2 <= b2))
}

/**
 * Get the A B C components of the given line.
 * @param line
 */
function toABC(line:LineXY):{A:number,B:number, C:number} {
    const A = line[1].y - line[0].y
    const B = line[0].x - line[1].x
    return {
        A,
        B,
        C:(A * line[0].x) + (B * line[0].y)
    }
}

/**
 * Compute the intersection of the two lines.
 * @param l1
 * @param l2
 * @return A point if an intersection found, null otherwise.
 */
export function lineIntersection(l1:LineXY, l2:LineXY):PointXY|null {

    const abc1 = toABC(l1),
        abc2 = toABC(l2),
        det = (abc1.A * abc2.B) - (abc2.A * abc1.B)

    if (det == 0) {
        return null
    } else {
        const candidate = {
            x:( (abc2.B * abc1.C) - (abc1.B * abc2.C) ) / det,
            y:( (abc1.A * abc2.C) - (abc2.A * abc1.C) ) / det
        },
            l1xmin = Math.min(l1[0].x, l1[1].x),
            l1xmax = Math.max(l1[0].x, l1[1].x),
            l1ymin = Math.min(l1[0].y, l1[1].y),
            l1ymax = Math.max(l1[0].y, l1[1].y),
            l2xmin = Math.min(l2[0].x, l2[1].x),
            l2xmax = Math.max(l2[0].x, l2[1].x),
            l2ymin = Math.min(l2[0].y, l2[1].y),
            l2ymax = Math.max(l2[0].y, l2[1].y)

        if (  (candidate.x >= l1xmin && candidate.x <= l1xmax) &&
            (candidate.y >= l1ymin && candidate.y <= l1ymax) &&
            (candidate.x >= l2xmin && candidate.x <= l2xmax) &&
            (candidate.y >= l2ymin && candidate.y <= l2ymax)) {
            return candidate
        } else {
            return null
        }

    }

}

/**
 * Finds all points where the given line intersects the given rectangle.
 * @name findIntersections
 * @param line
 * @param r
 */
export function lineRectangleIntersection(line:LineXY, r:RectangleXY):Array<PointXY> {
    const out:Array<PointXY> = [],
        rectangleLines:Array<LineXY> = [
            [ { x:r.x, y:r.y }, { x:r.x + r.w, y:r.y }   ],
            [ { x:r.x + r.w, y:r.y }, { x:r.x + r.w, y:r.y + r.h }   ],
            [ { x:r.x, y:r.y }, { x:r.x, y:r.y + r.h }   ],
            [ { x:r.x, y:r.y + r.h }, { x:r.x + r.w, y:r.y + r.h }   ]
        ]

    forEach(rectangleLines, (rLine) => {
        const intersection = lineIntersection(line, rLine)
        if (intersection != null) {
            out.push(intersection)
        }
    })

    return out
}

/**
 * @name encloses
 * @function
 * @desc Calculates whether or not r2 is completely enclosed by r1.
 * @param {RectangleXY} r1 First rectangle
 * @param {RectangleXY} r2 Second rectangle
 * @param {boolean} [allowSharedEdges=false] If true, the concept of enclosure allows for one or more edges to be shared by the two rectangles.
 * @return {boolean} True if r1 encloses r2, false otherwise.
 */
export function encloses(r1: RectangleXY, r2: RectangleXY, allowSharedEdges?: boolean): boolean {
    const x1 = r1.x, x2 = r1.x + r1.w, y1 = r1.y, y2 = r1.y + r1.h,
        a1 = r2.x, a2 = r2.x + r2.w, b1 = r2.y, b2 = r2.y + r2.h,
        c = (v1: number, v2: number, v3: number, v4: number) => {
            return allowSharedEdges ? v1 <= v2 && v3 >= v4 : v1 < v2 && v3 > v4
        }

    return c(x1, a1, x2, a2) && c(y1, b1, y2, b2)
}

/**
 * @name pointOnLine
 * @function
 * @desc Calculates a point on the line from `fromPoint` to `toPoint` that is `distance` units along the length of the line.
 * @param {PointXY} fromPoint First point
 * @param {PointXY} toPoint Second point
 * @param {number} distance Distance along the length that the point should be located.
 * @return {PointXY} Point on the line, in the form `{ x:..., y:... }`.
 */
export function pointOnLine(fromPoint: PointXY, toPoint: PointXY, distance: number): PointXY {
    const m = gradient(fromPoint, toPoint),
        s = quadrant(fromPoint, toPoint),
        segmentMultiplier = distance > 0 ? segmentMultipliers[s] : inverseSegmentMultipliers[s],
        theta = Math.atan(m),
        y = Math.abs(distance * Math.sin(theta)) * segmentMultiplier[1],
        x = Math.abs(distance * Math.cos(theta)) * segmentMultiplier[0]
    return {x: fromPoint.x + x, y: fromPoint.y + y}
}

/**
 * @name perpendicularLineTo
 * @function
 * @desc Calculates a line of length `length` that is perpendicular to the line from `fromPoint` to `toPoint` and passes through `toPoint`.
 * @param {PointXY} fromPoint First point
 * @param {PointXY} toPoint Second point
 * @param {number} length Length of the line to generate
 * @return {LineXY} Perpendicular line, in the form `[ { x:..., y:... }, { x:..., y:... } ]`.
 */
export function perpendicularLineTo(fromPoint: PointXY, toPoint: PointXY, length: number): LineXY {
    const m = gradient(fromPoint, toPoint),
        theta2 = Math.atan(-1 / m),
        y = length / 2 * Math.sin(theta2),
        x = length / 2 * Math.cos(theta2)
    return [{x: toPoint.x + x, y: toPoint.y + y}, {x: toPoint.x - x, y: toPoint.y - y}]
}

/**
 * Snap the given x,y to a point on the grid defined by gridX and gridY, using the given thresholds to calculate proximity to the grid.
 * @param pos Position to transform
 * @param grid Definition of the grid
 * @param thresholdX Defines how close to a grid line in the x axis a value must be in order to be snapped to it.
 * @param thresholdY Defines how close to a grid line in the y axis a value must be in order to be snapped to it.
 */
export function snapToGrid(pos:PointXY, grid:Grid, thresholdX?:number, thresholdY?:number):PointXY {

    thresholdX = thresholdX == null ? grid.thresholdX == null ? grid.w / 2 : grid.thresholdX : thresholdX
    thresholdY = thresholdY == null ? grid.thresholdY == null ? grid.h / 2 : grid.thresholdY : thresholdY

    let _dx = Math.floor(pos.x / grid.w),
        _dxl = grid.w * _dx,
        _dxt = _dxl + grid.w,
        x = Math.abs(pos.x - _dxl) <= thresholdX ? _dxl : Math.abs(_dxt - pos.x) <= thresholdX ? _dxt : pos.x

    let _dy = Math.floor(pos.y / grid.h),
        _dyl = grid.h * _dy,
        _dyt = _dyl + grid.h,
        y = Math.abs(pos.y - _dyl) <= thresholdY ? _dyl : Math.abs(_dyt - pos.y) <= thresholdY ? _dyt : pos.y

    return {x,y}
}
