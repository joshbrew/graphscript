const BLE = {
    hegduino:'HEGduino (BLE)',
    blueberry2:'Blueberry (BLE)',
    blueberry:'Blueberry_Legacy (BLE)'
}

export const tagName = 'select'
export const onrender = (self)=>{                      
    for(const key in BLE) {
        self.innerHTML += `<option value='${key}'>${BLE[key]}</option>`
    }
}

export default (...input) => input