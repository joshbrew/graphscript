## TODO

- Make proper loaders for all of our services so they can be declared and used in the tree definitions

- Optimize some of the remote callback system, use a single callback and just check a list of callbackIds instead of a new messageevent for every request as it will parse JSON for each callback (much more inefficient). This is only for going pedal-to-the-metal with sockets etc but why shouldn't we.

- Make definitive benchmarks

- Document the router etc in great detail, need to streamline it a bit more as it introduces a lot of weird options structures that are a bit convoluted.

- fix the local struct backend, it just seems to be stringifying for some reason.
