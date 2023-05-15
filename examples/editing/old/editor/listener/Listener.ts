import WebComponent from "../../WebComponent";

import style from './styles.css'

export class Listener extends WebComponent {


    constructor(props: any, parentNode?: HTMLElement) {

        const html = ``
        
        super({
            __element: 'escode-listener',
            __template: html,
            __css: style,
            parentNode
        })

        this.connect(
          this, 
          // props.editor.graph
      )

    }

}