import { OperationsManager } from '../../tests/utils'
import * as config from "./operations";

const manager = new OperationsManager(config)
manager.runAll()