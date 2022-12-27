import { Math2 } from 'brainsatplay-math';
import { SubprocessContextProps } from '../../services/worker/Subprocess';
//convert accelerometer and gyro data into cartesian position changes
//https://howtomechatronics.com/tutorials/arduino/arduino-and-mpu6050-accelerometer-and-gyroscope-tutorial/

export const accel_gyro = {
    structs:{
        accelConstant: 1/8192,  //+/-4g mpu6050    //1/16384, //+/- 2g mpu6050
        gyroConstant: 1/65.5,   //500deg/s         //1/131, //250deg/s mpu6050
        gyroXAngle:0,
        gyroYAngle:0,
        gyroZAngle:0,
        px:0,
        py:0,
        pz:0,
        sps:100,
        lastAccelTime:Date.now(),
        lastGyroTime:Date.now()
    },
    ondata:(ctx, data:{
        ax:number|number[],
        ay:number|number[],
        az:number|number[],
        gx:number|number[],
        gy:number|number[],
        gz:number|number[],
        timestamp?:number|number[]
    }|{
        ax:number|number[],
        ay:number|number[],
        az:number|number[],
        [key:string]:any,
        timestamp?:number|number[]
    }|{
        gx:number|number[],
        gy:number|number[],
        gz:number|number[],
        [key:string]:any,
        timestamp?:number|number[]
    })=>{

        if(!('ax' in data) && !('gx' in data)) return undefined; //invalid data

        if(!data.timestamp) {
            if((data.ax && Array.isArray(data.ax)) || (data.gx && Array.isArray(data.gx))) { //assume timestamp
                let len = data.ax ? data.ax.length : data.gx.length;
                let now = Date.now();
                let toInterp = [now - len*ctx.sps*1000, now];
                data.timestamp = Math2.upsample(toInterp,len);
            } else {
                data.timestamp = Date.now();
            }
        }

        let result;
        
        if(data.ax) {
            let apass = (timestamp,ax,ay,az) => {

                ax = ax*ctx.accelConstant; //assume raw data
                ay = ay*ctx.accelConstant;
                az = az*ctx.accelConstant;
    
                const accelXAngle = Math.atan((ay/Math.sqrt(ax*ax)) + az*az*180/Math.PI) + ctx.accelXError;
                const accelYAngle = Math.atan((-ax/Math.sqrt(ay*ay)) + az*az*180/Math.PI) + ctx.accelYError;
            
                return {
                    ax,
                    ay,
                    az,
                    roll:accelXAngle,
                    pitch:accelYAngle
                };
            }

            if(Array.isArray(data.timestamp)) {
                result = data.timestamp.map((v,i) => { return apass(v,data.ax[i],data.ay[i],data.az[i]); })
            }
            else result = apass(data.timestamp,data.ax,data.ay,data.az);

        }
        if(data.gx) {
            let gpass = (timestamp,gx,gy,gz) => { 
                const elapsed = timestamp - ctx.lastGyroTime;
                ctx.lastGyroTime = timestamp;

                gx = gx*ctx.gyroConstant+ctx.gyroXError; //assume raw data
                gy = gy*ctx.gyroConstant+ctx.gyroYError;
                gz = gz*ctx.gyroConstant+ctx.gyroZError;
    
                ctx.gyroXAngle += gx*elapsed;
                ctx.gyroYAngle += gy*elapsed;
                ctx.gyroZAngle += gz*elapsed;

                return {
                    gx,
                    gy,
                    gz,
                    roll:ctx.gyroXAngle,
                    pitch:ctx.gyroYAngle,
                    yaw:ctx.gyroZAngle
                }

            }

            let res;
            if(Array.isArray(data.timestamp)) {
                res = data.timestamp.map((v,i) => { 
                    if(result) {
                        let r = gpass(v,data.gx[i],data.gy[i],data.gz[i])
                        result.roll = result.roll*0.04 + r.roll*0.96; //complementary filter
                        result.pitch = result.pitch*0.04 + r.pitch*0.96;
                        result.yaw = res.yaw;
                    } 
                    else return gpass(v,data.gx[i],data.gy[i],data.gz[i]);
                });
                if(!result) result = res;
            }
            else {
                res = gpass(data.timestamp,data.gx,data.gy,data.gz);
                if(result) {
                    result.roll = result.roll*0.04 + res.roll*0.96;   //complementary filter
                    result.pitch = result.pitch*0.04 + res.pitch*0.96;
                    result.yaw = res.yaw;
                } else result = res;
            }
        } else if(ctx.gyroXAngle || ctx.gyroYAngle || ctx.gyroZAngle) { //e.g. if accel and gyro are reported separately (looking at you, muse O__O)
            result.roll = result.roll*0.04 + ctx.gyroXAngle*0.96;  //complementary filter
            result.pitch = result.pitch*0.04 + ctx.gyroYAngle*0.96;
            result.yaw = ctx.gyroXAngle;
        }

        //add estimated position offsets px, py, pz
        if(result.ax) {

            const setPositionOffset = (timestamp, result) => {
                const elapsed = timestamp - ctx.lastAccelTime;
                ctx.lastAccelTime = timestamp;

                ctx.px += result.ax*elapsed*elapsed*Math.cos(ctx.pitch*Math.PI*0.005555555555); //correct for angle in local coordinate space
                ctx.py += result.ay*elapsed*elapsed*Math.cos(ctx.roll*Math.PI*0.005555555555);
                ctx.pz += result.az*elapsed*elapsed*Math.sin(ctx.pitch*Math.PI*0.005555555555);

                result.px = ctx.px;
                result.py = ctx.py;
                result.pz = ctx.pz;

                return result;

            }

            if(Array.isArray(data.timestamp)) {
                data.timestamp.map((timestamp,i) => {
                    setPositionOffset(timestamp, result);
                });
            } else {
                setPositionOffset(data.timestamp, result);
            }

        }

        return result;
    }
} as SubprocessContextProps

//e.g. combine with gps to get local absolute position changes