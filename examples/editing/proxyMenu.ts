//add proxy menu

import { Graph, getAllProperties } from "../../src/core/Graph";
import { parseFunctionFromText } from "../../src/services/utils";
import { LGraph } from "./litegraph.js/src/litegraph";
import { addNodeToLGraph } from "./litegraphScripts";

let inpTypes = {
  "string":(p,k,v)=>{
    p[k] = v
    return p[k];
  },
  "boolean":(p,k,v)=>{if(v.toLowerCase() === "false" || v === "0" || v === "null") p[k] = false; else p[k] = true; return p[k];},
  "number":(p,k,v)=>{p[k] = parseFloat(v); return p[k];},
  "function":(p,k,v)=>{p[k] = parseFunctionFromText(v); return p[k];}, //evals
  "object":(p,k,v)=>{ v.replace("'",'"'); p[k] = JSON.parse(v);},
  "array":(p,k,v)=>{ if(!v.startsWith('[')) v = `[${v}]`; v.replace("'",'"'); p[k]=JSON.parse(v); return p[k]; }, //encapsulate strings in an array
  "functionSpreadArgs":(p,k,v)=>{ 
    if(typeof p[k] === 'function') {
      let split = v.split(',');
      split.forEach((s,i) => {
        if(s.startsWith('function') || s.startsWith('(')) {
            parsed[i] = parseFunctionFromText(s);
        }
      });
      let joined = `[${split.join(',')}]`;
      joined.replace("'",'"');
      let parsed = JSON.parse(joined) as any[];
      return p[k](...parsed);
    }
  }
};

