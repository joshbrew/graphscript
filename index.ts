//frontend (browser-compatible) exports


export * from './src/core/Graph'
export * from './src/loaders'
export * from './src/services/utils'

export { methodstrings } from './src/loaders/methodstrings'

export * from './src/services/Service'
export * from './src/services/remote/remote.routes'

export * from './src/services/ecs/ECS.service'

export * from './src/loaders/html/html.loader'

export { DOMElement, addCustomElement } from './src/loaders/html/DOMElement'
export * from './src/loaders/html/wc.loader' //includes the web component spec, html loader is a little leaner otherwise

export * from './src/services/e2ee/E2EE.service'

//export * from './services/gpu/GPU.service'

export * from './src/services/http/HTTP.browser'

export * from './src/services/sse/SSE.browser'

export * from './src/services/wss/WSS.browser'

//export * from './services/struct/Struct.frontend'

export * from './src/services/webrtc/WebRTC.browser'

export * from './src/services/worker/Worker.service'
export * from './src/services/worker/ProxyListener'
export * from './src/services/worker/WorkerCanvas'
export * from './src/services/worker/Subprocess'

export * from './src/services/sessions/sessions.service'

export * from './src/services/router/Router'