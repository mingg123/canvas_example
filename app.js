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

var ongoingTouches = [];

function copyTouch(touch) {
  return {
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY,
  };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;
    if (id == idToFind) {
      return i;
    }
  }
  return -1; // not found
}

function onTouchMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    // var color = colorForTouch(touches[i]);
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      console.log('continuing touch ' + idx);
      ctx.beginPath();
      console.log(
        'ctx.moveTo(' +
          ongoingTouches[idx].pageX +
          ', ' +
          ongoingTouches[idx].pageY +
          ');'
      );
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      console.log(
        'ctx.lineTo(' + touches[i].pageX + ', ' + touches[i].pageY + ');'
      );
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.lineWidth = 4;
      // ctx.strokeStyle = color;
      ctx.stroke();

      ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
      console.log('.');
    } else {
      console.log("can't figure out which touch to continue");
    }
  }
}

function onTouchStart(evt) {
  evt.preventDefault();
  console.log('touchstart.');
  if (filling) {
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  } else {
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
      console.log('touchstart:' + i + '...');
      ongoingTouches.push(copyTouch(touches[i]));
      // var color = colorForTouch(touches[i]);
      ctx.beginPath();
      ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false); // a circle at the start
      // ctx.fillStyle = color;
      ctx.fill();
      console.log('touchstart:' + i + '.');
    }
  }
}

function onTouchEnd(evt) {
  evt.preventDefault();
  console.log('touchend');

  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8); // and a square at the end
      ongoingTouches.splice(idx, 1); // remove it; we're done
    } else {
      console.log("can't figure out which touch to end");
    }
  }
}

function onTouchCancel(evt) {
  evt.preventDefault();
  console.log('touchcancel.');
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1); // remove it; we're done
  }
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

  canvas.addEventListener('touchstart', onTouchStart, false);
  canvas.addEventListener('touchend', onTouchEnd, false);
  canvas.addEventListener('touchcancel', onTouchCancel, false);
  canvas.addEventListener('touchmove', onTouchMove, false);
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
