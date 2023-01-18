//stock child process that runs services 

import { CMDService } from "./CMD.node";
import { remoteGraphRoutes } from '../remote/remote.routes';

const service = new CMDService({
    routes:[remoteGraphRoutes]
}); //now we can send/receive messages

console.log("Child process listening...")