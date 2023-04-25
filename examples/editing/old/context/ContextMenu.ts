import WebComponent from "../WebComponent";

import style from './styles.css'
import html from './index.html'

type MenuItem = {
    text: string;
    onclick: (e:any, returned: any) => any
  }
  
  
  type Response = {
    condition: (target: HTMLElement[]) => boolean | any
    contents: (ev: MouseEvent) => MenuItem[];
  }
  

export class ContextMenu extends WebComponent {

    responses: Map<string, Response> = new Map()

    constructor() {
        super({
            __element: 'escode-context-menu',
            __template: html,
            __css: style
        })

        this.connect(this)
    }

    __onrender () {
        this.list = (this.shadowRoot ?? this).querySelector('ul')

        /** close the right click context menu on click */
        window.addEventListener('click', this.onClick)

        /** 
         present the right click context menu ONLY for the elements having the right class
        */
        window.addEventListener('contextmenu', this.onContextMenu)

    }


    onClick() {
        this.style.display = 'none';
        if (this.style.display === 'block') document.body.style.overflow = ''
    }

    setResponse = (id, info: Response) => this.responses.set(id, info)

    delete = (id) => this.responses.delete(id)

    onContextMenu = (e) => {

        document.body.style.overflow = 'hidden'


        this.list.innerHTML = '' // Clear


        let count = 0;
        this.responses.forEach((o) => {
            // console.log(o, o.condition(selected))

            const isMatch = o.condition(e.path ?? [e.target])
            if (isMatch) {
                e.preventDefault();

                // Correct for Parent Window Offset
                let parent = (this.parentNode as any)
                if (parent.host) parent = parent.host // LitElement correction
                var rect = parent.getBoundingClientRect()
                this.style.left = e.clientX - rect.left + 'px'
                this.style.top = e.clientY - rect.top + 'px'
                this.style.display = 'block'
                const list = o.contents(e) ?? []

                if (list.length > 0) {

                    if (count > 0) this.list.appendChild(document.createElement('hr')) // Split

                    list.forEach(item => {
                        const li = document.createElement('li')
                        li.innerHTML = item.text
                        li.onclick = (ev) => {
                            item.onclick(ev, isMatch)
                        }
                        this.list.appendChild(li)
                    })

                    count++
                }
            }
        })
    }

}