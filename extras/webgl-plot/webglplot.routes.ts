import { WorkerInfo } from '../../services/worker/Worker.service'//"graphscript";
import { WebglLinePlotInfo,WebglLinePlotProps,WebglLinePlotUtil, WebglLineProps } from "webgl-plot-utils"//'../../../BrainsAtPlay_Libraries/webgl-plot-utils/webgl-plot-utils'//"webgl-plot-utils"//'../../BrainsAtPlay_Libraries/webgl-plot-utils/webgl-plot-utils'//"webgl-plot-utils";
import { FilterSettings } from "../algorithms/util/BiquadFilters";

export { WebglLineProps, WebglLinePlotProps, WebglLinePlotInfo } //re-export types for reference

export const webglPlotRoutes = {
    setupChart:function setupChart(settings:WebglLinePlotProps) {
        console.log('initializing chart', settings)
        if(!this.graph.plotter) this.graph.plotter = new WebglLinePlotUtil();
        return this.graph.plotter.initPlot(settings).settings._id;
    },
    updateChartData:function updateChartData(
        plot:WebglLinePlotInfo|string, 
        lines?:{
            [key: string]: WebglLineProps | number[] | {
                [key: string]: any;
                values: number[];
            }
        }, 
        draw:boolean=true
    ) {
        //let parsed = globalThis.WebglLinePlotUtil.formatDataForCharts(lines);
        if(typeof lines === 'object')
        {    
            //console.log(parsed);
            this.graph.plotter.update(plot,lines,draw);
            return true;
        } return false;
    },
    clearChart:function clearChart(
        plot:WebglLinePlotInfo|string
    ) {
       this.graph.plotter.deinitPlot(plot);
        return true;
    },
    resetChart:function resetChart(
        plot:WebglLinePlotInfo|string,
        settings:WebglLinePlotProps
    ) {
       this.graph.plotter.reinitPlot(plot,settings);
        return settings._id;
    },
    getChartSettings:function getChartSettings(plotId) {
        let settings = this.graph.plotter.getChartSettings(plotId);
        //console.log(settings);
        return settings;
    }
}


