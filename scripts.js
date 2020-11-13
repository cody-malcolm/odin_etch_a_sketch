const blackBrush = document.getElementById('black-toggle');
const colorBrush = document.getElementById('color-toggle');
const rainbowBrush = document.getElementById('rainbow-toggle');
const brushes = [blackBrush, colorBrush, rainbowBrush];

const solidToggle = document.getElementById('solid-toggle');
const dragToggle = document.getElementById('drag-toggle');

const dottedGridToggle = document.getElementById('dotted-gridlines');
const solidGridToggle = document.getElementById('solid-gridlines');

const pens = document.querySelectorAll('.pen-setting');

const colorBrushInput = document.getElementById('brush-color');
const colorBackgroundInput = document.getElementById('bg-color');

const resetButton = document.getElementById('reset-button');
const applyButton = document.getElementById('apply-button');

const grid = document.getElementById('grid');
const mid = document.getElementById('middle');

const sizeSlider = document.getElementById('size-slider');

let currentBrush = blackBrush;
let currentToggle = solidToggle;

let penType = 0; // 0 -> draw, 1 -> eraser, 2 -> off

let penColor = '#000000';
let bgColor = colorBackgroundInput.value;

let size = sizeSlider.value;

let solidState = true;
let defaultDraw = true;

let dashedGrid = false;
let solidGrid = false;

blackBrush.addEventListener('click', handleBlackBrushClick);
colorBrush.addEventListener('click', handleColorBrushClick);
rainbowBrush.addEventListener('click', handleRainbowBrushClick);

solidToggle.addEventListener('click', handleSolidClick);
dragToggle.addEventListener('click', handleDragClick);

dottedGridToggle.addEventListener('click', handleDottedGridClick);
solidGridToggle.addEventListener('click', handleSolidGridClick);

colorBrushInput.addEventListener('input', handleColorBrushInput);
colorBrushInput.addEventListener('change', handleColorBrushChange);

resetButton.addEventListener('click', handleResetClick);
applyButton.addEventListener('click', handleApplyClick);

mid.addEventListener('click', togglePen);

sizeSlider.addEventListener('input', handleSizeInput);

pens.forEach(p => p.addEventListener('click', handlePenClick));

function updateGridToggleDisplay() {
  dottedGridToggle.style.color = (dashedGrid) ? '#000000' : '#808080';
  solidGridToggle.style.color = (solidGrid) ? '#000000' : '#808080';
}

function handleDottedGridClick() {
  solidGrid = false;
  dashedGrid = !dashedGrid;

  document.querySelectorAll('.square').forEach(s => s.style.border = `${(dashedGrid) ? "1px dotted black" : "none"}`);
  updateGridToggleDisplay();
}

function handleSolidGridClick() {
  solidGrid = !solidGrid;
  dashedGrid = false;

  document.querySelectorAll('.square').forEach(s => s.style.border = `${(solidGrid) ? "1px solid black" : "none"}`);
  updateGridToggleDisplay();
}

function handlePenClick(e) {
  const penName = ['brush', 'eraser', 'none'];

  mid.classList.remove(penName[penType]);

  penType = [...pens].indexOf(e.target);

  mid.classList.add(penName[penType]);

  updatePenDisplay();
}

function handleSizeInput(e) {
  document.getElementById('size-text').textContent = sizeSlider.value;
}

function handleApplyClick(e) {
  clearGrid();

  size = sizeSlider.value;
  bgColor = colorBackgroundInput.value;

  populateGrid(size);
}

function handleResetClick(e) {
  clearGrid();

  populateGrid(size);
}

function updatePenDisplay() {
  pens.forEach(p => p.style.color = "#808080");
  pens[penType].style.color = "#000000";
}

function togglePen() {
  const penName = ['brush', 'eraser', 'none'];
  mid.classList.remove(penName[penType]);

  penType++;
  penType %= 3;

  mid.classList.add(penName[penType]);

  updatePenDisplay();
}

function handleBlackBrushClick(e) {
  currentBrush = blackBrush;
  penColor = '#000000';
  applyBrushBorder();
}

function handleColorBrushClick(e) {
  document.getElementById('brush-color').click();
  currentBrush = colorBrush;
  penColor = colorBrushInput.value;
  applyBrushBorder();
}

function handleColorBrushChange(e) {
  penColor = e.target.value;
}

