import { GeminiSpec } from '../gemini.schema';
import * as d3 from 'd3';
import { renderBackground } from './layout-background';
import { renderLayout } from './layout';
import { BoundingBox } from '../utils/bounding-box';
import { HiGlassTrack } from './higlass';

export function renderLayoutPreview(
    svg: SVGSVGElement,
    spec: GeminiSpec,
    boundingBox: BoundingBox,
    setHiGlassInfo: (higlassInfo: HiGlassTrack[]) => void
) {
    if (!svg || !spec) return;
    d3.select(svg).selectAll('*').remove();

    // styles
    const PADDING_X = boundingBox.x;
    const PADDING_Y = boundingBox.y;
    const WIDTH = boundingBox.width + PADDING_X * 2;
    const HEIGHT = boundingBox.height + PADDING_Y * 2;

    // background and guidelines
    renderBackground(svg, WIDTH, HEIGHT, PADDING_X, PADDING_Y, false);

    const innerG = d3.select(svg).append('g').attr('width', boundingBox.width).attr('height', boundingBox.height);

    renderLayout(innerG, spec, setHiGlassInfo, boundingBox);
}
