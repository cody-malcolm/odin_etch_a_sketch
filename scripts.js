const blackBrush = document.getElementById('black-toggle');
const colorBrush = document.getElementById('color-toggle');
const rainbowBrush = document.getElementById('rainbow-toggle');
const brushes = [blackBrush, colorBrush, rainbowBrush];

const shaderToggle = document.getElementById('shader-toggle');
const solidToggle = document.getElementById('solid-toggle');
const toggles = [shaderToggle, solidToggle];

const pens = document.querySelectorAll('.pen-setting');

const colorBrushInput = document.getElementById('brush-color');

const grid = document.getElementById('grid');
const mid = document.getElementById('middle');

let currentBrush = blackBrush;
let currentToggle = solidToggle;

let penType = 0; // 0 -> draw, 1 -> eraser, 2 -> off

blackBrush.addEventListener('click', handleBlackBrushClick);
colorBrush.addEventListener('click', handleColorBrushClick);
rainbowBrush.addEventListener('click', handleRainbowBrushClick);

shaderToggle.addEventListener('click', handleShaderClick);
solidToggle.addEventListener('click', handleSolidClick);

colorBrushInput.addEventListener('input', handleColorBrushInput);

mid.addEventListener('click', togglePen);

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
  applyBrushBorder();
}

function handleColorBrushClick(e) {
  document.getElementById('brush-color').click();
  currentBrush = colorBrush;
  applyBrushBorder();
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
}

function applyToggleBorder() {
  toggles.forEach(t => t.setAttribute('style', 'margin: 3px; border: 0px;'));
  currentToggle.setAttribute('style', 'margin: 0px; border: 3px solid #808080;')
}

function handleMouseEnter(e) {
  e.target.style.backgroundColor = '#000000';
}

function clearGrid() {
  while (grid.firstChild) grid.removeChild(firstChild);
}

function populateGrid(n) {
  const square = document.createElement('div');
  square.classList.add('square');

  for (let i = 0; i < n**2; i++) grid.appendChild(square.cloneNode());

  grid.style.gridTemplate = `repeat(${n}, 1fr) / repeat(${n}, 1fr)`;

  grid.querySelectorAll('.square').forEach(s => s.addEventListener('mouseenter', handleMouseEnter));
}


applyBrushBorder();
applyToggleBorder();

populateGrid(16);

updatePenDisplay();
