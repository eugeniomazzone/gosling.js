import { Track, IsChannelDeep, ChannelDeep, ChannelTypes } from '../../core/gemini.schema';

export function validateTrack(track: Track) {
    let valid = true;
    const errorMessages = [];
    // check with json schema
    // ...

    // additionally check with the schema that cannot be validated with a json schema file
    if (!getGenomicChannelFromTrack(track)) {
        errorMessages.push('genomic type is not encoded to either a x- or y- axis');
        valid = false;
    }
    const color = track.color;
    if (IsChannelDeep(color) && color.type === 'genomic') {
        errorMessages.push('genomic type cannot be used for a color channel');
        valid = false;
    }
    const row = track.row;
    if (IsChannelDeep(row) && row.type !== 'nominal') {
        errorMessages.push(`${row.type} type cannot be used for a row channel`);
        valid = false;
    }

    // combination of visual mark and channel
    if (track.mark === 'line' && IsChannelDeep(color) && color.type === 'quantitative') {
        errorMessages.push('`line` mark cannot be used with `quantitative` value');
        valid = false;
    }

    return { valid, errorMessages };
}

/**
 * Find an axis channel that is encoded with genomic coordinate.
 * `undefined` if not found.
 */
export function getGenomicChannelFromTrack(track: Track): ChannelDeep | undefined {
    // we do not support using two genomic coordinates yet
    let genomicChannel: ChannelDeep | undefined = undefined;
    ['x', 'y', 'xe', 'ye', 'x1', 'y1', 'x1e', 'y1e'].reverse().forEach(channelType => {
        const channel = track[channelType as keyof typeof ChannelTypes];
        if (IsChannelDeep(channel) && channel.type === 'genomic') {
            genomicChannel = channel;
        }
    });
    return genomicChannel;
}

/**
 * Find an axis channel that is encoded with genomic coordinate and return 'x' or 'y'.
 * `undefined` if not found.
 */
export function getGenomicChannelKeyFromTrack(
    track: Track
): 'x' | 'xe' | 'y' | 'ye' | 'x1' | 'y1' | 'x1e' | 'y1e' | undefined {
    // we do not support using two genomic coordinates yet
    let genomicChannelKey: string | undefined = undefined;
    ['x', 'xe', 'y', 'ye', 'x1', 'y1', 'x1e', 'y1e'].reverse().forEach(channelKey => {
        const channel = track[channelKey as keyof typeof ChannelTypes];
        if (IsChannelDeep(channel) && channel.type === 'genomic') {
            genomicChannelKey = channelKey;
        }
    });
    return genomicChannelKey;
}