import * as core from '../src/core/Graph';
import * as operations from '../examples/graph/operations'
import { OperationsManager } from './utils';

globalThis.graphscriptDemoLog = false

const manager = new OperationsManager(operations)

describe(`All ES Component input objects are accepted`, () => {

  describe(`object components are instantiated properly`, () => {

      beforeAll(() => manager.start())
      afterAll(() =>  manager.stop())

      test('instantiated component is a Graph', () => {
        const graph = operations.globals.graph as core.Graph
        expect(graph.constructor).toStrictEqual(core.Graph);
      });

    })
  })