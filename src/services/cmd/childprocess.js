//stock child process that runs services 

import { CMDService } from "./CMD.node";
import { unsafeRoutes } from '../unsafe/Unsafe.service';

const service = new CMDService({
    routes:[unsafeRoutes]
}); //now we can send/receive messages

console.log("Child process listening...")