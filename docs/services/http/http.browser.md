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

To call a node on the HTTPbackend, you can specify any url e.g. `https://localhost:8080/ping` and a method e.g. GET, POST, or any arbitrary method with inputs in the body. This will return results or if a string template is specified on a GET request then it will return a page response to you. You can easily specify site redirects this way, too, or specify as many different custom methods on a single URL as you want.

Pretty cool! Lots of untapped potential here.
