export declare function html(strings: TemplateStringsArray, ...args: any[]): (elm?: HTMLElement) => HTMLElement | DocumentFragment;
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
export declare function xml(strings: TemplateStringsArray, ...args: any[]): (elm?: Node, namespace?: string) => string;
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
