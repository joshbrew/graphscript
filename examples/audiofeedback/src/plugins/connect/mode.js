
export const tagName = 'select'
export const attributes = {
    innerHTML:`
        <option value='BLE' selected>BLE</option>
        <option value='USB'>USB</option>
    `,
    onchange:(ev)=>{
        if(ev.target.value === 'BLE') {
            ev.target.parentNode.querySelector('#selectUSB').style.display = 'none';
            ev.target.parentNode.querySelector('#selectBLE').style.display = '';
        }
        else if(ev.target.value === 'USB') {
            ev.target.parentNode.querySelector('#selectUSB').style.display = '';
            ev.target.parentNode.querySelector('#selectBLE').style.display = 'none';
        }
    }
}

export default (...input) => input