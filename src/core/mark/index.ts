import { GeminidTrackModel } from '../geminid-track-model';
import { drawPoint } from './point';
import { drawLine } from './line';
import { drawBar } from './bar';
import { drawArea } from './area';
import { drawRect } from './rect';
import { ChannelTypes } from '../geminid.schema';
import { drawTriangle } from './triangle';
import { drawText } from './text';
import { drawRule } from './rule';
import { drawLink } from './link';
import { drawGrid } from './grid';
import { drawChartOutlines } from './outline';
import { drawColorLegend, drawYLegend } from './legend';
import { drawCircularGrid } from './grid-circular';
import { drawCircularOutlines } from './outline-circular';
import { drawBackground } from './background';

/**
 * Visual channels currently supported for visual encoding.
 */
export const SUPPORTED_CHANNELS: (keyof typeof ChannelTypes)[] = [
    'x',
    'xe',
    'x1',
    'x1e',

    'y',
    'ye',
    'y1',
    'y1e',

    'color',
    'size',
    'row',
    'stroke',
    'strokeWidth',
    'opacity',
    'text',
    'background'
    // ...
];

export const RESOLUTION = 4;

/**
 * Draw a track based on the track specification in a Geminid grammar.
 */
export function drawMark(HGC: any, trackInfo: any, tile: any, model: GeminidTrackModel) {
    if (!HGC || !trackInfo || !tile) {
        // We did not receive parameters correctly.
        return;
    }

    if (model.spec().mark === 'rect-brush') {
        // We do not draw brush. Instead, higlass do.
        return;
    }

    const CIRCULAR = model.spec().circularLayout;

    // Replace the scale of a genomic axis with the one that is generated by the HiGlass data fetcher.
    ['x', 'x1', 'x1e', 'xe'].forEach((d: any) => {
        // const c = tm.spec()[d as keyof typeof ChannelTypes];
        // if(IsChannelDeep(c) && c.type === 'genomic') {
        model.setChannelScale(d, trackInfo._xScale);
        // }
    });

    /* embellishment before rendering plots */
    drawBackground(HGC, trackInfo, tile, model);
    if (CIRCULAR) {
        drawCircularGrid(HGC, trackInfo, tile, model);
    } else {
        drawGrid(HGC, trackInfo, tile, model);
        drawChartOutlines(HGC, trackInfo, model);
    }

    /* spec */
    switch (model.spec().mark) {
        case 'point':
            drawPoint(HGC, trackInfo, tile, model);
            break;
        case 'bar':
            drawBar(HGC, trackInfo, tile, model);
            break;
        case 'line':
            drawLine(HGC, trackInfo, tile, model);
            break;
        case 'area':
            drawArea(HGC, trackInfo, tile, model);
            break;
        case 'rect':
            drawRect(HGC, trackInfo, tile, model);
            break;
        case 'triangle-l':
        case 'triangle-r':
        case 'triangle-d':
            drawTriangle(HGC, trackInfo, tile, model);
            break;
        case 'text':
            drawText(HGC, trackInfo, tile, model);
            break;
        case 'rule':
            drawRule(HGC, trackInfo, tile, model);
            break;
        case 'link':
            drawLink(HGC, trackInfo, tile, model);
            break;
        default:
            console.warn('Unsupported mark type');
            break;
    }

    /* embellishment after rendering plots */
    if (CIRCULAR) {
        drawCircularOutlines(HGC, trackInfo, tile, model);
    } else {
        drawYLegend(HGC, trackInfo, tile, model);
    }
    drawColorLegend(HGC, trackInfo, tile, model);
}
