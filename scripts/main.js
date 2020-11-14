import { Color } from './color.js';

// ----------------- Constant Definitions---------------------------------------
const BLACK = '#000000';
const GREY = '#808080';
const BLACK_COLOR = new Color(0,0,0);

// ----------------- DOM Elements ----------------------------------------------
const colorBrushInput = document.getElementById('brush-color');
const colorBackgroundInput = document.getElementById('bg-color');

const grid = document.getElementById('grid');
const mid = document.getElementById('middle');

const sizeSlider = document.getElementById('size-slider');

// write, eraser, and neither
const pens = document.querySelectorAll('.pen-setting');

// palette icons -> black, user-selected color, random color
const brushes = Array.from(document.querySelectorAll('.brush-toggle'));

// dotted, solid
const gridToggles = Array.from(document.querySelectorAll('.grid-toggle')).map(n => {
  return {node: n, active: false};
});

// ----------------- Variables -------------------------------------------------
// current palette selection
let currentBrush = brushes[0];

// index of current pen selection
let penType = 0;

// stores current color for pen and background
let penColor = BLACK_COLOR;       //updated on palette swap
let bgColor = new Color(colorBackgroundInput.value);  //updated when user presses apply

// tracks current status of solid and drag-to-draw toggles
let solidState = true;
let dragToDraw = false;

// the width and height of the main grid
let size = sizeSlider.value;

// ----------------- Add Event Listeners ---------------------------------------
brushes.forEach(b => b.addEventListener('click', handleBrushClick));

gridToggles.forEach(t => t.node.addEventListener('click', handleGridToggle));

pens.forEach(p => p.addEventListener('click', handlePenClick));

colorBrushInput.addEventListener('input', e => brushes[1].style.color = e.target.value);
colorBrushInput.addEventListener('change', e => penColor = new Color(e.target.value));

mid.addEventListener('click', togglePen);

sizeSlider.addEventListener('input', () => document.getElementById('size-text').textContent = sizeSlider.value);

document.getElementById('solid-toggle').addEventListener('click', handleSolidClick);
document.getElementById('drag-toggle').addEventListener('click', handleDragClick);

document.getElementById('reset-button').addEventListener('click', handleResetClick);
document.getElementById('apply-button').addEventListener('click', handleApplyClick);
document.getElementById('fill-button').addEventListener('click', handleFillClick);

// ----------------- Methods ---------------------------------------------------
// Event -> null
// toggles the selected grid, deactivates the other, updates the colors appropriately
function handleGridToggle(e) {
  gridToggles.forEach(t => {
    t.active = (t.node == e.target && !t.active);
    t.node.style.color = t.active ? BLACK : GREY;
  });

  updateGridlines();
}

// Updates the border of all squares to the active grid
function updateGridlines() {
  let border = "none";

  if (gridToggles[1].active) {
    border = `1px solid ${bgColor.getComplement().toString()}`;
  } else if (gridToggles[0].active) {
    border = `1px dotted ${bgColor.getComplement().toString()}`;
  }

  document.querySelectorAll('.square').forEach(s => s.style.border = border);
}

// Event -> null
// Updates palette selection, pen color, and places an appropriate border in the UI
function handleBrushClick(e) {
  currentBrush = e.target;

  if (brushes.indexOf(currentBrush) == 0) penColor = BLACK_COLOR;
  else if (brushes.indexOf(currentBrush) == 1) {
    colorBrushInput.click();
    // in case the user never triggers change event
    penColor = new Color(colorBrushInput.value);
  };

  applyBrushBorder();
}

// removes the border from all palettes and re-applies the border to selected palette
function applyBrushBorder() {
  brushes.forEach(b => b.setAttribute('style', 'margin: 3px; border: 0px;'));
  currentBrush.setAttribute('style', `margin: 0px; border: 3px solid ${GREY};`);
  brushes[1].style.color = colorBrushInput.value;
}

// sets active pen icon to black color, rest to grey
function updatePenDisplay() {
  pens.forEach(p => p.style.color = GREY);
  pens[penType].style.color = BLACK;
}

// Event -> null
// updates the class of mid to show active pen cursor, updates penType and the UI
// this method for direct selection via the right-hand menu
function handlePenClick(e) {
  const penName = ['brush', 'eraser', 'none'];

  mid.classList.remove(penName[penType]);

  penType = [...pens].indexOf(e.target);

  mid.classList.add(penName[penType]);

  updatePenDisplay();
}

