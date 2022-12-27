import * as core from '../src/core/Graph';
// import * as graph from '../examples/graph/index'
import esmTree from '../examples/graph/tree'

const roots = Object.assign({}, esmTree) as any
delete roots.nodeE 


describe(`All ES Component input objects are accepted`, () => {

  describe(`object components are instantiated properly`, () => {

    // const model = graph.model.nodeA
    let component;

    beforeAll(() => {
      component = new core.Graph({ roots });
      // componentWithNested = core.create(graph.model.nodeB);
    })

    test('instantiated component is a Graph', () => {
      expect(component.constructor).toStrictEqual(core.Graph);
    });

  //   test('instantiated component has function that are bound to the node', () => {
  //     expect(component.jump).not.toEqual(model.jump); // bound to the node
  //   });

  // })

  // describe('direct functions are wrapped as components', () => {
  //   const model = graph.model.nodeD
  //   let component;

  //   beforeAll(() => {
  //     component = core.create(model);
  //   })

  //   test('instantiated component has values that match the model', () => {
  //     expect(component.default).not.toEqual(model); // bound to the node
  //   })

  //   test('wrapped function returns the expected output', () => {
  //     const arr = [1,2,3,4,5]
  //     const added = arr.reduce((a,b) => a + b, 0)
  //     const res = component.default(...arr)
  //     expect(res).toStrictEqual(added);
  //   })
  // })

  // describe('nested functions are appropriately listened to', () => {
  //   const model = graph.model.nodeD
  //   const input = [1,2,3,4,5]
  //   const expected = input.reduce((a,b) => a + b, 0)
  //   let component, reactive, state: {[x: string]: any} = {};


  //   beforeAll(() => {
  //     reactive = {
  //         fn: model,
  //         latest: undefined,
  //         __listeners: {
  //             fn: 'latest'
  //         }
  //     }
    
  //     component = core.create(reactive, undefined, {listen: (path, update) => {
  //       state[path] = update 
  //   }})
  //   })


  //   test('instantiated component has values that match the model', () => {
  //     expect(component.fn).not.toEqual(reactive.fn); // bound to the node
  //     expect(component.latest).toStrictEqual(reactive.latest);
  //   })

  //   test('nested function returns the expected output', () => {
  //     const res = component.fn(...input)
  //     expect(res).toStrictEqual(expected);
  //   })

  //   test('the listener has updated the linked value', () => {
  //     expect(state.fn).toStrictEqual(expected);
  //     expect(component.latest).toStrictEqual(expected);
  //   })
  // })

  // describe('classes are natively instanced', () => {
  //   let component, copy, object;

  //   beforeAll(() => {
  //     component = core.create(graph.model.nodeG);
  //     copy = core.create(graph.model.nodeH);
  //     object = core.create(graph.model.nodeI);

  //     component.default()
  //     copy.default()
  //     object.default()
  //     component.default()
  //   })

  //   test('class instances have different root references', () => {
  //     expect(component.default).not.toEqual(copy.default); // bound to the node
  //     expect(component.value).not.toStrictEqual(copy.value); // Values are compared for similarity only
  //     expect(component.unshared.value).not.toStrictEqual(copy.unshared.value); // Values are compared for similarity only
  //   })

  //   test('class instances have matching shared values', () => {
  //     expect(component.shared).toStrictEqual(copy.shared);
  //     expect(component.shared.value).toStrictEqual(copy.shared.value);
  //   })

  //   test('object instances have different root references because of deep cloning', () => {
  //     expect(object.shared).not.toEqual(component.shared);
  //     expect(object.value).not.toStrictEqual(component.value); // Values are compared for similarity only
  //     expect(object.default).not.toEqual(component.default); // bound to the node
  //   })
  // })

  // describe('arrays of objects are batch processed', () => {

  //   let model = [graph.model.nodeA, graph.model.nodeB, graph.model.nodeD, graph.model.nodeG]
  //   let components;

  //   beforeAll(() => {
  //     components = core.create(model);
  //   })

  //   test('all components have ben returned', () => {
  //     expect(components.length).toStrictEqual(model.length);
  //   })
  // })

  // describe('components can be loaded directly from source uri', () => {

  //   let fromStringComponent, component;
  //   let fromStringModel = './demos/graph/nodes/nodeA.js', model = graph.model.nodeA;

  //   beforeAll(() => {
  //     component = core.create(model)
  //     fromStringComponent = core.create(fromStringModel, undefined, { utilities: { bundle: esm.bundle.get}});
  //     console.log('component', component)
  //     console.log('fromStringComponent', fromStringComponent)
  //   })

  //   test('the original value of the uri component is maintained', () => {
  //     expect(fromStringComponent.__.original).toStrictEqual(fromStringModel);
  //   })

  //   // TODO: Ensure that the string component is being properly loaded.
  //   // Currently, I'm not sure if i'm just specifying an incorrect path or if there's a bug
  //   // test('both components have the same properties', () => {
  //   //   console.log(fromStringComponent, component)
  //   //   expect(fromStringComponent.x).toStrictEqual(component.x);
  //   //   expect(fromStringComponent.y).toStrictEqual(component.y);
  //   //   expect(fromStringComponent.jump).toStrictEqual(component.jump);
  //   // })
  })

})


// // ----------------- Listeners -----------------
// describe(`Flow behaviors are handled appropriately`, () => {

//   // 1. Can unsubscribe from a single listener
//   // 2. All listeners for a given node are removed when the node is removed


//   // test('the original value of the uri component is maintained', () => {
//   //   expect(fromStringComponent.__.original).toStrictEqual(fromStringModel);
//   // })

// })

// // ----------------- __parent -----------------
// describe(`Parenting behaviors are handled appropriately`, () => {

// })

// // ----------------- __props -----------------
// describe(`Props behaviors are handled appropriately`, () => {

// })