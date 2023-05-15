
import { WorkerInfo, WorkerService, remoteGraphRoutes } from '../../../../index';

import worker from './worker'

//main thread


const graph = new WorkerService({
    //props:{} //could set the props instead of globalThis but it really does not matter unless you want to bake in for more complex service modules
    roots:{
        ...remoteGraphRoutes,
    }
});

console.log('Worker Service', graph);


const worker1 = graph.addWorker({url:worker}) as WorkerInfo;
const worker2 = graph.addWorker({url:worker}) as WorkerInfo;
const worker3 = graph.addWorker({url:worker}) as WorkerInfo;

//simulate long tasks
function taskA(input) { // SCOPE REFACTOR: Might actually need to pass self and origin...
    return new Promise((res,rej) => {
        setTimeout(() => {
            console.log(input,42);
            res(42);
        }, 3000) //long task
    });
};

function taskB(input) { // SCOPE REFACTOR: Might actually need to pass self and origin...
    return new Promise((res,rej) => {
        setTimeout(() => {
            console.log(input,42);
            res(42);
        }, 1000) //long task
    });
};

function taskC(input) { // SCOPE REFACTOR: Might actually need to pass self and origin...
    return new Promise((res,rej) => {
        setTimeout(() => {
            console.log(input,42);
            res(42);
        }, 1500) //long task
    });
};

function subTaskA(input:number) {
    console.log('multiplying',input,'by 10');
    return input * 10;
}

function subTaskB(input:number) {
    console.log('applying log to',input);
    return Math.log(input);
}

graph.run('transferFunction',
    taskA,
    worker1, 
    'task' //in case of minification really
);

graph.run('transferFunction',
    taskB,
    worker2, 
    'task' 
);

graph.run('transferFunction',
    taskC,
    worker3, 
    'task' 
);


//now for a message channel pipeline.
graph.run('transferFunction',
    subTaskA,
    worker1, 
    'subTaskA' 
).then(console.log);

graph.run('transferFunction',
    subTaskB,
    worker2, 
    'subTaskB'
).then(console.log);

let portId = graph.establishMessageChannel(worker1, worker2);

//subscribe worker 2 to worker 1 directly (no overhead on main thread)
worker2.post('subscribeToWorker',[
    'subTaskA',
    portId,
    'subTaskB'
]);

//now subscribe to the output on the main thread (or it could be a rendering thread etc., mind the rules of using threads!)
worker2.subscribe('subTaskB',(res) => {
    console.log('result from worker2', res);
}).then(() => {
    worker1.run('subTaskA', 42); //makes sure this runs after worker\2 is ready
});



worker1.run('task','What is the meaning of life?');
worker2.run('task','What is the meaning of life?');
worker3.run('task','What is the meaning of life?');
