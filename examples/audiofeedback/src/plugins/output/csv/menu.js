import { visualizeDirectory } from "../../../../../../extras/storage/BFS_CSV";

export const tagName ='div'
export const innerHTML = 'CSVs'
export const onrender = (self) => {
    //console.log('rendering html')
    visualizeDirectory('data', self);
}