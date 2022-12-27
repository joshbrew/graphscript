
export function htmlBodyBoilerPlate(html:string|string[]) {
    let template = `<!DOCTYPE html><html><head><body>`
    if(Array.isArray(html)) {
        html.forEach((src) => {
            template += src;
        })
    } else {
        template += html;
    }
    template += `</body></html>`
    return template;
}

export function scriptBoilerPlate(scripts:string|string[]) {
    let template = `<!DOCTYPE html><html><head><body>`
    if(Array.isArray(scripts)) {
        scripts.forEach((src) => {
            template += `<script src="${src}"></script>`;
        })
    } else {
        template += `<script src="${scripts}"></script>`;
    }
    template += `</body></html>`
    return template;
}


