import { visualizeDirectory } from "../../../../extras/storage/BFS_CSV.js";

export const tagName ='div'
export const innerHTML = 'CSVs'
export const onrender = (self) => {
    //console.log('rendering html')
    visualizeDirectory('data', self);
}

export default (...input) => input