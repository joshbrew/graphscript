## TODO

PRIORITY 1. Construct listener and __args objects from connecting nodes.
2. Write new variables to globalThis or to specific nodes. Include parsing functions.
3. Dynamically type unknown output types? E.g. function outputs with unknown types or undefined values.
4. Instantiate/delete new nodes from prototypes or proxying classes (passing a class constructor function as a prototype or in __proxy). Incl listener cleanup. Node menu should be based on node and then available methods/values. We should include icons to indicate the type.
    4-1. Also instantiate class instances in proxy nodes or other node instances (e.g. by getting the initial values and copying it to a new name) so you can create lots of entities (e.g. html or game objects)
5. Widgets for values etc. 
6. Custom widgets or UI overlay? E.g. a "+" sign underneath a pin to add and declare more pins e.g. for custom branch conditions.
7. Print out modified root.
8. Save editor state.
9. Styling. Color code the nodes based on type (e.g. a variable or method or an operator), including the title bar and the i/o colors based on type so they're not just green and grey

:DONE: 
Parse input arguments names (possibly types?) for nodes representing functions


10. See if we can port into the babylonjs editor. 