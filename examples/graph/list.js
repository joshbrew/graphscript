
export const isNode = typeof process === 'object'

const elId = `escomposeOperationsManagerLog`

const document = globalThis.document

globalThis.escodeDemoLog = true

if (!isNode) {
    const ol = document.createElement('ol')
    ol.id = elId
    document.body.appendChild(ol)

    const style = document.createElement('style')
    style.innerText = `
        ol {
            position: absolute;
            top: 0;
            right: 0;
            font-size: small;
            margin: 0;
            padding: 0;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 10px;
            overflow: scroll;
            height: 100vh;
        }

        li {
            margin-left: 25px;
        }
    `
    document.body.appendChild(style)
}

// Maintain a list of the active states
const log = {
    element: (isNode) ? undefined : document.getElementById(elId),
    add: function (message) {
        if (this.element) {
            var li = document.createElement('li');
            li.innerText = message;
            this.element.appendChild(li);
        } else if (globalThis.escodeDemoLog) console.log(message)
    },
    addCommand: function (message) {

        if (globalThis.escodeDemoLog) console.log(`--------- ${message} ---------`)
        if (this.element) {
            var li = document.createElement('div');
            li.innerText = message;
            li.style.fontWeight = 'bold';
            this.element.appendChild(li);
        }
    },
    addHeader: function (message) {
        if (globalThis.escodeDemoLog) console.log(`********* ${message} *********`)
        if (this.element) {
            var li = document.createElement('h3');
            li.innerText = message;
            this.element.appendChild(li);
        }
    },
}

export default log