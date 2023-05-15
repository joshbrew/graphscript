const moduleStringTag = '[object Module]'

export const esm = (object) => {
    const res = object && (!!Object.keys(object).reduce((a,b) => {
        const desc = Object.getOwnPropertyDescriptor(object, b)
        const isModule = (desc && desc.get && !desc.set) ? 1 : 0
        return a + isModule
    }, 0) || Object.prototype.toString.call(object) === moduleStringTag)

    return !!res
}