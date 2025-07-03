
// -----------------------------------------------------------------------
// state
// -----------------------------------------------------------------------

let selectedBGColor = '#ffffff';
let selectedFGColor = '#000000';
let selectedClick = true;
let selectedFade = false;
let selectedRandom = false;
let selectedErase = false;
let selectedBorder = false;
let selectedSize = 8;

// -----------------------------------------------------------------------
// pixel
// -----------------------------------------------------------------------

function setPixelOpacity(pixel, opacity){
    if (pixel === null) return;
    pixel.style.opacity = opacity;
}

function incPixelOpacity(pixel){
    const currentOpacity = pixel.style.opacity;
    if (currentOpacity >= 1) return;
    if (currentOpacity === "") pixel.style.opacity = 0.1;
    pixel.style.opacity = +pixel.style.opacity + 0.1;
}

function setPixelColor(pixel, color){
    if (pixel === null) return;
    pixel.style.backgroundColor = color;
}

function setPixelSize(pixel, size){
    if (pixel === null) return;
    pixel.style.width = `${size}px`;
    pixel.style.height = `${size}px`;
}

function setPixelBorder(pixel, color){
    pixel.style.border = `1px solid ${color}`;
}

function delPixelBorder(pixel) {
    pixel.style.border = '';
}

function createPixel(id, color, size){
    let p = document.createElement('div');
    p.classList.add('pixel');
    p.style.boxSizing = 'border-box';

    setPixelColor(p, color);
    setPixelSize(p, size);
    if(selectedBorder) setPixelBorder(p, selectedBGColor);

    const handleRender = (e) => {

        if (selectedClick && e.buttons != 1)
            return;
 
        if (selectedErase) 
            return setPixelColor(p, selectedBGColor);

        if (selectedFade)
            incPixelOpacity(p);

        if (selectedRandom) {
            const r = +255*Math.random();
            const g = +255*Math.random();
            const b = +255*Math.random();
            color = `rgb(${r}, ${g}, ${b})`;
            return setPixelColor(p, color);
        }
        return setPixelColor(p, selectedFGColor);
            
    };

    p.addEventListener('mousedown', handleRender);
    p.addEventListener('mouseenter', handleRender);
    return p;
}

// -----------------------------------------------------------------------
// Canvas
// -----------------------------------------------------------------------

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;

let canvas = document.querySelector('.canvas');
canvas.style.width = `${CANVAS_WIDTH}px`;
canvas.style.height = `${CANVAS_HEIGHT}px`;

let background = document.querySelector('.background');
background.style.width = `${CANVAS_WIDTH}px`;
background.style.height = `${CANVAS_HEIGHT}px`;

function setCanvasBackground(color){
    background.style.backgroundColor = color;
}

function setCanvasColor(color){
    pixels = document.querySelectorAll('.pixel');
    pixels.forEach(p => setPixelColor(p, color));
}

function setCanvasOpacity(value){
    pixels = document.querySelectorAll('.pixel');
    pixels.forEach(p => setPixelOpacity(p, value));
}

function setCanvasBorder(color){
    pixels = document.querySelectorAll('.pixel');
    pixels.forEach(p => setPixelBorder(p, color));
}

function delCanvasBorder(){
    pixels = document.querySelectorAll('.pixel');
    pixels.forEach(p => delPixelBorder(p));
}

function setCanvasContent(size, color){
    for(let row = 1; row <= size; row++){
        for(let col = 1; col <= size; col++){
            const p = createPixel(
                `pixel-${row == 1 ? col : +(col + ((row-1) * size))}`,
                color, 
                +(CANVAS_HEIGHT / size)
            );
            canvas.appendChild(p);
        }
    }
}

// -----------------------------------------------------------------------
// controls
// -----------------------------------------------------------------------

const FG_COLOR_PICKER = document.querySelector('#colorPickerFG');
FG_COLOR_PICKER.value = selectedFGColor;
FG_COLOR_PICKER.addEventListener('change', e => {selectedFGColor = e.target.value;})

const BG_COLOR_PICKER = document.querySelector('#colorPickerBG');
BG_COLOR_PICKER.value = selectedBGColor;
BG_COLOR_PICKER.addEventListener('change', e => {
    selectedBGColor = e.target.value;
    setCanvasBackground(selectedBGColor);
    setCanvasColor(selectedBGColor);
    setCanvasBorder(selectedBGColor);
})

const CLEAR_BUTTON = document.querySelector('#clearButton');
CLEAR_BUTTON.addEventListener('click', () => {
    setCanvasColor(selectedBGColor);
    setCanvasOpacity(1);
})

const CLICK_BUTTON = document.querySelector('#clickButton');
CLICK_BUTTON.addEventListener('click', () => {selectedClick = !selectedClick});

const RANDOM_BUTTON = document.querySelector('#randomButton');
RANDOM_BUTTON.addEventListener('click', () => {selectedRandom = !selectedRandom});

const FADE_BUTTON = document.querySelector('#fadeButton');
FADE_BUTTON.addEventListener('click', () => {selectedFade = !selectedFade});

const BORDER_BUTTON = document.querySelector('#borderButton');
BORDER_BUTTON.addEventListener('click', () => {
    selectedBorder = !selectedBorder;
    if (!selectedBorder) return delCanvasBorder();
    setCanvasBorder(selectedBGColor);
});

const ERASE_BUTTON = document.querySelector('#eraseButton');
ERASE_BUTTON.addEventListener('click', () => {selectedErase = !selectedErase});

const SIZE_SELECT = document.querySelector('#sizeSelect');
SIZE_SELECT.appendChild(new Option('8x8', '8'));
SIZE_SELECT.appendChild(new Option('16x16', '16'));
SIZE_SELECT.appendChild(new Option('32x32', '32'));
SIZE_SELECT.addEventListener('change', e => {
    canvas.innerHTML = '';
    setCanvasContent(+e.target.value, selectedBGColor);
})
setCanvasContent(selectedSize, selectedBGColor);