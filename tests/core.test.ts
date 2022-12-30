import * as core from '../src/core/Graph';
import * as operations from '../examples/graph/operations'
import { OperationsManager } from './utils';

globalThis.graphscriptDemoLog = false

const manager = new OperationsManager(operations)

const globals = operations.globals

describe(`Basic graphscript behaviors are correct`, () => {

  describe(`Nodes behave properly when instantiated on Graph instances`, () => {

      beforeAll(() => manager.start())
      afterAll(() =>  manager.stop())

      test('class-based nodes are properly instantiated', () => {
        const valid = manager.next()
        expect(valid).toStrictEqual(true);
      });

      test('model nodes are transformed into active nodes', () => {
        const update = manager.next()

        const expected = 1
        expect(update).toStrictEqual(expected);
        expect(globals.state.get('nodeA', 'x')).toStrictEqual(expected);
      });

      test('the primary node behaves the same as the model node', () => {
        const update = manager.next()
        const expected = 2
        expect(update).toStrictEqual(expected);
        expect(globals.state.get('nodeA', 'x')).toStrictEqual(expected);
        expect(globals.nodeAInstance.x).toStrictEqual(expected);
      });

      test('values are appropriately listened to', () => {
        const update = manager.next()
        const expected = 4
        expect(update).toStrictEqual(expected);
        expect(globals.state.get('nodeB', 'x')).toStrictEqual(expected);
        // expect(globals.state.get('nodeA.jump')).toStrictEqual('jumped' + expected); // TODO: This returns a function for some reason in state
      });

      const nestedListenersCheck = (update, expected, subset = false) => {
        const nodeA = globals.graph.get('nodeA')
        expect(update).toStrictEqual(expected);
        if (!subset) {
          expect(globals.state.get('nodeB.nodeC')).toStrictEqual(expected);
          expect(nodeA.listenerUpdates['nodeB.nodeC']).toStrictEqual(expected);
        }
        expect(globals.state.get('nodeB.nodeC', 'z')).toStrictEqual(expected);
        expect(nodeA.listenerUpdates['nodeB.nodeC.z']).toStrictEqual(expected);
      }

      // This is nodeC
      test("activating a nested node's operator will trigger a function listener bound to another", () => {
        const update = manager.next()
        nestedListenersCheck(update, 8)
      });

      // This is nodeC.z directly
      test('activating a nested node will trigger a bound listener to another', () => {
        const update = manager.next()
        nestedListenersCheck(update, 9, true)
      });

      const jumpCheck = (update) => {
        const expected = 'jumped'
        const nodeC = globals.graph.get('nodeB.nodeC')
        expect(update).toStrictEqual(expected);
        expect(nodeC.listenerUpdates['nodeA.jump']).toStrictEqual(expected);
      }

      test('functions are appropriately listened to', () => {
        const update = manager.next()
        jumpCheck(update)
      });

      test('using the graph helper to call a function is equivalent to a direct function call', () => {
        const update = manager.next()
        jumpCheck(update)
      });
    })
  })