
// ------------ Get All Property Names ------------

const rawProperties = {}
const globalObjects = ['Object', 'Array', 'Map', 'Set']

export function all( obj ) {

    var props = [];
    if (obj) {
        do {

            const name = obj.constructor?.name 
            const isGlobalObject = globalObjects.includes(name)
            if (globalObjects.includes(name)) {
                if (!rawProperties[name]) rawProperties[name] = [...Object.getOwnPropertyNames(globalThis[name].prototype)]
            }

            Object.getOwnPropertyNames( obj ).forEach(function ( prop ) {
                if (isGlobalObject && rawProperties[name].includes(prop)) return; // Skip inbuilt class prototypes
                if ( props.indexOf( prop ) === -1 ) props.push( prop )
            });
        } while ( obj = Object.getPrototypeOf( obj ));
    }

    return props;
}
