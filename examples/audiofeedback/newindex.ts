//@ts-nocheck

//resources
// import { DOMService, SubprocessWorkerInfo } from 'graphscript'//'../../index'////'../../index';
import { DOMService, SubprocessWorkerInfo } from '../../index'//'../../index'////'../../index';

// plugins
import * as select from './src/plugins/select/index.js'
import * as connect from './src/plugins/connect/index.js'
import * as output from './src/plugins/output/index.js'

import './index.css'

//types
import { ElementProps, ElementInfo } from 'graphscript/services/dom/types/element';
//import { ComponentProps } from 'graphscript/services/dom/types/component';

//start of your web page
const webappHtml = {
    'app':{
        tagName:'div',
        children:{
            'devices':{
                tagName:'div',
                children:{
                    'devicediv':{
                        tagName:'div',
                        children:{
                            'connectheader': connect.header as ElementProps,
                            'connectmode': connect.mode as ElementProps,
                            'selectUSB': select.usb as ElementProps,
                            'selectBLE': select.ble as ElementProps,
                            'connectDevice': connect.device as ElementProps
                        }
                    }
                }
            },
            'output':{
                tagName:'div',
                children:{
                    'playsounds':{
                        tagName:'div',
                        children:{
                            'soundheader': output.sound.header as ElementProps,
                            'soundDropdown': output.sound.dropdown as ElementProps,
                            'play': output.sound.play as ElementProps,
                            'stop':output.sound.stop as ElementProps
                        }
                    } as ElementProps,
                    'stats': output.stats.start as ElementProps,
                    'resetstats': output.stats.reset as ElementProps,
                    'waveform': output.waveform as ElementProps,
                    'csvmenu': output.csv.menu as ElementProps,
                }
            } as ElementProps
        }
    } as ElementProps
}


const webapp = new DOMService({
    routes:webappHtml
});