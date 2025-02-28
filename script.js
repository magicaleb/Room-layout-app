/*************************************************************
  Global Variables & Setup
**************************************************************/
const canvas = document.getElementById("roomCanvas");
const ctx = canvas.getContext("2d");

// Keep track of all furniture items in an array
let furnitureItems = [];

// For dragging
let isDragging = false;
let dragIndex = null;
let offsetX = 0;
let offsetY = 0;

// Grid snapping
let isGridSnap = false;
const GRID_SIZE = 20;

/*************************************************************
  Draw / Render
**************************************************************/
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw optional grid
  drawGrid();

  // Draw each furniture item
  furnitureItems.forEach((item) => {
    drawFurniture(item);
  });
}

// Draw a light grid background
function drawGrid() {
  ctx.strokeStyle = "#eee";
  ctx.lineWidth = 1;

  for (let x = 0; x < canvas.width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Draw a single furniture item (simple rectangle + label)
function drawFurniture(item) {
  ctx.save();

  ctx.fillStyle = item.selected ? "rgba(0, 200, 0, 0.3)" : "rgba(0, 0, 200, 0.3)";
  ctx.fillRect(item.x, item.y, item.width, item.height);

  ctx.fillStyle = "#000";
  ctx.font = "14px sans-serif";
  ctx.fillText(item.type, item.x, item.y - 5);

  ctx.restore();
}

/*************************************************************
  Furniture Management
**************************************************************/
function addFurniture(type) {
  const newItem = {
    type: type,
    x: 50,
    y: 50,
    width: 60,
    height: 60,
    rotation: 0,
    selected: false
  };
  furnitureItems.push(newItem);
  draw();
}

/*************************************************************
  Mouse & Touch Events for Drag & Drop
**************************************************************/
// Mouse events
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mouseup", onMouseUp);

// Touch events for mobile
canvas.addEventListener("touchstart", onTouchStart, false);
canvas.addEventListener("touchmove", onTouchMove, false);
canvas.addEventListener("touchend", onTouchEnd, false);

// Handle Mouse Events
function onMouseDown(e) {
  const mousePos = getMousePos(e);
  startDrag(mousePos);
}

function onMouseMove(e) {
  const mousePos = getMousePos(e);
  continueDrag(mousePos);
}

function onMouseUp(e) {
  endDrag();
}

// Handle Touch Events
function onTouchStart(e) {
  // Prevent scrolling
  e.preventDefault();
  if(e.touches.length > 0) {
    const touchPos = getTouchPos(e);
    startDrag(touchPos);
  }
}

function onTouchMove(e) {
  e.preventDefault();
  if (e.touches.length > 0) {
    const touchPos = getTouchPos(e);
    continueDrag(touchPos);
  }
}

function onTouchEnd(e) {
  e.preventDefault();
  endDrag();
}

/*************************************************************
  Drag Functions (Common for Mouse & Touch)
**************************************************************/
function startDrag(pos) {
  // Check from front to back for item under pos
  for (let i = furnitureItems.length - 1; i >= 0; i--) {
    const item = furnitureItems[i];
    if (isPosInItem(pos, item)) {
      item.selected = true;
      // Bring to front
      furnitureItems.push(furnitureItems.splice(i, 1)[0]);
      isDragging = true;
      dragIndex = furnitureItems.length - 1;
      offsetX = pos.x - item.x;
      offsetY = pos.y - item.y;
      draw();
      return;
    } else {
      item.selected = false;
    }
  }
  draw();
}

function continueDrag(pos) {
  if (!isDragging) return;
  const item = furnitureItems[dragIndex];
  if (!item) return;

  let newX = pos.x - offsetX;
  let newY = pos.y - offsetY;

  if (isGridSnap) {
    newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
    newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
  }

  item.x = newX;
  item.y = newY;

  draw();
}

function endDrag() {
  isDragging = false;
  dragIndex = null;
}

/*************************************************************
  Helpers for Positioning
**************************************************************/
function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function getTouchPos(evt) {
  const rect = canvas.getBoundingClientRect();
  const touch = evt.touches[0];
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  };
}

function isPosInItem(pos, item) {
  return (
    pos.x >= item.x &&
    pos.x <= item.x + item.width &&
    pos.y >= item.y &&
    pos.y <= item.y + item.height
  );
}

/*************************************************************
  Grid Snap Toggle
**************************************************************/
function toggleGridSnap() {
  isGridSnap = !isGridSnap;
  alert("Grid snapping is now " + (isGridSnap ? "ON" : "OFF"));
}

/*************************************************************
  Save / Load Layout (Local Storage)
**************************************************************/
function saveLayout() {
  const layout = JSON.stringify(furnitureItems);
  localStorage.setItem("roomLayout", layout);
  alert("Layout saved!");
}

function loadLayout() {
  const layout = localStorage.getItem("roomLayout");
  if (layout) {
    furnitureItems = JSON.parse(layout);
    draw();
    alert("Layout loaded!");
  } else {
    alert("No saved layout found!");
  }
}

/*************************************************************
  Initial Draw
**************************************************************/
draw();