function handleRainbowBrushClick(e) {
  currentBrush = rainbowBrush;
  applyBrushBorder();
}

function handleSolidClick(e) {
  solidState = !solidState;
  if (solidState) document.getElementById('solid-container').style.color = '#000000';
  else document.getElementById('solid-container').style.color = '#808080';
}

function handleDragClick(e) {
  defaultDraw = !defaultDraw;
  const instructions = document.querySelector('.instruction-text');
  if (defaultDraw) {
    document.getElementById('drag-container').style.color = '#808080';
    instructions.textContent = "Click anywhere within the center area to toggle pen mode";
    mid.addEventListener('click', togglePen);
  } else {
    document.getElementById('drag-container').style.color = '#000000';
    instructions.textContent = "Click and drag to draw";
    mid.removeEventListener('click', togglePen);
  }
}

function handleColorBrushInput(e) {
  colorBrush.style.color = e.target.value;
}

function applyBrushBorder() {
  brushes.forEach(b => b.setAttribute('style', 'margin: 3px; border: 0px;'));
  currentBrush.setAttribute('style', 'margin: 0px; border: 3px solid #808080;')
  colorBrush.style.color = colorBrushInput.value;
}

function parseColor(c) {
  return [parseInt(c.slice(1,3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5), 16)];
}

function parseRGB(c) {
  let arr = c.split(',');
  return [parseInt(arr[0].slice(4)), parseInt(arr[1].slice(1)), parseInt(arr[2].slice(1))];
}

function randColor() {
  return `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`;
}

function parseDiffs(oldColor) {
  const bgVals = parseRGB(oldColor);
  const penVals = parseColor(penColor);

  return [penVals[0]-bgVals[0], penVals[1]-bgVals[1], penVals[2]-bgVals[2]];
}

function comp(d, a, b) {
  if (a == b) return a;

  if (a < b) {
    return Math.min(Math.floor(a+d/10), b);
  } else {
    return Math.max(Math.ceil(a+d/10), b);
  }
}

function sameColor(a, b) {
  for (let i = 0; i < a.length; i++) if (a[i] != b[i]) return false;
  return true;
}

function getColor(oldColor) {
  if (penType == 1 && solidState) return bgColor;

  if (solidState) {
    if (currentBrush !== rainbowBrush) return penColor;
    return randColor();
  }

  if (penType == 1) {
    // TODO: Deal with this
    return bgColor;
  }

  if (currentBrush !== rainbowBrush) {
    const diffs = parseDiffs(oldColor);
    const oldVals = parseRGB(oldColor);
    const penVals = parseColor(penColor);

    const r = comp(diffs[0], oldVals[0], penVals[0]);
    const g = comp(diffs[1], oldVals[1], penVals[1]);
    const b = comp(diffs[2], oldVals[2], penVals[2]);

    console.log([r,g,b]);
    return `rgb(${r}, ${g}, ${b})`;
  }

  console.log(parseRGB(oldColor));
  console.log(parseColor(bgColor));
  if (sameColor(parseRGB(oldColor), parseColor(bgColor))) {
    return randColor();
  }

  // need to refactor parsediffs to handle this

  // black // eraser // shader

  // other // eraser // shader

  // rando // write // shader
  // rando // eraser // shader

}

function handleMouseEnter(e) {
  if (penType == 2 || (!defaultDraw && e.buttons != 1)) return;
  e.target.style.backgroundColor = getColor(e.target.style.backgroundColor);
}

function clearGrid() {
  while (grid.firstChild) grid.removeChild(grid.firstChild);
}

function handleMouseDown(e) {
  if (!defaultDraw && penType != 2) {
    e.target.style.backgroundColor = getColor(e.target.style.backgroundColor);
  }
}

function populateGrid(n) {
  const square = document.createElement('div');
  square.classList.add('square');
  square.style.backgroundColor = bgColor;

  for (let i = 0; i < n**2; i++) grid.appendChild(square.cloneNode());

  grid.style.gridTemplate = `repeat(${n}, 1fr) / repeat(${n}, 1fr)`;

  const squares = grid.querySelectorAll('.square');

  squares.forEach(s => s.addEventListener('mouseenter', handleMouseEnter));
  squares.forEach(s => s.addEventListener('mousedown', handleMouseDown));
}


applyBrushBorder();

populateGrid(16);

updatePenDisplay();
