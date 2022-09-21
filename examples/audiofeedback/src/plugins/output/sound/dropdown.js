export const soundFilePaths = [];
export const tagName = 'select'

export const oncreate = function() {
    let target = this
    let element = target.element
    if (!element) {
        if (target.source){
            target = target.source
            element = target.element
        } 
    }

    if (element) element.innerHTML = target.soundFilePaths.map((o) => `<option value='${o.src}'>${o.label}</option>`)
}

export default (...input) => input