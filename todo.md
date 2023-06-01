## TODO

- Make proper loaders for all of our services so they can be declared and used in the tree definitions

- Optimize some of the remote callback system, use a single callback and just check a list of callbackIds instead of a new messageevent for every request as it will parse JSON for each callback (much more inefficient). This is only for going pedal-to-the-metal with sockets etc but why shouldn't we.

- Make definitive benchmarks

- Document the router etc in great detail, need to streamline it a bit more as it introduces a lot of weird options structures that are a bit convoluted.

- fix the local struct backend, it just seems to be stringifying for some reason.

- Forever bug testing and trying to raise things to "industry standard" without making it artificially difficult to use the whole system. We want this to be baby's first super API

## Demos todo

- Editor: demonstrate live editing on a multithreaded + server application

- bring other examples more up to date, try to get closer to more typical game logic standards our examples are all made by flying by the seat of our pants and not trying to seriously model standard engine code. That's part of the point though so there's a balance to strike between creative code and familiarity. Priority 1 is readability of the logic however, as it makes complex systems that much easier to build.