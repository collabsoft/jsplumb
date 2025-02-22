import { Extents, BoundingBox, PointXY } from "@jsplumb/util";
export interface SegmentHandler<T extends Segment> {
    getLength(s: T): number;
    getPath(s: T, isFirstSegment: boolean): string;
    gradientAtPoint(s: T, location: number, absolute?: boolean): number;
    pointAlongPathFrom(s: T, location: number, distance: number, absolute?: boolean): PointXY;
    gradientAtPoint(s: T, location: number, absolute?: boolean): number;
    pointOnPath(s: T, location: number, absolute?: boolean): PointXY;
    findClosestPointOnPath(s: T, x: number, y: number): PointNearPath;
    lineIntersection(s: T, x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
    boxIntersection(s: T, x: number, y: number, w: number, h: number): Array<PointXY>;
    boundingBoxIntersection(segment: T, box: BoundingBox): Array<PointXY>;
    create(segmentType: string, params: any): T;
}
/**
 * @internal
 */
export interface SegmentParams {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}
/**
 * @internal
 */
export declare type PointNearPath = {
    s?: Segment;
    d: number;
    x: number;
    y: number;
    l: number;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};
/**
 * Returns an empty bounds object, used in certain initializers internally.
 * @internal
 */
export declare function EMPTY_BOUNDS(): Extents;
/**
 * Definition of a segment. This is an internal class that users of the API need not access.
 * @internal
 */
export interface Segment {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    type: string;
    extents: Extents;
}
/**
 * Fallback methods for segment handlers that havent got their own implementation of some method.
 * @internal
 */
export declare const defaultSegmentHandler: {
    boxIntersection(handler: SegmentHandler<any>, segment: Segment, x: number, y: number, w: number, h: number): Array<PointXY>;
    boundingBoxIntersection(handler: SegmentHandler<any>, segment: Segment, box: BoundingBox): Array<PointXY>;
    lineIntersection(handler: SegmentHandler<any>, x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
    findClosestPointOnPath(handler: SegmentHandler<any>, segment: Segment, x: number, y: number): PointNearPath;
};
export declare const Segments: {
    register: (segmentType: string, segmentHandler: SegmentHandler<any>) => void;
    get: (segmentType: string) => SegmentHandler<any>;
};
//# sourceMappingURL=segments.d.ts.map