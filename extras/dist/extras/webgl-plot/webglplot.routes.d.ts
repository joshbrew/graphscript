import { WorkerInfo } from '../../services/worker/Worker.service';
import { WebglLinePlotInfo, WebglLinePlotProps, WebglLineProps } from "webgl-plot-utils";
import { FilterSettings } from "../algorithms/util/BiquadFilters";
export { WebglLineProps, WebglLinePlotProps, WebglLinePlotInfo };
export declare const webglPlotRoutes: {
    setupChart: (settings: WebglLinePlotProps) => any;
    updateChartData: (plot: WebglLinePlotInfo | string, lines?: {
        [key: string]: number[] | WebglLineProps | {
            [key: string]: any;
            values: number[];
        };
    }, draw?: boolean) => boolean;
    clearChart: (plot: WebglLinePlotInfo | string) => boolean;
    resetChart: (plot: WebglLinePlotInfo | string, settings: WebglLinePlotProps) => any;
    getChartSettings: (plotId: any) => any;
};
export declare function setSignalControls(controlsDiv: HTMLElement, plotId: string, streamworker: WorkerInfo, chartworker: WorkerInfo, chartSettings: Partial<WebglLinePlotProps>, filterSettings: FilterSettings): Promise<boolean>;
