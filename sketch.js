let cells = [];
let timeSlider, zoomSlider
let pause = false
let pauseButton, stepButton
let place
let cellSize = 5

function setup() {
	createCanvas(600, 600);
	timeSlider = createSlider(1, 144, 60);
	pauseButton = createButton('Pause')
	pauseButton.mousePressed(togglePause)
	stepButton = createButton('1 step')
	stepButton.mousePressed(step)
	zoomSlider = createSlider(2, 20, 10);

	for (let i = 0; i < width * height / 4; i++) {
		let row = Math.floor(i / (height / 2))
		let col = i % (width / 2)


		if (cells[row] === undefined)
			cells[row] = []

		cells[row][col] = new Cell(row, col)
	}

	cells[10][10].born()
	cells[10][11].born()
	cells[10][12].born()
	cells[10][13].born()
	cells[10][14].born()
	cells[10][15].born()
	cells[10][16].born()
	cells[10][17].born()
	cells[10][18].born()
	cells[10][19].born()
}

function draw() {
	background(0);
  cellSize = zoomSlider.value()
  frameRate(timeSlider.value())

	for (let i = 0; i < cells.length; i++) {
		for (let j = 0; j < cells[i].length; j++) {
			cells[i][j].draw();
		}
	}

  let copy = arrayClone(cells)

	for (let i = 0; i < cells.length; i++) {
		for (let j = 0; j < cells[i].length; j++) {

			let neighbours = cells[i][j].neighbours()

			if (cells[i][j].alive && (neighbours < 2 || neighbours > 3)) {
				copy[i][j].die()
			} else if (!cells[i][j].alive && neighbours === 3) {
				copy[i][j].born()
			}
		}
	}

	cells = arrayClone(copy)
  
  textSize(32);
  fill(255)
  text(round(frameRate()), 10, 30)
}

function arrayClone(arr) {

	var i, copy;

	if (Array.isArray(arr)) {
		copy = arr.slice(0);
		for (i = 0; i < copy.length; i++) {
			copy[i] = arrayClone(copy[i]);
		}
		return copy;
	} else if (typeof arr === 'object') {
		return new Cell(arr.x, arr.y, arr.alive)
	} else {
		return arr;
	}

}

function togglePause() {
	pause = !pause
  if (pause) {
    noLoop()
		pauseButton.html('Play')
  }
  else {
    loop()
		pauseButton.html('Pause')
  }
}

function step() {
  redraw()
}

function mouseDragged() {
	if (mouseY < height && mouseX < width) {
		let row = Math.floor(mouseY / cellSize)
		let col = Math.floor(mouseX / cellSize)

		if (place) {
			cells[row][col].die()
      cells[row][col].draw()
    }
		else {
			cells[row][col].born()
      cells[row][col].draw()
    }
		
		
		return false;
	}
}

function mousePressed() {
	if (mouseY < height && mouseX < width) {
		let row = Math.floor(mouseY / cellSize)
		let col = Math.floor(mouseX / cellSize)

		place = cells[row][col].alive
		
		if (place)
			cells[row][col].die()
		else
			cells[row][col].born()
    
		return false;
	}
}

class Cell {
	constructor(x, y, alive = false) {
		this.x = x
		this.y = y
		this.alive = alive
	}

	born() {
		this.alive = true
	}

	die() {
		this.alive = false
	}

	neighbours() {
		let neighbours = 0

		if (this.x - 1 >= 0) {
      if (this.y - 1 >= 0 && cells[this.x - 1][this.y - 1].alive)
        neighbours++;
      
      if (cells[this.x - 1][this.y].alive)
        neighbours++;
      
      if (this.y + 1 < width / 2 && cells[this.x - 1][this.y + 1].alive)
        neighbours++;
    }

    if (this.y - 1 >= 0 && cells[this.x][this.y - 1].alive)
      neighbours++;

		if (this.y + 1 < width / 2 &&	cells[this.x][this.y + 1].alive)
			neighbours++;

		if (this.x + 1 < height / 2) {
      if (this.y - 1 >= 0 && cells[this.x + 1][this.y - 1].alive)
        neighbours++;
      
			if (cells[this.x + 1][this.y].alive)
        neighbours++;
      
      if (this.y + 1 < width / 2 && cells[this.x + 1][this.y + 1].alive)
        neighbours++;
    }

		return neighbours
	}

	draw() {
		if (this.alive) {
			fill(255)
      rect(this.y * cellSize, this.x * cellSize, cellSize, cellSize)
		}
	}
}
