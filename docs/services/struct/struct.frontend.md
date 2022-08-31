The struct frontend provides a lot of boilerplate data structures and a way to relay user connections automatically through a front and backend set of functionality to have a peristent database e.g. for forums and persistent notifications. It includes a basic authorization scheme to limit which users can access which data, to emphasize user ownership in this framework. This is a work in progress toolset as database APIs can go super deep and we are just trying to land on a practical implementation for early development needs.

Both the struct front and backends work either in browser or in nodejs, while nodejs supports MongoDB calls which we have templated heavily.

Will document after testing again....