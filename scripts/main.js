import { Color } from './color.js';

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
const fillButton = document.getElementById('fill-button');

const grid = document.getElementById('grid');
const mid = document.getElementById('middle');

const sizeSlider = document.getElementById('size-slider');

let currentBrush = blackBrush;
let currentToggle = solidToggle;

let penType = 0; // 0 -> draw, 1 -> eraser, 2 -> off

const BLACK_OBJ = new Color(0,0,0);
let penColor = BLACK_OBJ;
let bgColor = new Color(colorBackgroundInput.value);

let size = sizeSlider.value;

let solidState = true;
let defaultDraw = true;

let dottedGrid = false;
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
fillButton.addEventListener('click', handleFillClick);

mid.addEventListener('click', togglePen);

sizeSlider.addEventListener('input', handleSizeInput);

pens.forEach(p => p.addEventListener('click', handlePenClick));

function updateGridToggleDisplay() {
  dottedGridToggle.style.color = (dottedGrid) ? '#000000' : '#808080';
  solidGridToggle.style.color = (solidGrid) ? '#000000' : '#808080';
}

function updateGridlines() {
  let border = "none";

  if (solidGrid) {
    border = "1px solid black";
  } else if (dottedGrid) {
    border = "1px dotted black";
  }

  document.querySelectorAll('.square').forEach(s => s.style.border = border);

  console.log("called");
}

function handleDottedGridClick() {
  solidGrid = false;
  dottedGrid = !dottedGrid;

  updateGridlines();
  updateGridToggleDisplay();
}

function handleSolidGridClick() {
  solidGrid = !solidGrid;
  dottedGrid = false;

  updateGridlines();
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
  bgColor = new Color(colorBackgroundInput.value);

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
  penColor = BLACK_OBJ;

  applyBrushBorder();
}

function handleColorBrushClick(e) {
  document.getElementById('brush-color').click();
  currentBrush = colorBrush;
  penColor = new Color(colorBrushInput.value);

  applyBrushBorder();
}

function handleColorBrushChange(e) {
  penColor = new Color(e.target.value);
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

function getColor(oldColor) {
  // solid eraser
  if (penType == 1 && solidState) return bgColor;

  // solid, ink
  if (solidState) {
    if (currentBrush !== rainbowBrush) return penColor;
    return Color.getRandColor();
  }

  // all solid situations have been taken care of

  // shaded eraser
  if (penType == 1) {
    return oldColor.getCloserColor(bgColor);
  }

  // if not rainbow
  if (currentBrush !== rainbowBrush) {
    return oldColor.getCloserColor(penColor);
  }

  return (oldColor.checkIfSame(bgColor)) ? Color.getRandColor() : oldColor;
}

function handleMouseEnter(e) {
  if (penType == 2 || (!defaultDraw && e.buttons != 1)) return;
  e.target.style.backgroundColor = getColor(new Color(e.target.style.backgroundColor)).toString();
}

function clearGrid() {
  while (grid.firstChild) grid.removeChild(grid.firstChild);
}

function handleMouseDown(e) {
  if (!defaultDraw && penType != 2) {
    e.target.style.backgroundColor = getColor(new Color(e.target.style.backgroundColor)).toString();
  }
}

function handleFillClick(e) {
  document.querySelectorAll('.square').forEach(s => {
    if (new Color(s.style.backgroundColor).checkIfSame(bgColor)) {
      s.style.backgroundColor = (currentBrush !== rainbowBrush) ? penColor.toString() : Color.getRandColor().toString();
    }
  });
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

  updateGridlines();
}


applyBrushBorder();

populateGrid(16);

updatePenDisplay();
