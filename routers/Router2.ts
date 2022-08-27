/*
Goals of router:

Accept graph connections, incl local,
relay subscriptions from one graph to another,

Now use that to sync subscriptions

Backend Graph
      |
    Router--
     |      \
Frontend 1   Frontend 2


*/

import { Graph, GraphNode } from "../Graph"

export class Router {

    //we need to store connection settings and available endpoints
    connections:{
        [key:string]:{ //id'd connections e.g. different graphs local or remote
            [key:string]:GraphNode|Graph|{} //the services/graphs/nodes and connections by which to send on, these will be the corresponding info objects and the create/terminate functions for the appropriate services
        }
    }={}


    constructor(){

    }



}