// updates the class of mid to show active pen cursor, updates penType and the UI
// this method for inderect selection via click-toggle within the grid
function togglePen() {
  const penName = ['brush', 'eraser', 'none'];
  mid.classList.remove(penName[penType]);

  penType++;
  penType %= 3;

  mid.classList.add(penName[penType]);

  updatePenDisplay();
}

// clears the old grid, sets new background color and size, and popluates a new grid
function handleApplyClick() {
  clearGrid();

  bgColor = new Color(colorBackgroundInput.value);
  size = sizeSlider.value;

  populateGrid();
}

// removes all child elements of the main grid
function clearGrid() {
  while (grid.firstChild) grid.removeChild(grid.firstChild);
}

// creates a square node, adds the appropriate css, clones and adds it to grid, and adds listeners
function populateGrid() {
  const square = document.createElement('div');
  square.classList.add('square');
  square.style.backgroundColor = bgColor;

  for (let i = 0; i < size**2; i++) grid.appendChild(square.cloneNode());

  grid.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;

  const squares = grid.querySelectorAll('.square');

  squares.forEach(s => s.addEventListener('mouseenter', handleMouseEnter));
  squares.forEach(s => s.addEventListener('mousedown', handleMouseDown));

  updateGridlines();
}

// clears the old grid and populates a new one based on same background color and size
function handleResetClick() {
  clearGrid();

  populateGrid();
}

// swaps pen from solid to shader and updates the UI accordingly
function handleSolidClick() {
  solidState = !solidState;
  document.getElementById('solid-container').style.color = (solidState) ? BLACK : GREY;
}

// swaps draw style, updates instructions and UI, and updates event listener in grid
function handleDragClick() {
  dragToDraw = !dragToDraw;

  const instructions = document.getElementById('instruction-text');

  if (!dragToDraw) {
    document.getElementById('drag-container').style.color = GREY;
    instructions.textContent = "Click anywhere within the center area to toggle pen mode";
    mid.addEventListener('click', togglePen);
  } else {
    document.getElementById('drag-container').style.color = BLACK;
    instructions.textContent = "Click and drag to draw";
    instructions.style.textAlign = "center";
    mid.removeEventListener('click', togglePen);
  }
}

// Event -> null
// when in drag-to-draw mode, colors or erases the current square according to current settings
function handleMouseDown(e) {
  if (dragToDraw && penType != 2) {
    e.target.style.backgroundColor = getColor(new Color(e.target.style.backgroundColor)).toString();
  }
}

// Color -> Color
// given a color, calculate and return the new color based on current settings
// assumes penType is pre-validated to not be 2
function getColor(oldColor) {
  // solid eraser -> always back to background color
  if (penType == 1 && solidState) return bgColor;

  // solid, ink
  if (solidState) return (currentBrush !== brushes[2]) ? penColor : Color.getRandColor();

  // all solid situations have been taken care of, rest are shaded

  // eraser -> with shader on, eraser brings square closer to background color
  if (penType == 1) return oldColor.getCloserColor(bgColor);

  // if not rainbow -> with shader, brings square closer to pen color
  if (currentBrush !== brushes[2]) return oldColor.getCloserColor(penColor);

  // shading towards a random color not meaningful, so instead, randomly fill only blank squares
  return (oldColor.checkIfSame(bgColor)) ? Color.getRandColor() : oldColor;
}

// Event -> null
// validates that color should be applied and applies it based on calculations from getColor
function handleMouseEnter(e) {
  if (penType == 2 || (dragToDraw && e.buttons != 1)) return;
  e.target.style.backgroundColor = getColor(new Color(e.target.style.backgroundColor)).toString();
}

// Event -> null
// fills all empty squares based on current palette selection
function handleFillClick() {
  document.querySelectorAll('.square').forEach(s => {
    if (new Color(s.style.backgroundColor).checkIfSame(bgColor)) {
      s.style.backgroundColor = (currentBrush !== brushes[2]) ? penColor.toString() : Color.getRandColor().toString();
    }
  });
}

// initialise on page load
applyBrushBorder();
populateGrid();
updatePenDisplay();