export async function setSignalControls(
    controlsDiv:HTMLElement,
    plotId:string,
    streamworker:WorkerInfo,
    chartworker:WorkerInfo,
    chartSettings:Partial<WebglLinePlotProps>,
    filterSettings:FilterSettings, 
) {
    let controls = controlsDiv;
    if(!controls) return false;

    if(!chartSettings && chartworker) chartSettings = await chartworker.run('getChartSettings',plotId);
    if(!filterSettings && streamworker) filterSettings = await streamworker.run('getFilterSettings');

    if(chartSettings?.lines) {
        //console.log(chartSettings);
        let body = ``;

        let viewingall = true;
        let scalingall = true;
        let n50all = true;
        let n60all = true;
        let dcall = true;
        let lpall = true;
        let bpall = true;

        for(const prop in chartSettings.lines) {
            let line = chartSettings.lines[prop] as WebglLineProps
            body += `
            <tr>
                <td id='${plotId}${prop}name'><input id='${plotId}${prop}viewing' type='checkbox' ${(line.viewing) ? 'checked' : ''}>${prop}</td>
                <td><input id='${plotId}${prop}sps' type='number' step='1' value='${line.sps ? line.sps : 100}'></td>
                <td><input id='${plotId}${prop}nSec' type='number' step='1' value='${line.nSec ? line.nSec : (line.nPoints ? Math.floor(line.nPoints/(line.sps ? line.sps : 100)) : 10)}'></td>
                <td><input id='${plotId}${prop}scalar'  type='number' value='${filterSettings[prop]?.scalar ? filterSettings[prop].scalar : 1}'><input id='${plotId}${prop}useScaling' type='checkbox' ${filterSettings[prop]?.useScaling ? 'checked' : ''}></td>
                <td><input id='${plotId}${prop}units' type='text' value='${line.units ? line.units : ''}'></td>
                <td><input id='${plotId}${prop}ymin' type='number' value='${line.ymin ? line.ymin : '0'}'></td>
                <td><input id='${plotId}${prop}ymax' type='number' value='${line.ymax ? line.ymax : '1'}'></td>
                <td><input id='${plotId}${prop}useNotch50' type='checkbox' ${filterSettings[prop]?.useNotch50 ? 'checked' : ''}></td>
                <td><input id='${plotId}${prop}useNotch60' type='checkbox' ${filterSettings[prop]?.useNotch60 ? 'checked' : ''}></td>
                <td><input id='${plotId}${prop}useDCBlock' type='checkbox' ${filterSettings[prop]?.useDCBlock ? 'checked' : ''}></td>
                <td><input id='${plotId}${prop}lowpassHz'  type='number' value='${filterSettings[prop]?.lowpassHz ? filterSettings[prop].lowpassHz : 100}'>Hz<input id='${plotId}${prop}useLowpass' type='checkbox' ${filterSettings[prop]?.useLowpass ? 'checked' : ''}></td>
                <td><input id='${plotId}${prop}bandpassLower'  type='number' value='${filterSettings[prop]?.bandpassLower ? filterSettings[prop].bandpassLower : 3}'>Hz to <input id='${plotId}${prop}bandpassUpper'  type='number' value='${filterSettings[prop]?.bandpassUpper ? filterSettings[prop].bandpassUpper : 45}'>Hz<input id='${plotId}${prop}useBandpass' type='checkbox' ${filterSettings[prop]?.useBandpass ? 'checked' : ''}></td>
            </tr>`

            if(!line.viewing) viewingall = false;
            if(!filterSettings[prop]?.useScaling) scalingall = false;
            if(!filterSettings[prop]?.useNotch50) n50all = false;
            if(!filterSettings[prop]?.useNotch60) n60all = false;
            if(!filterSettings[prop]?.useDCBlock) dcall = false;
            if(!filterSettings[prop]?.useLowpass) lpall = false;
            if(!filterSettings[prop]?.useBandpass) bpall = false;

        }
        
        let head = `
        <tr>
            <th>Name <input type='checkbox' id='${plotId}viewing' ${viewingall ? 'checked' : ''}></th>
            <th>SPS</th>
            <th>Plot nSec</th>
            <th>Scalar <input type='checkbox' id='${plotId}useScaling' ${scalingall ? 'checked' : ''}></th>
            <th>Units</th>
            <th>Lower Bound</th>
            <th>Upper Bound</th>
            <th>50Hz Notch <input type='checkbox' id='${plotId}useNotch50' ${n50all ? 'checked' : ''}></th>
            <th>60Hz Notch <input type='checkbox' id='${plotId}useNotch60' ${n60all ? 'checked' : ''}></th>
            <th>DC Block <input type='checkbox' id='${plotId}useDCBlock' ${dcall ? 'checked' : ''}></th>
            <th>Lowpass <input type='checkbox' id='${plotId}useLowpass' ${lpall ? 'checked' : ''}></th>
            <th>Bandpass <input type='checkbox' id='${plotId}useBandpass' ${bpall ? 'checked' : ''}></th>
        </tr>
        `;


        controls.innerHTML = head + body;

        //apply to all
        let viewall = document.getElementById(plotId+'viewing') as HTMLInputElement;
        let usescalar = document.getElementById(plotId+'useScaling') as HTMLInputElement;
        let usen50 = document.getElementById(plotId+'useNotch50') as HTMLInputElement;
        let usen60 = document.getElementById(plotId+'useNotch60') as HTMLInputElement;
        let usedcb = document.getElementById(plotId+'useDCBlock') as HTMLInputElement;
        let uselp = document.getElementById(plotId+'useLowpass') as HTMLInputElement;
        let usebp = document.getElementById(plotId+'useBandpass') as HTMLInputElement;

        let headeronchange = (checked, idsuffix) => {
            for(const prop in chartSettings.lines) {
                let elm = document.getElementById(plotId+prop+idsuffix) as HTMLInputElement;
                if(elm?.checked !== checked) elm.click(); //trigger its onchange to set reset the filter
            }
        }

        viewall.onchange = (ev) => {
            headeronchange((ev.target as HTMLInputElement).checked,'viewing')
        }
        usescalar.onchange = (ev) => {
            headeronchange((ev.target as HTMLInputElement).checked,'useScaling')
        }
        usen50.onchange = (ev) => {
            headeronchange((ev.target as HTMLInputElement).checked,'useNotch50')
        }
        usen60.onchange = (ev) => {
            headeronchange((ev.target as HTMLInputElement).checked,'useNotch60')
        }
        usedcb.onchange = (ev) => {
            headeronchange((ev.target as HTMLInputElement).checked,'useDCBlock')
        }
        uselp.onchange = (ev) => {
            headeronchange((ev.target as HTMLInputElement).checked,'useLowpass')
        }
        usebp.onchange = (ev) => {
            headeronchange((ev.target as HTMLInputElement).checked,'useBandpass')
        }

        for(const prop in chartSettings.lines) {
            let viewing = document.getElementById(plotId+prop+'viewing') as HTMLInputElement;
            let sps = document.getElementById(plotId+prop+'sps') as HTMLInputElement;
            let nSec = document.getElementById(plotId+prop+'nSec') as HTMLInputElement;
            let useScaling = document.getElementById(plotId+prop+'useScaling') as HTMLInputElement;
            let scalar = document.getElementById(plotId+prop+'scalar') as HTMLInputElement;
            let units = document.getElementById(plotId+prop+'units') as HTMLInputElement;
            let ymin = document.getElementById(plotId+prop+'ymin') as HTMLInputElement;
            let ymax = document.getElementById(plotId+prop+'ymax') as HTMLInputElement;
            let useNotch50 = document.getElementById(plotId+prop+'useNotch50') as HTMLInputElement;
            let useNotch60 = document.getElementById(plotId+prop+'useNotch60') as HTMLInputElement;
            let useDCBlock = document.getElementById(plotId+prop+'useDCBlock') as HTMLInputElement;
            let useLowpass = document.getElementById(plotId+prop+'useLowpass') as HTMLInputElement;
            let lowpassHz = document.getElementById(plotId+prop+'lowpassHz') as HTMLInputElement;
            let useBandpass = document.getElementById(plotId+prop+'useBandpass') as HTMLInputElement;
            let bandpassLower = document.getElementById(plotId+prop+'bandpassLower') as HTMLInputElement;
            let bandpassUpper = document.getElementById(plotId+prop+'bandpassUpper') as HTMLInputElement;


            viewing.onchange = () => {

                if((!Array.isArray(chartSettings.lines?.[prop] as WebglLineProps))) {

                    (chartSettings.lines?.[prop] as WebglLineProps).viewing = viewing.checked;
                    (chartSettings as WebglLinePlotProps).generateNewLines = false; //make sure the lines don't regenerate automatically
                    chartworker.run('resetChart', [plotId,chartSettings]);

                }
            }

            let filteronchange = () => {

                let setting = {
                    [prop]:{
                        sps: sps.value ? parseFloat(sps.value) : 100,
                        useScaling:useScaling.checked,
                        scalar: scalar.value ? parseFloat(scalar.value) : 1,
                        useNotch50:useNotch50.checked,
                        useNotch60:useNotch60.checked,
                        useDCBlock:useDCBlock.checked,
                        useLowpass:useLowpass.checked,
                        lowpassHz:  lowpassHz.value ? parseFloat(lowpassHz.value) : 100,
                        useBandpass: useBandpass.checked,
                        bandpassLower:  bandpassLower.value ? parseFloat(bandpassLower.value) : 3,
                        bandpassUpper:  bandpassUpper.value ? parseFloat(bandpassUpper.value) : 45,
                        trimOutliers: filterSettings[prop]?.trimOutliers,
                        outlierTolerance: filterSettings[prop]?.outlierTolerance
                    } as FilterSettings
                }

                //console.log(setting);

                streamworker.post('setFilters', setting); //replace current filter for this line
            }

            sps.onchange = () => {
                filteronchange();
                (chartSettings.lines?.[prop] as WebglLineProps).sps = parseFloat(sps.value);
                (chartSettings.lines?.[prop] as WebglLineProps).nSec = parseFloat(nSec.value);
                delete (chartSettings.lines?.[prop] as WebglLineProps).points;
                delete (chartSettings.lines?.[prop] as WebglLineProps).nPoints;
                chartworker.run('resetChart', [plotId,chartSettings]);
            }

            units.onchange = () => {
                if((!Array.isArray(chartSettings.lines?.[prop] as WebglLineProps))) {
                    (chartSettings.lines?.[prop] as WebglLineProps).units = units.value;
                    chartworker.run('resetChart', [plotId,chartSettings]);
                }
            }
            ymax.onchange = () => {
                if((!Array.isArray(chartSettings.lines?.[prop] as WebglLineProps))) {
                    (chartSettings.lines?.[prop] as WebglLineProps).ymax = ymax.value ? parseFloat(ymax.value) : 1;
                    (chartSettings.lines?.[prop] as WebglLineProps).ymin = ymin.value ? parseFloat(ymin.value) : 0;
                    chartworker.run('resetChart', [plotId,chartSettings]);
                }
            }
            ymin.onchange = () => {
                if((!Array.isArray(chartSettings.lines?.[prop] as WebglLineProps))) {
                    (chartSettings.lines?.[prop] as WebglLineProps).ymax = ymax.value ? parseFloat(ymax.value) : 1;
                    (chartSettings.lines?.[prop] as WebglLineProps).ymin = ymin.value ? parseFloat(ymin.value) : 0;
                    chartworker.run('resetChart', [plotId,chartSettings]);
                }
            }

            nSec.onchange = () => {
                if((!Array.isArray(chartSettings.lines?.[prop] as WebglLineProps))) {
                    (chartSettings.lines?.[prop] as WebglLineProps).sps = parseFloat(sps.value);
                    (chartSettings.lines?.[prop] as WebglLineProps).nSec = parseFloat(nSec.value);
                    delete (chartSettings.lines?.[prop] as WebglLineProps).points;
                    delete (chartSettings.lines?.[prop] as WebglLineProps).nPoints;
                    chartworker.run('resetChart', [plotId,chartSettings]);
                }
            }

            useScaling.onchange = filteronchange;
            useNotch50.onchange = filteronchange;
            useNotch60.onchange = filteronchange;
            useDCBlock.onchange = filteronchange;
            useLowpass.onchange = filteronchange;
            useBandpass.onchange = filteronchange;
            lowpassHz.onchange = filteronchange;
            scalar.onchange = filteronchange;
            bandpassLower.onchange = filteronchange;
            bandpassUpper.onchange = filteronchange;
        }
    }
}
