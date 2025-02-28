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
  // Save current context (so we can rotate if needed)
  ctx.save();

  // Translate to item center if you want rotation:
  // ctx.translate(item.x + item.width / 2, item.y + item.height / 2);
  // ctx.rotate(item.rotation * Math.PI / 180);
  // Then draw at -width/2, etc. For simplicity, we skip rotation now.

  // Furniture color: highlight if selected
  ctx.fillStyle = item.selected ? "rgba(0, 200, 0, 0.3)" : "rgba(0, 0, 200, 0.3)";
  ctx.fillRect(item.x, item.y, item.width, item.height);

  // Label above the rectangle
  ctx.fillStyle = "#000";
  ctx.font = "14px sans-serif";
  ctx.fillText(item.type, item.x, item.y - 5);

  // Restore context
  ctx.restore();
}

/*************************************************************
  Furniture Management
**************************************************************/
// Add a new furniture item at a default location
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

// If you want to rotate an item, you could do something like:
// function rotateSelected(deg) {
//   const item = furnitureItems.find((i) => i.selected);
//   if (item) {
//     item.rotation = (item.rotation + deg) % 360;
//     draw();
//   }
// }

/*************************************************************
  Mouse Events for Drag & Drop
**************************************************************/
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mouseup", onMouseUp);

function onMouseDown(e) {
  const mousePos = getMousePos(e);

  // Check furniture from front to back
  for (let i = furnitureItems.length - 1; i >= 0; i--) {
    const item = furnitureItems[i];
    if (isMouseInItem(mousePos, item)) {
      // Select this item
      item.selected = true;
      // Bring it to front by removing and pushing it to the end
      furnitureItems.push(furnitureItems.splice(i, 1)[0]);

      // Start dragging
      isDragging = true;
      dragIndex = furnitureItems.length - 1;
      offsetX = mousePos.x - item.x;
      offsetY = mousePos.y - item.y;
      draw();
      return;
    } else {
      item.selected = false;
    }
  }

  // If clicked on empty space, deselect all
  draw();
}

function onMouseMove(e) {
  if (!isDragging) return;
  const mousePos = getMousePos(e);

  // The item we’re dragging
  const item = furnitureItems[dragIndex];
  if (!item) return;

  let newX = mousePos.x - offsetX;
  let newY = mousePos.y - offsetY;

  // Snap to grid if enabled
  if (isGridSnap) {
    newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
    newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
  }

  item.x = newX;
  item.y = newY;

  draw();
}

function onMouseUp() {
  isDragging = false;
  dragIndex = null;
}

/*************************************************************
  Helpers
**************************************************************/
// Convert mouse event to canvas coordinates
function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

// Check if mouse is within the bounding box of an item
function isMouseInItem(mousePos, item) {
  return (
    mousePos.x >= item.x &&
    mousePos.x <= item.x + item.width &&
    mousePos.y >= item.y &&
    mousePos.y <= item.y + item.height
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
  alert("Layout saved to browser storage!");
}

function loadLayout() {
  const layout = localStorage.getItem("roomLayout");
  if (layout) {
    furnitureItems = JSON.parse(layout);
    draw();
    alert("Layout loaded from browser storage!");
  } else {
    alert("No saved layout found!");
  }
}

/*************************************************************
  Initial Draw
**************************************************************/
draw();
