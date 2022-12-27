## HTTPfrontend

The HTTPfrontend service mainly provides some macros for xhr requests. 

Using .listen(), this frontend also can proxy the window's built in fetch function so you can intercept http responses which can act.

```ts

import {HTTPfrontend} from 'graphscript'

const http = new HTTPfrontend();

http.listen()

//now check the console! 

```

You can listen to specific paths independently and customize the fetch responses using cloned responses (so normal page flow is not disturbed).