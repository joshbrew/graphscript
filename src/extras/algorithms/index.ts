
import { accel_gyro } from "./accel_gyro";
import { beat_detect } from "./beat_detect";
import { blink_detect } from './blink';
import { rms } from './rms';
import { circularBuffer2d } from './buffering';
import { GraphNodeProperties } from "../../core/Graph";

//data in, interpretation out (with unique key:value pairs)
const algorithms = {
    beat_detect, //beat detection, set sps and maxFreq detection (for low passing)
    accel_gyro, //get absolute angle and position change from starting point (need magnetometer for global position, the gyro is relative)
    heartrate:beat_detect, //alias
    breath:Object.assign({}, beat_detect),
    blink_detect,
    rms,
    circularBuffer2d
} as {
    [key:string]:GraphNodeProperties
};

algorithms['breath'].structs = JSON.parse( JSON.stringify( algorithms['breath'].structs ));
(algorithms['breath'].structs as any).maxFreq = 0.2; //another quick preset

export { algorithms };