export let makeProxyMenu = (proxyable:{[key:string]:any}, graph:Graph, editor:LGraph) => {
    let instantiateProxy = (key, args:any[]=[]) => {
      let proxy = new proxyable[key](...args);
      let keys = getAllProperties(proxy);
      return {proxy, keys};
    }
    
    let container = document.createElement('div');
    let nameInput = document.createElement('input');
    let keydropdown = document.createElement('select');
    let constructorInput = document.createElement('input');
    let constructButton = document.createElement('button');
    constructButton.innerHTML = "Construct";

    let proxySetupContainer = document.createElement('div');
    let propertydropdown = document.createElement('select');
    let propertyInput = document.createElement('input');
    let setProp = document.createElement('button');
    setProp.innerHTML = "Eval"
    let propertyInputType = document.createElement('select');
    let createProxy = document.createElement('button');
    createProxy.innerHTML = "Create Node";
  

    Object.keys(inpTypes).forEach((t,i) => { 
      propertyInputType.insertAdjacentHTML('beforeend',`<option value="${t}" ${i === 0 ? `selected` : ``}>${t}</option>`) 
    });
  
    container.insertAdjacentHTML('beforeend',`</br>Class to instantiate: `);
    container.appendChild(keydropdown);
    container.insertAdjacentHTML('beforeend',`</br>Class constructor args (evals as a spread array): `);
    container.appendChild(constructorInput);
    container.appendChild(constructButton);
    proxySetupContainer.insertAdjacentHTML('beforeend',`</br>Name Node: `);
    proxySetupContainer.appendChild(nameInput);
    proxySetupContainer.insertAdjacentHTML('beforeend',`</br>Class Property: `);
    proxySetupContainer.appendChild(propertydropdown);
    proxySetupContainer.insertAdjacentHTML('beforeend',`</br>Property Type: `);
    proxySetupContainer.appendChild(propertyInputType);
    proxySetupContainer.insertAdjacentHTML('beforeend',`</br>Input: `);
    proxySetupContainer.appendChild(propertyInput);
    proxySetupContainer.insertAdjacentHTML('beforeend',`</br>Set: `);
    proxySetupContainer.appendChild(setProp);
    proxySetupContainer.insertAdjacentHTML('beforeend',`</br>Add to Graph: `);
    proxySetupContainer.appendChild(createProxy);
    proxySetupContainer.style.display = "none";
    container.appendChild(proxySetupContainer);
    
    for(const key in proxyable) {
      keydropdown.insertAdjacentHTML('beforeend',`<option value="${key}">${key}</option>`);
    }
    keydropdown.value = "";

    keydropdown.onchange = (ev) => {
      let value = keydropdown.value;
      proxySetupContainer.style.display = "none";
      constructButton.onclick = () => {
        let args = constructorInput.value as any;
        let split = args.split(',');
        split.forEach((s,i) => {
          if(s.startsWith('function') || s.startsWith('(')) {
              parsed[i] = parseFunctionFromText(s);
          }
        });
        let joined = `[${split.join(',')}]`;
        joined = joined.replace(/'/g,'"');
        let parsed = JSON.parse(joined) as any[];

        let {proxy, keys} = instantiateProxy(value, parsed);
  
        nameInput.value = `${value}${Math.floor(Math.random()*1000000000000000)}`;
    
        propertydropdown.innerHTML = "";
        keys.forEach((k) => {
          propertydropdown.insertAdjacentHTML('beforeend',`<option value="${k}">${k}</option>`);
        });
        propertydropdown.onchange = (ev) => {
          let t = typeof proxy[propertydropdown.value]; 
          propertyInputType.value = t === "undefined" ? "string" : t;
          if(t !== 'function') {
            propertyInput.value = proxy[propertydropdown.value];
          } else propertyInput.value = "";
        }
        setProp.onclick = (ev) => {
          if(inpTypes[propertyInputType.value])
            inpTypes[propertyInputType.value](proxy, propertydropdown.value, propertyInput.value)
        }
        createProxy.onclick = (ev) => {
            let props = {
                __node:nameInput.value ? {
                    tag:nameInput.value 
                } : undefined,
                __props:proxy
                //todo: could instead list all the non-functional values from proxy here so they get set on the proxy when the node is created
            };
            let node = graph.add(props);
            addNodeToLGraph(node, graph, editor);
            nameInput.value = `${value}${Math.floor(Math.random()*1000000000000000)}`;
        }

        proxySetupContainer.style.display = "";
      }

    }
  
    return container;
    
}


export let makeNodePropsCreator = (graph:Graph, editor:LGraph) => {

  let container = document.createElement('div');
  let nameInput = document.createElement('input');
  let propsContainer = document.createElement('div');
  let addButton = document.createElement('button');
  addButton.innerHTML = "Add Prop";
  let createButton = document.createElement('button');
  createButton.innerHTML = "Create Node";
  let clearButton = document.createElement('button');
  clearButton.innerHTML = "Clear Props";

  container.insertAdjacentHTML('beforeend',`</br>Name Node: `);
  container.appendChild(nameInput);
  container.insertAdjacentHTML('beforeend',`
  <br/>Node Properties: { <br/> key : value <br/>
  `);
  container.appendChild(propsContainer);
  container.appendChild(addButton);
  container.insertAdjacentHTML('beforeend',`
  <br/>}<br/>
  `);
  container.appendChild(clearButton);
  container.appendChild(createButton);

  clearButton.onclick = () => {
    propsContainer.innerHTML = ""; //clear options
  }

  let addProp = () => {
    let prop = document.createElement('div');
    let keyInput = document.createElement('input');
    keyInput.id = 'key';
    let propInput = document.createElement('input');
    let propInputType = document.createElement('select');
    let delProp = document.createElement('button');
    delProp.innerHTML = 'X';
    delProp.onclick = () => {
      prop.remove();
    }
    propInputType.id = 'ptype';
    Object.keys(inpTypes).forEach((t,i) => { 
      if(t !== 'functionSpreadArgs')
        propInputType.insertAdjacentHTML('beforeend',`<option value="${t}" ${i === 0 ? `selected` : ``}>${t}</option>`) 
    });
    propInput.id = 'value';
    prop.appendChild(keyInput);
    prop.insertAdjacentHTML('beforeend',':');
    prop.appendChild(propInput);
    prop.appendChild(propInputType);
    prop.appendChild(delProp);
    prop.insertAdjacentHTML('beforeend','<br/>');
    propsContainer.appendChild(prop);
  }

  nameInput.value = `node${Math.floor(Math.random()*1000000000000000)}`;  

  addButton.onclick = () => {
    addProp();
  }

  createButton.onclick = () => {
    let keys = Array.from(propsContainer.querySelectorAll('#key')) as any;
    let values = Array.from(propsContainer.querySelectorAll('#value')) as any;
    let types = Array.from(propsContainer.querySelectorAll('#ptype')) as any;
    
    let obj = {} as any;
    
    keys.forEach((k:any,i) => {
      if(k.value) {
        if((values[i]).value) {
          inpTypes[types[i].value](obj, k.value, values[i].value);
        }
      }
    });

    let node = graph.add(obj);
    addNodeToLGraph(node, graph, editor);

    nameInput.value = `node${Math.floor(Math.random()*1000000000000000)}`;  
  }

  addProp();

  return container;

}
  

export let makeNodeEditorMenu = (graph:Graph, editor?:LGraph) => {

  let container = document.createElement('div');
  let nameInput = document.createElement('input');
  let keydropdown = document.createElement('select');
  let constructorInput = document.createElement('input');
  let constructButton = document.createElement('button');
  constructButton.innerHTML = "Set";

  let nodeEditorContainer = document.createElement('div');
  let propertydropdown = document.createElement('select');
  let propertyInput = document.createElement('input');
  let setProp = document.createElement('button');
  setProp.innerHTML = "Eval"
  let propertyInputType = document.createElement('select');
  //let createProxy = document.createElement('button');
  //createProxy.innerHTML = "Create Node";


  Object.keys(inpTypes).forEach((t,i) => { 
    propertyInputType.insertAdjacentHTML('beforeend',`<option value="${t}" ${i === 0 ? `selected` : ``}>${t}</option>`) 
  });

  container.insertAdjacentHTML('beforeend',`</br>Select existing node: `);
  container.appendChild(keydropdown);
  //nodeEditorContainer.insertAdjacentHTML('beforeend',`</br>Name Node: `);
  //nodeEditorContainer.appendChild(nameInput);
  nodeEditorContainer.insertAdjacentHTML('beforeend',`</br>Class Property: `);
  nodeEditorContainer.appendChild(propertydropdown);
  nodeEditorContainer.insertAdjacentHTML('beforeend',`</br>Property Type: `);
  nodeEditorContainer.appendChild(propertyInputType);
  nodeEditorContainer.insertAdjacentHTML('beforeend',`</br>Input: `);
  nodeEditorContainer.appendChild(propertyInput);
  nodeEditorContainer.insertAdjacentHTML('beforeend',`</br>Set: `);
  nodeEditorContainer.appendChild(setProp);
  // nodeEditorContainer.insertAdjacentHTML('beforeend',`</br>Add to Graph: `);
  // nodeEditorContainer.appendChild(createProxy);
  nodeEditorContainer.style.display = "none";
  container.appendChild(nodeEditorContainer);
  
  
  let keys = Array.from(graph.__node.nodes.keys());
  for(const key of keys) {
    keydropdown.insertAdjacentHTML('beforeend',`<option value="${key}">${key}</option>`);
  }
  keydropdown.value = "";

  keydropdown.onchange = (ev) => {
    let value = keydropdown.value;
    //nodeEditorContainer.style.display = "none";
    //constructButton.onclick = () => {
      let args = constructorInput.value as any;
      let split = args.split(',');
      split.forEach((s,i) => {
        if(s.startsWith('function') || s.startsWith('(')) {
            parsed[i] = parseFunctionFromText(s);
        }
      });
      let joined = `[${split.join(',')}]`;
      joined = joined.replace(/'/g,'"');
      let parsed = JSON.parse(joined) as any[];

      //let {proxy, keys} = instantiateProxy(value, parsed);

      let proxy = graph.get(value);
      let pkeys = Object.keys(proxy);


  
      propertydropdown.innerHTML = "";
      pkeys.forEach((k) => {
        propertydropdown.insertAdjacentHTML('beforeend',`<option value="${k}">${k}</option>`);
      });


      propertydropdown.onchange = (ev) => {
        let t = typeof proxy[propertydropdown.value]; 
        propertyInputType.value = t === "undefined" ? "string" : t;
        if(t !== 'function') {
          propertyInput.value = proxy[propertydropdown.value];
        } else propertyInput.value = "";
      }
      setProp.onclick = (ev) => {
        if(inpTypes[propertyInputType.value])
          inpTypes[propertyInputType.value](proxy, propertydropdown.value, propertyInput.value)
      }
      // createProxy.onclick = (ev) => {
      //     let props = {
      //         __node:nameInput.value ? {
      //             tag:nameInput.value 
      //         } : undefined,
      //         __props:proxy
      //         //todo: could instead list all the non-functional values from proxy here so they get set on the proxy when the node is created
      //     };
      //     let node = graph.add(props);
      //     addNodeToLGraph(node, graph, editor);
      //     nameInput.value = `${value}${Math.floor(Math.random()*1000000000000000)}`;
      // }
    //}

    nodeEditorContainer.style.display = "";

  }

  return container;
  

}