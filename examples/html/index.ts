import {Graph, htmlloader, HTMLNodeProperties} from '../../index'

let tree = {

    mainbody:{
        __element:'div',
        style:{backgroundColor:'green'},
        __children:{
            p:{
                __element:'p',
                innerText:'Lorum ipsum',
                onclick:(ev) => { 
                    if(ev.target.style.backgroundColor !== 'red') 
                        setTimeout(()=>{ev.target.style.backgroundColor = '';},1000); 
                    ev.target.style.backgroundColor = 'red'; 
                }
            } as HTMLNodeProperties,
            btn:{
                __element:'button',
                innerHTML:'Click Me!',
                onclick:(ev) => { 
                    if(ev.target.innerHTML !== 'Clicked!') 
                        setTimeout(()=>{ev.target.innerHTML = 'Click Me!';},1000); 
                    ev.target.innerHTML = 'Clicked!'; 
                }
            } as HTMLNodeProperties,
            component:{
                __template:`<div id='wcdiv'>Hello world!</div>`,
                __element:'web-component',
                __onrender:function (elm){
                    console.log('rendered!');
                    (document.getElementById('wcdiv') as HTMLElement).onclick = (ev) => {
                        if((ev.target as HTMLElement).style.backgroundColor !== 'red') 
                        setTimeout(()=>{(ev.target as HTMLElement).style.backgroundColor = '';},1000); 
                        (ev.target as HTMLElement).style.backgroundColor = 'red'; 
                    }
                }
            } as HTMLNodeProperties
        }
    } as HTMLNodeProperties
}

let graph = new Graph({
    tree,
    loaders:{
        htmlloader
    }
})