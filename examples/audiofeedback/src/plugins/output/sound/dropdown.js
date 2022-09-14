
const soundFilePaths = [
    './src/assets/kalimba.wav',
    './src/assets/phonk.wav',
    './src/assets/synthflute.wav'
];

export const tagName = 'select'
export const innerHTML = soundFilePaths.map((p) => `<option value='${p}'>${p}</option>`)
