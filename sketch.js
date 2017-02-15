var cell_width = 8;
var cell_height= 8;

var cells;

function Cell(i, j, is_on){
	this.x_position = i*cell_width;
	this.y_position = j*cell_height;
	this.is_on = is_on;
	this.adjacentcellstates = [false,false,false,false,false,false,false,false];	
}

Cell.prototype.getNeighborStates = function(i, j){
	for(k = 0; k < 8; k++){
		var x_index = i + ((floor(k/3)) - 1);
		var y_index = j + ((k%3) - 1);
		
		if(x_index < 0 || x_index >= (width / cell_width) || y_index < 0 || y_index >= (height / cell_height))
			this.adjacentcellstates[k] = false;
		else{
			cell = cells[x_index][y_index];
			this.adjacentcellstates[k] = cell.is_on;
		}
	}
	return;
}

Cell.prototype.update = function(rule_number){
	this.is_on = rule(rule_number, this.adjacentcellstates);
}

function initializeCells(rows,cols){
	var arr = [];
	for(i = 0; i < rows;i++){
		arr.push([]);
		for(j = 0; j < cols;j++){
			var cell = new Cell(i,j, false)
			arr[i].push(cell);
		}
	}

	return arr;
}

function rule(rule_number, adjacentcellstates){
	var count = 0;
	for (x in adjacentcellstates){
		if(x == true){
			count = count + 1;
		}
	}
	if (count == 1){
		return true;
	}
	else{
		return false;
	}
}

function setup() {
	createCanvas(windowWidth,windowHeight);
	cells = initializeCells(width / cell_width, height / cell_height);
	cells[50][50].is_on = true;
}

function draw() {
	//strokeWeight(random(1,6));
	//point(random(0,width), random(0, height));
	background(12,12,12);
	noStroke();
	/*
	for(i = 0; i < windowWidth / cell_width;i++){
		for(j = 0; j < windowHeight / cell_height; j++){
			fill(random(0,255),0,random(0,255));
			if(cells[i][j].is_on == false){
				rect(cells[i][j].x_position,cells[i][j].y_position, cell_width,cell_height);
			}
		}
	}
	*/
	fill(255,255,255)
	for(i = 0; i < windowWidth / cell_width;i++){
		for(j = 0; j < windowHeight / cell_height;j++){
			cells[i][j].getNeighborStates(i,j);
		}
	}
	for(i = 0; i < windowWidth / cell_width;i++){
		for(j = 0; j < windowHeight / cell_height;j++){
			cells[i][j].update(12);
			if(cells[i][j].is_on == true){
				rect(cells[i][j].x_position,cells[i][j].y_position, cell_width,cell_height);
			}
		}
	}
	
	//rect(cells[50][50].x_position,cells[50][50].y_position, cell_width,cell_height);

}