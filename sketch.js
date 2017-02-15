//Globals / constants
var cell_width = 12;
var cell_height= 12;

var cells;

//Control Variables
var paused = false;
var reset = false;
var drawing = false;
var draw_mode = false;
var grid_on = false;

function Cell(i, j, is_on){
	this.x_position = i*cell_width;
	this.y_position = j*cell_height;
	this.is_on = is_on;
	this.adjacentcellstates = [false,false,false,false, false, false,false,false,false];
	this.sumstates = 0;	
}

Cell.prototype.getNeighborStates = function(i, j){
	for(k = 0; k < 9; k++){
		var x_index = i + ((k%3) - 1);
		var y_index = j + (floor(k/3)) - 1;
		
		//The state of the cell being operated on
		if(k == 4){
			this.adjacentcellstates[k] = this.is_on;
			continue;
		}
		
		//The states of the cells adjacent to the cell being operated on
		if(x_index < 0 || x_index >= (width / cell_width) || y_index < 0 || y_index >= (height / cell_height))
			this.adjacentcellstates[k] = false;
		else{
			cell = cells[x_index][y_index];
			this.adjacentcellstates[k] = cell.is_on;
		}
	}

	var count = 0;
	for(i = 0; i < 9; i++){
		if (i == 4){
			continue;
		}
		if(this.adjacentcellstates[i] == true){
			count = count + 1;
		}
	}
	this.sumstates = count;

	return;
}

Cell.prototype.update = function(){
	this.is_on = rule(this.adjacentcellstates, this.sumstates);
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

function rule(adjacentcellstates, sumstates){
	var count = sumstates;
	if (adjacentcellstates[4] == true && count < 2){
		return false;
	}
	else if (adjacentcellstates[4] == true && (count == 2 || count == 3)){
		return true;
	}
	else if (adjacentcellstates[4] == true && count > 3){
		return false;
	}
	else if (adjacentcellstates[4] == false && count == 3){
		return true;
	}else{
		return false;
	}
}

function setup() {
	createCanvas(windowWidth,windowHeight);
	cells = initializeCells(width / cell_width, height / cell_height);
	cells[50][50].is_on = true;
	cells[51][50].is_on = true;
	cells[49][50].is_on = true;
	cells[51][49].is_on = true;
	cells[50][48].is_on = true;
	textSize(10);
	textAlign(CENTER);
	frameRate(15);
	/*
	for(i = 0; i < width / cell_width;i++){
		for(j = 0; j < height / cell_height;j++){
			cells[i][j].getNeighborStates(i,j);
		}
	}
	

	for(i = 0; i < width / cell_width;i++){
		for(j = 0; j < height / cell_height;j++){
			cells[i][j].update();
		}
	}
	*/

}

function draw() {

	background(12,12,12);
	noStroke();
	fill(255,255,255);

	//Draw Modes
	if (drawing == true && draw_mode == false){
		cells[floor(mouseX/cell_width)][floor(mouseY/cell_height)].is_on = true;
	}
	else if (drawing == true && draw_mode == true){
		cells[floor(mouseX/cell_width)][floor(mouseY/cell_height)].is_on = false;
	}

	//Reset the environment.
	if(reset == true){
		background(12,12,12);
		cells = initializeCells(width / cell_width, height / cell_height);
		reset = false;
	}

	//Update the neighboring states of each cell if environment is unpaused.
	if(paused == false){
		for(i = 0; i < width / cell_width;i++){
			for(j = 0; j < height / cell_height;j++){
				cells[i][j].getNeighborStates(i,j);
			}
		}
	}

	//Update and Draw. Drawing happens regardless of whether environment is paused.
	for(i = 0; i < width / cell_width;i++){
		for(j = 0; j < height / cell_height;j++){

			if(paused == false){
				cells[i][j].update();
			}
			if(cells[i][j].is_on == false && grid_on == true){
				stroke(255);
				noFill();
				rect(cells[i][j].x_position,cells[i][j].y_position, cell_width,cell_height);
			}
			if(cells[i][j].is_on == true){
				noStroke();
				fill(255,255,255);
				rect(cells[i][j].x_position,cells[i][j].y_position, cell_width,cell_height);
			} 
			//fill(255,0,0);
			//text(str(cells[i][j].sumstates),cells[i][j].x_position,cells[i][j].y_position,cell_width,cell_height);
		}
	}
} 


function keyPressed(){
	//Spacebar
	if (keyCode == 32){
		paused = !paused;
	}
	else if(key == "R"){
		reset = true;
	}
	else if(key == "E"){
		draw_mode = !draw_mode;
	}
	else if(key == "G"){
		grid_on = !grid_on;
	}
	return false;
}

function mousePressed(){
	if (mouseButton == LEFT){
		drawing = true;
	}
	return false;
}

function mouseReleased(){
	if (mouseButton == LEFT){
		drawing = false;
	}
	return false;
}