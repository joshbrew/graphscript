// import css from "./CanvasWithControls.css" //uncomment if using bundler and comment out the fetch operations
// import html from "./CanvasWithControls.html"

let css, html; //comment out if importing above

export class CanvasWithControls extends HTMLElement {

    ondraw;

    constructor() {
        super();
        
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        this.lineWidth = 5;

        this.attachShadow({ mode: "open" });

    }

    static get observedAttributes() {
        return ['width', 'height','controls'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'width') {
            this.canvasWidth = parseInt(newValue);
            if(this.canvas) {
                this.canvas.width = this.canvasWidth;
                this.ctx.lineWidth = this.lineWidth;
            } 
        } else if (name === 'height') {
            this.canvasHeight = parseInt(newValue);
            if(this.canvas) 
            {
                this.canvas.height = this.canvasHeight;
                this.ctx.lineWidth = this.lineWidth;
            }
        } else if(name === 'controls') { 
            if(newValue && newValue !== 'false') {
                this.shadowRoot.getElementById('controls-container').style.display = '';
            } else {
                this.shadowRoot.getElementById('controls-container').style.display = 'none';
            }
        }
    }

    // Additional methods or event handlers can be defined here
    setup = async () => {
        if(this.fetch) await this.fetch;

        this.canvas = this.shadowRoot.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        const canvas = this.canvas;
        const ctx = this.ctx;

        const maxScale = 5;
        // Set initial canvas width and height
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        
        let cursorStyle = 'crosshair';

        canvas.style.cursor = cursorStyle;

        let color = "#000000";
        // Initialize canvas properties
        ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = this.lineWidth;

        // Your existing event listeners can be added here
        const colorPicker = this.shadowRoot.getElementById("color-picker");
        colorPicker.addEventListener("input", (event) => {
            color = event.target.value;
            this.ctx.strokeStyle = event.target.value;
        });

                
        const clearButton = this.shadowRoot.getElementById("clear-button");
        clearButton.addEventListener("click", () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        const zoomRange = this.shadowRoot.getElementById("zoom-range");
        zoomRange.addEventListener("input", (event) => {
            const scale = parseFloat(event.target.value);
            canvas.style.transform = `scale(${scale})`;
        });

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        let isPanning = false;
        let scale = 1; // Initialize the scale factor
        let translateX = 0; // Initialize the horizontal translation
        let translateY = 0; // Initialize the vertical translation
        let initialX = 0; // Store initial X coordinate for panning
        let initialY = 0; // Store initial Y coordinate for panning

        let recenter = false;

        let onzoomEvent = (event) => {
            const rect = canvas.getBoundingClientRect();
            let newScale, offsetXBefore, offsetXAfter, offsetYBefore, offsetYAfter;

            // Calculate the new scale value based on the scroll direction
            if(event) {
                const delta = event.deltaY > 0 ? -0.1 : 0.1;
                newScale = Math.min(Math.max(0.1, scale + delta), maxScale);
            }
        
            if(!event || recenter || newScale < 1) {
                newScale = 1;
                translateX = 0;
                translateY = 0;
                offsetXBefore = 0;
                offsetYBefore = 0;
                offsetXAfter = 0;
                offsetYAfter = 0;
                recenter = false;
            } else {
            // Calculate the mouse position relative to the canvas before scaling
                offsetXBefore = (event.clientX - rect.left) / scale - translateX;
                offsetYBefore = (event.clientY - rect.top) / scale - translateY;

            // Calculate the mouse position relative to the canvas after scaling
                offsetXAfter = (event.clientX - rect.left) / newScale - translateX;
                offsetYAfter = (event.clientY - rect.top) / newScale - translateY;
            }
            // Adjust the translation to maintain the zooming point
            translateX += offsetXBefore - offsetXAfter;
            translateY += offsetYBefore - offsetYAfter;

            // Apply the new transform with both scale and translation
            canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${newScale})`;

            // Update the scale variable for future calculations
            scale = newScale;
            zoomRange.value = newScale;
        }


        const recenterButton = this.shadowRoot.getElementById("recenter-button");
        recenterButton.addEventListener("click", () => {
            recenter = true;
            onzoomEvent();
        });


        canvas.parentElement.addEventListener("wheel", (event) => {
            event.preventDefault();
            onzoomEvent(event);
        });

        canvas.addEventListener("mousedown", (event) => {
            // Check if the middle mouse button is pressed or the Alt key is held down
            if (event.button === 1 || event.altKey) {
                canvas.style.cursor = "move";
            } else {
                [lastX, lastY] = [event.offsetX * (this.canvasWidth / canvas.clientWidth), event.offsetY * (this.canvasHeight / canvas.clientHeight)];
            }
        });

        let drawPixel = (event) => {
            const x = event.offsetX * (this.canvasWidth / canvas.clientWidth);
            const y = event.offsetY * (this.canvasHeight / canvas.clientHeight);
            ctx.fillRect(
                x - this.lineWidth / 2,
                y - this.lineWidth / 2,
                this.lineWidth,
                this.lineWidth
            );
            if(this.ondraw) {
                this.ondraw({x,y,color,isLineDrawingMode,lineWidth});
            }
        };

        canvas.parentElement.addEventListener("mousedown", (event) => {
            // Check if the middle mouse button is pressed or the Alt key is held down
            if (event.button === 1 || event.altKey) {
                isPanning = true;
                initialX = event.clientX - translateX;
                initialY = event.clientY - translateY;
                canvas.parentElement.style.cursor = "move";
            } else {
                isDrawing = true;
                if (isLineDrawingMode) { //need to move to trigger lines
                    ctx.strokeStyle = color;
                } else {
                    // Pixel drawing mode
                    ctx.fillStyle = color; // Set fill style to the selected color
                    //thrice because it grays out on first draw for some reason
                    drawPixel(event);
                    drawPixel(event);
                    drawPixel(event);
                }
            }

            
        });

        let draw = (event) => {
            if (isLineDrawingMode) {
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(
                    typeof lastX === 'number' ? lastX : event.offsetX * (this.canvasWidth / canvas.clientWidth),
                    typeof lastY === 'number' ? lastY : event.offsetY * (this.canvasHeight / canvas.clientHeight)
                );
                const x = event.offsetX * (this.canvasWidth / canvas.clientWidth);
                const y = event.offsetY * (this.canvasHeight / canvas.clientHeight);
                ctx.lineTo(x, y);
                ctx.stroke();
                if(this.ondraw) {
                    this.ondraw({x,y,lastX,lastY,color,isLineDrawingMode,lineWidth})
                }
                [lastX, lastY] = [x, y];
            } else {
                // Pixel drawing mode
                ctx.fillStyle = color;
                drawPixel(event);
            }
        }

        canvas.addEventListener("mousemove", (event) => {
            if (isDrawing) {
                draw(event);
            }
        });

        canvas.parentElement.addEventListener("mousemove", (event) => {
            if (isPanning) {
                if (event.clientX - initialX !== 0 || event.clientY - initialY !== 0) {
                    translateX = event.clientX - initialX;
                    translateY = event.clientY - initialY;
                    canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
                }
            }
        });


        canvas.addEventListener("mouseup", () => {
            isDrawing = false;
            lastX = undefined; lastY = undefined;
            canvas.style.cursor = cursorStyle;
        });

        canvas.addEventListener("mouseout", () => {
            isDrawing = false;
        });

        canvas.parentElement.addEventListener("mouseup", () => {
            isPanning = false;
            canvas.parentElement.style.cursor = "default";
        });

        canvas.parentElement.addEventListener("mouseout", () => {
            isPanning = false;
        });


        let isLineDrawingMode = true; // Flag for line drawing mode
        let lineWidthLabel = this.shadowRoot.getElementById('line-label');
        let lineWidthInput = this.shadowRoot.getElementById("line-width"); // Line width input element

        // Event listener for the line mode toggle button
        const toggleModeButton = this.shadowRoot.getElementById("toggle-mode-button");
        toggleModeButton.addEventListener("click", () => {
            isLineDrawingMode = !isLineDrawingMode; // Toggle line drawing mode
            if (isLineDrawingMode) {
                toggleModeButton.innerHTML = "Line Mode";
                lineWidthLabel.innerHTML = "Line Width:";
                cursorStyle = "crosshair"; // Set cursor to crosshair in line drawing mode
            } else {
                toggleModeButton.innerHTML = "Pixel Mode";
                lineWidthLabel.innerHTML = "Pixel Size:";
                cursorStyle = "default"; // Set cursor to default in pixel drawing mode
            }
            canvas.style.cursor = cursorStyle;
        });

        // Event listener for line width input
        lineWidthInput.addEventListener("input", (event) => {
            this.lineWidth = parseInt(event.target.value); // Update line width based on user input
            ctx.lineWidth = this.lineWidth; // Apply the new line width to the context
        });

    }

    connectedCallback() {
        // Code to run when the element is added to the DOM   

        //Fetch HTML and CSS files asynchronously (comment out if bundling html and css instead)
        if(!css || !html) {
            this.fetch = Promise.all([
                fetch("CanvasWithControls.html").then(response => response.text()),
                fetch("CanvasWithControls.css").then(response => response.text())
            ]).then(([h, c]) => {
                html = h; css = c; //should only fetch once
                this.shadowRoot.innerHTML = `
                    <style>
                        ${css}
                    </style>
                    ${html}
                `;

                // Your component's logic and event listeners here
                // ...
            }).catch(error => {
                console.error("Error fetching resources:", error);
            });

        } else {
            this.shadowRoot.innerHTML = `
                <style>
                    ${css}
                </style>
                ${html}
            `;
        }

        this.setup();
    }

    disconnectedCallback() {
        // Code to run when the element is removed from the DOM
    }

    // Define other lifecycle callbacks and methods as needed
}

customElements.define("canvas-with-controls", CanvasWithControls);