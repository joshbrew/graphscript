const USB = {
    peanut:'Biocomp Peanut HEG (USB)',
    hegduino:'HEGduino (USB)'
}

export const tagName = 'select'
export const style = {display:'none'}
export const onrender = (self)=>{                      
    for(const key in USB) {
        self.innerHTML += `<option value='${key}'>${USB[key]}</option>`
    }
}

export default (...input) => input