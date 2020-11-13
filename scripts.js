const blackBrush = document.getElementById('black-toggle');
const colorBrush = document.getElementById('color-toggle');
const rainbowBrush = document.getElementById('rainbow-toggle');
const brushes = [blackBrush, colorBrush, rainbowBrush];

const shaderToggle = document.getElementById('shader-toggle');
const solidToggle = document.getElementById('solid-toggle');
const toggles = [shaderToggle, solidToggle];

let currentBrush = blackBrush;
let currentToggle = solidToggle;

blackBrush.addEventListener('click', handleBlackBrushClick);
colorBrush.addEventListener('click', handleColorBrushClick);
rainbowBrush.addEventListener('click', handleRainbowBrushClick);

shaderToggle.addEventListener('click', handleShaderClick);
solidToggle.addEventListener('click', handleSolidClick);

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

function applyBrushBorder() {
  brushes.forEach(b => b.setAttribute('style', 'margin: 3px; border: 0px;'));
  currentBrush.setAttribute('style', 'margin: 0px; border: 3px solid #808080;')
}

function applyToggleBorder() {
  toggles.forEach(t => t.setAttribute('style', 'margin: 3px; border: 0px;'));
  currentToggle.setAttribute('style', 'margin: 0px; border: 3px solid #808080;')
}

applyBrushBorder();
applyToggleBorder();
