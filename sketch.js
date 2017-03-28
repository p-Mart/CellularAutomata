//Globals / constants
var cell_width = 8;
var cell_height= 8;

var cells;

//Memes
var pause_button;
var grid_button;
var drawing_button;
//var hide_button;

//Control Variables
var paused = false;
var reset = false;
var pressed = false;
var draw_mode = false;
var grid_on = false;

function Cell(i, j, is_on){
	this.x_position = i*cell_width;
	this.y_position = j*cell_height;
	this.is_on = is_on;
	this.adjacentcellstates = [false,false,false,false,false,false,false,false,false];
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

Cell.prototype.update = function(rule_number){
	this.is_on = rule(rule_number, this.adjacentcellstates, this.sumstates);
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

function rule(rule_number, adjacentcellstates, sumstates){
	var count = sumstates;
	current_state = adjacentcellstates[4];
	switch(rule_number){
		case 0:
			if (current_state == true && count < 2){
				return false;
			}
			else if (current_state == true && (count == 2 || count == 3)){
				return true;
			}
			else if (current_state == true && count > 3){
				return false;
			}
			else if (current_state == false && count == 3){
				return true;
			}else{
				return false;
			}
			break;
		case 1:
			if(current_state == true && count > 3){
				return false;
			}
			else if (current_state == true && count <= 1){
				return false;
			}
			else if (current_state == true && count == 2){
				return true;
			}
			else if (current_state == false && count == 2){
				return true;
			}
			break;

		default:
			break;
	}
	return false;
}

function Button(x, y, size, control){
	this.x = x;
	this.y = y;
	this.size = size;
	this.control = control;
}
Button.prototype.update = function(){
	if(pow(mouseX - this.x,2) + pow(mouseY - this.y,2) <= pow(this.size,2)){
			this.control = !this.control;
	}
}

Button.prototype.draw = function(icon_draw){
	push();
		noStroke();
		fill(211,211,211);
		ellipse(this.x,this.y, this.size);
	pop();
	icon_draw(this.x, this.y, this.size,this.control);
}

function pause_icon(p_x,p_y,p_size,control){
	push();
		noStroke();
		fill(144,144,144);
		if(control === false){
			rect(p_x+2,p_y-p_size/4,p_size/5,p_size/2);
			rect(p_x-2 - p_size/5,p_y-p_size/4,p_size/5,p_size/2);
		}else{
			//var x1 = p_x-2 - p_size/5;
			var x3 = p_x+ p_size/5;
			var x2 = p_x - 2 - p_size/10;
			var y1 = p_y - p_size/4;
			var y2 = p_y;
			var y3 = p_y + p_size/4;
			triangle(x2,y1,x3,y2,x2,y3);
		}
	pop();
}
function grid_icon(p_x,p_y,p_size,control){
	push();
		strokeWeight(2);
		if(control === false){
			stroke(144,144,144);
		}else{
			stroke(0,55,0);
		}
		var x1 = p_x-2 - p_size/5;
		var x2 = p_x+2+ p_size/5;
		var x3 = p_x;
		var y1 = p_y - p_size/5;
		var y2 = p_y;
		var y3 = p_y + p_size/5;

		line(x1,y1,x2,y1);
		line(x1,y2,x2,y2);
		line(x1,y3,x2,y3);

		line(x1,y1,x1,y3);
		line(x2,y1,x2,y3);
		line(x3,y1,x3,y3);
	pop();
}
function drawing_icon(p_x,p_y,p_size,control){
	push();
		noStroke();
		if(control == false){
			fill(255,255,255);
		}else{
			fill(12,12,12);
		}
		ellipse(p_x,p_y,p_size/2);
	pop();
}
function hide_icon(p_x,p_y,p_size,control){
	push();
		strokeWeight(4);
		stroke(144,144,144);

		var x1 = p_x-2 - p_size/5;
		var x2= p_x;
		var x3 = p_x+2+ p_size/5;
		var y1 = p_y;
		var y2 = p_y + p_size/5;

		line(x1,y1,x2,y2);
		line(x2,y2,x3,y1);

	pop();
}

function setup() {
	createCanvas(windowWidth,windowHeight);
	cells = initializeCells(width / cell_width, height / cell_height);

	textSize(10);
	textAlign(CENTER);
	frameRate(20);

	pause_button = new Button(width / 2, height - 48, 48, paused);
	drawing_button = new Button(3*width / 8, height - 48, 48,draw_mode);
	grid_button = new Button(5*width / 8, height - 48, 48,grid_on);
	//hide_button = new Button(width - 48, height - 48, 48,true);
}

rule_number = 0;

function draw() {

	background(12,12,12);
	noStroke();
	fill(255,255,255);


	//Draw Modes
	if (pressed == true && drawing_button.control === false){
		cells[floor(mouseX/cell_width)][floor(mouseY/cell_height)].is_on = true;
	}
	else if (pressed == true && drawing_button.control === true){
		cells[floor(mouseX/cell_width)][floor(mouseY/cell_height)].is_on = false;
	}

	if(reset == true){
		background(12,12,12);
		cells = initializeCells(width / cell_width, height / cell_height);
		reset = false;
	}

	if(pause_button.control == false){
		for(i = 0; i < width / cell_width;i++){
			for(j = 0; j < height / cell_height;j++){
				cells[i][j].getNeighborStates(i,j);
			}
		}
	}

	for(i = 0; i < width / cell_width;i++){
		for(j = 0; j < height / cell_height;j++){

			if(pause_button.control== false){
				cells[i][j].update(rule_number);
			}
		
			if(cells[i][j].is_on == true){
				noStroke();
				fill(255,255,255);
				rect(cells[i][j].x_position,cells[i][j].y_position, cell_width,cell_height);
			} 
		}
	}

	if(grid_button.control == true){
		stroke(0,55,0);
		for(i = 0; i < width / cell_width;i++){
			line(i*cell_width, 0, i*cell_width, height);
		}
		for(i = 0; i < height / cell_height;i++){
			line(0, i*cell_height, width, i*cell_height);
		}
	}

	pause_button.draw(pause_icon);
	grid_button.draw(grid_icon);
	drawing_button.draw(drawing_icon);
	//hide_button.draw(hide_icon);

} 


function keyPressed(){
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
		pressed = true;
		pause_button.update();
		grid_button.update();
		drawing_button.update();
	}
	return false;
}

function mouseReleased(){
	if (mouseButton == LEFT){
		pressed = false;
	}
	return false;
}