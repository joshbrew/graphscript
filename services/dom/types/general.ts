import {ElementOptions} from './element'
import {ComponentOptions} from './dom'
import {CanvasOptions} from './canvas'

export type CompleteOptions = {
    parentNode: HTMLElement,
    id: string
}  & (CanvasOptions | ComponentOptions | ElementOptions)