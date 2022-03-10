const canvas = document.getElementById('jsCanvas');

const ctx = canvas.getContext('2d');
const colors = document.getElementsByClassName('jsColor');
const range = document.getElementById('jsRange');
const mode = document.getElementById('jsMode');
const saveBtn = document.getElementById('jsSave');

// const INITIAL_COLOR = '#2c2c2c';
const CANVAS_SIZE = 700;

canvas.width = 700;
canvas.height = 700;

ctx.fillStyle = 'white';
ctx.strokeStyle = '#2c2c2c';
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.fillStyle = 'white';
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;
function stopPainting() {
  painting = false;
}

function startPainting() {
  painting = true;
}

function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}
//mouseDown이 마우스를 클릭하는 순간
function onMouseDown(event) {
  painting = true;
}
function onMouseUp(event) {
  stopPainting();
}
function onMouseLeave(event) {
  stopPainting();
}

function handleColorClick(event) {
  ctx.strokeStyle = event.target.style['background-color'];
  ctx.fillStyle = event.target.style['background-color'];
}

function handleRangeChange(event) {
  ctx.lineWidth = event.target.value;
}

function handleModeClick(event) {
  if (filling === true) {
    filling = false;
    mode.innerText = 'Fill';
  } else {
    filling = true;
    mode.innerText = 'PAINT';
  }
}
function handleCanvasClick(event) {
  if (filling) {
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}
function handleContextMenu(event) {
  event.preventDefault();
}
function handleSaveClick(event) {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'PaintJS';
  link.click();
}

if (canvas) {
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mouseleave', onMouseLeave);
  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('contextmenu', handleContextMenu);
}
if (colors) {
  Array.from(colors).forEach(color =>
    color.addEventListener('click', handleColorClick)
  );
}

if (range) {
  range.addEventListener('input', handleRangeChange);
}

if (mode) {
  mode.addEventListener('click', handleModeClick);
}

if (saveBtn) {
  saveBtn.addEventListener('click', handleSaveClick);
}
