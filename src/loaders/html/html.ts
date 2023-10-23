export function html(strings:TemplateStringsArray, ...args) {
    return function append(elm?:HTMLElement) {
        let template = document.createElement('template');
        let rand = `e${`${Math.random()}`.substring(2)}`;
        
        let combinedHTML = '';

        const withStr = (string, i) => {
            combinedHTML += string;
            if(args[i] instanceof HTMLElement) {
                combinedHTML += `<span id="${rand}"></span>`;
            } else if(args[i] !== undefined) {
                combinedHTML += args[i];
            }
        }

        strings.forEach(withStr);

        template.innerHTML = combinedHTML;
        let dummyNodes = Array.from(template.content.querySelectorAll(`#${rand}`));
        
        const withArg = (arg,i) => {
            if(arg instanceof HTMLElement) {
                let dummyNode = dummyNodes[i];
                if (dummyNode) {
                    dummyNode.parentNode.replaceChild(arg, dummyNode);
                }
            } 
        }
        
        args.forEach(withArg);
        
        if(elm) {
            elm.appendChild(template.content);
            return elm;
        }  
        return template.content;
    };
}

/**
 * 
 * let htmlfunction = html`<span></span>` //e.g. some html
 * htmlfunction(document.body); //append the template string to the desired element, or just return the prepared template element
 * 
 * Syntax highlighting with lit-html plugin: https://open-vsx.org/extension/meganrogge/template-string-converter
 
    // Example usage of the html function
    document.addEventListener("DOMContentLoaded", () => {
        const app = document.getElementById('app');

        const title = document.createElement('h1');
        title.textContent = "Welcome to HTML Function Test";

        const paragraph = document.createElement('p');
        paragraph.textContent = "This is a paragraph element created using native DOM API.";

        // Creating HTML structure using the html function
        const content = html`
            <div>
                <h2>This is a test</h2>
                ${title}
                <p>This is a paragraph element created using the html function.</p>
                ${paragraph}
            </div>
        `();

        app.appendChild(content);
    });

*/


export function xml(strings:TemplateStringsArray, ...args:any[]) {
    return function append(elm?:Node, namespace = "http://www.w3.org/1999/xhtml") {
        let parser = new DOMParser();
        let serializer = new XMLSerializer();
        let xmlDoc = parser.parseFromString('<root xmlns="' + namespace + '"></root>', 'application/xml');
        let template = xmlDoc.createElement('template');
        xmlDoc.documentElement.appendChild(template);

        for (let i = 0; i < strings.length; i++) {
            let textNode = xmlDoc.createTextNode(strings[i]);
            template.appendChild(textNode);

            if (i < args.length) {
                if (args[i] instanceof Node) {
                    template.appendChild(args[i]);
                } else if (args[i] !== undefined) {
                    let textNodeArg = xmlDoc.createTextNode(String(args[i]));
                    template.appendChild(textNodeArg);
                }
            }
        }

        if (elm) {
            elm.appendChild(template);
            return serializer.serializeToString(elm);
        }
        return serializer.serializeToString(template);
    };
} //just pasted from gpt4, not sure how useful. There's also a lit-xml plugin for this

/** Test:
 * 
 * 
    const testXmlFunction = () => {
        const namespace = "http://www.example.com/test";
        const resultContainer = document.createElement('div');
        
        const testElement = document.createElementNS(namespace, 'testElement');
        testElement.textContent = "Test Content";
        
        const xmlAppender = xml`Hello, ${'World'}! This is a ${testElement}.`;
        const xmlString = xmlAppender(resultContainer, namespace);
        
        resultContainer.innerHTML += `<pre>${xmlString}</pre>`;
        
        console.log(xmlString);
        document.body.appendChild(resultContainer);
    };

    testXmlFunction();
 * 
 * 
 */