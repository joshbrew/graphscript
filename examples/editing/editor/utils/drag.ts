import Editor from "../Editor";
import { Node } from "../node/Node";
import { Port } from "../node/port/Port";

const dragElement = (workspace:Editor, dragItem: Node, onMove, onDown,onUp) => {
    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;
    var defaultScale = 1.0

    // container.addEventListener("touchstart", dragStart, false);
    // container.addEventListener("touchend", dragEnd, false);
    // container.addEventListener("touchmove", drag, false);

    dragItem.shadowRoot.addEventListener("mousedown", dragStart, false);
    window.addEventListener("mouseup", dragEnd, false);
    window.addEventListener("mousemove", drag, false);

    // let transform = dragItem.style.cssText.match(/transform: ([^;].+);\s?/) // TODO: Check persistence
    // let transformString: string
    // if (transform) transformString = transform[1]
    
    // if (transformString) {
    //   // let scale = transformString.match(/scale\(([^\)].+)\)\s?/)
    //   // if (scale) scale = scale[1]
    //   // else scale = 1

    //   let translateString = transformString.match(/translate\(([^\)].+)\)\s?/)
    //   if (translateString){
    //     let arr = translateString[1].split(',')
    //     xOffset = parseFloat(arr[0].split('px')[0])
    //     yOffset = parseFloat(arr[1].split('px')[0])
    //   }
    // } else {
    //   dragItem.style.transform = `scale(${defaultScale})`;
    // }

    function dragStart(e) {
      
        const x  = dragItem.x
        const y  = dragItem.y

      if (e.type === "touchstart") {
        initialX = (e.touches[0].clientX - (workspace.context.zoom*defaultScale)*x);
        initialY = (e.touches[0].clientY - (workspace.context.zoom*defaultScale)*y);
      } else {
        initialX = (e.clientX - (workspace.context.zoom*defaultScale)*x);
        initialY = (e.clientY - (workspace.context.zoom*defaultScale)*y);
      }

      // Account For Nested Control Objects
      if (dragItem.shadowRoot.contains(e.target)){
        if (!(e.target instanceof Port)) active = true;
        onDown()
      }
    }

    function dragEnd() {
      initialX = currentX;
      initialY = currentY;

      active = false;
      onUp()
    }

    function drag(e) {
      if (active) {
      
        e.preventDefault();
      
        if (e.type === "touchmove") {
          currentX = (e.touches[0].clientX - initialX)/(workspace.context.zoom*defaultScale);
          currentY = (e.touches[0].clientY - initialY)/(workspace.context.zoom*defaultScale);
        } else {
          currentX = (e.clientX - initialX)/(workspace.context.zoom*defaultScale);
          currentY = (e.clientY - initialY)/(workspace.context.zoom*defaultScale);
        }


        dragItem.updatePosition(currentX, currentY)

        onMove()
      }
    }
}

export default dragElement