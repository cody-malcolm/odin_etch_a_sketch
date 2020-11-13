const blackBrush = document.getElementById('black-toggle');
const colorBrush = document.getElementById('color-toggle');
const rainbowBrush = document.getElementById('rainbow-toggle');
const brushes = [blackBrush, colorBrush, rainbowBrush];

const shaderToggle = document.getElementById('shader-toggle');
const solidToggle = document.getElementById('solid-toggle');
const toggles = [shaderToggle, solidToggle];

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

blackBrush.addEventListener('click', handleBlackBrushClick);
colorBrush.addEventListener('click', handleColorBrushClick);
rainbowBrush.addEventListener('click', handleRainbowBrushClick);

shaderToggle.addEventListener('click', handleShaderClick);
solidToggle.addEventListener('click', handleSolidClick);

colorBrushInput.addEventListener('input', handleColorBrushInput);
colorBrushInput.addEventListener('change', handleColorBrushChange);

resetButton.addEventListener('click', handleResetClick);
applyButton.addEventListener('click', handleApplyClick);

mid.addEventListener('click', togglePen);

sizeSlider.addEventListener('input', handleSizeInput);

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
  penType++;
  penType %= 3;

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

function handleShaderClick(e) {
  currentToggle = shaderToggle;
  applyToggleBorder();
}

function handleSolidClick(e) {
  currentToggle = solidToggle;
  applyToggleBorder();
}

function handleColorBrushInput(e) {
  colorBrush.style.color = e.target.value;
}

function applyBrushBorder() {
  brushes.forEach(b => b.setAttribute('style', 'margin: 3px; border: 0px;'));
  currentBrush.setAttribute('style', 'margin: 0px; border: 3px solid #808080;')
  colorBrush.style.color = colorBrushInput.value;
}

function applyToggleBorder() {
  toggles.forEach(t => t.setAttribute('style', 'margin: 3px; border: 0px;'));
  currentToggle.setAttribute('style', 'margin: 0px; border: 3px solid #808080;')
}

function getColor(oldColor) {
  if (penType == 1 && currentToggle === solidToggle) return bgColor;

  if (currentToggle === solidToggle) {
    if (currentBrush !== rainbowBrush) return penColor;
    return `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`;
  }

  // black // write // shader
  // black // eraser // shader

  // other // write // shader
  // other // eraser // shader

  // rando // write // shader
  // rando // eraser // shader

}

function handleMouseEnter(e) {
  if (penType == 2) return;
  e.target.style.backgroundColor = getColor(e.target.style.backgroundColor);
}

function clearGrid() {
  while (grid.firstChild) grid.removeChild(grid.firstChild);
}

function populateGrid(n) {
  const square = document.createElement('div');
  square.classList.add('square');
  square.style.backgroundColor = bgColor;

  for (let i = 0; i < n**2; i++) grid.appendChild(square.cloneNode());

  grid.style.gridTemplate = `repeat(${n}, 1fr) / repeat(${n}, 1fr)`;

  grid.querySelectorAll('.square').forEach(s => s.addEventListener('mouseenter', handleMouseEnter));
}


applyBrushBorder();
applyToggleBorder();

populateGrid(16);

updatePenDisplay();
