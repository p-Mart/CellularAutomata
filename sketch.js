var cell_width = 8;
var cell_height= 8;

var cells;

function Cell(x_position, y_position, is_on){
	this.x_position = x_position;
	this.y_position = y_position;
	this.is_on = is_on;
}

function initializeCells(rows,cols){
	var arr = [];
	for(i = 0; i < rows;i++){
		arr.push([]);
		for(j = 0; j < cols;j++){
			var cell = new Cell(i*cell_width, j*cell_height, false)
			arr[i].push(cell);
		}
	}

	return arr;
}

function setup() {
	createCanvas(windowWidth,windowHeight);
	background(12,12,12);
	cells = initializeCells(width / cell_width, height / cell_height);
	/*
	for(i = 0; i < windowWidth / cell_width; i++){
		for(j = 0; j < windowHeight / cell_height;j++){
			var cell = new Cell(i*4,j*4, false);
			cells[i][j] = cell;
		}
	}
	*/
}

function draw() {
	//strokeWeight(random(1,6));
	//point(random(0,width), random(0, height));
	noStroke();
	for(i = 0; i < windowWidth / cell_width;i++){
		for(j = 0; j < windowHeight / cell_height; j++){
			fill(random(0,255),0,random(0,255));
			if(cells[i][j].is_on == false){
				rect(cells[i][j].x_position,cells[i][j].y_position, cell_width,cell_height);
			}
		}
	}
}