import { AbstractConnector, PaintStyle } from "@jsplumb/core";
import { Extents } from "@jsplumb/util";
import { BrowserJsPlumbInstance } from "@jsplumb/browser-ui/browser-jsplumb-instance";
export declare function paintSvgConnector(instance: BrowserJsPlumbInstance, connector: AbstractConnector, paintStyle: PaintStyle, extents?: Extents): void;
export declare function getConnectorElement(instance: BrowserJsPlumbInstance, c: AbstractConnector): SVGElement;
