//frontend (browser-compatible) exports

export * from './src/core/Graph'
export * from './src/loaders'

export { methodstrings } from './src/loaders/methodstrings'

export * from './src/services/Service'
export * from './src/services/unsafe/Unsafe.service'

export * from './src/services/ecs/ECS.service'

// export * from './services/dom/DOM.service'
// export * from './services/dom/components/index'

export * from './src/services/e2ee/E2EE.service'

//export * from './services/gpu/GPU.service'

export * from './src/services/http/HTTP.node'

export * from './src/services/sse/SSE.node'

export * from './src/services/wss/WSS.node'

export * from './src/services/cmd/CMD.node'

//export * from './src/services/struct/Struct.frontend'

// export * from './src/services/webrtc/WebRTC.browser'

//export * from './src/services/worker/Worker.service' //this needs a polyfill to work in nodejs
//export * from './src/services/worker/Subprocess'

export * from './src/services/sessions/sessions.service'

export * from './src/services/router/Router'