///////vector2: Two dimensional vector
function vector2(x,y)
{
	this.x = x;
	this.y = y;
}






///////monster: the monster class
function monster(x,y)
{
	this.x = x;
	this.y = y;
	this.speed = 0.0;
	this.angle = 0.0;
	this.mass = 707;
	this.radius = 15.0;
	this.out_of_water = false;
	this.fame = 0;
	this.name = "?";
}

monster.prototype.getMovementVector = function()
{
	return new vector2(Math.cos(this.angle) * this.speed, -Math.sin(this.angle) * this.speed);
}

monster.prototype.setMovementVector = function(x,y)
{
	this.speed = Math.sqrt(x*x + y*y);//now convert back to a direction-magnitude vector
	this.angle = Math.atan2(-y,x);
}

monster.prototype.getFameText = function()
{
	var kFameLevels = [ [10,   "Completely unheard of"],
						[20,   "Rumors are stirring..."], 
						[30,   "A local legend"], 
						[100,  "Even intelligent people are listening"],
						[500,  "A national treasure"],
						[1000, "Internationally wanted"] ];

	for (var i = 0; i < kFameLevels.length; i++)
	{
		if (gMonster.fame < kFameLevels[i][0])
		{
			return kFameLevels[i][1];
		}
	}
	
	//default
	return "Globally feared";
}

monster.prototype.getSizeText = function()
{
	var kMassLevels = [ [300,   "Puny"],
						[1500,   "Growing"],
						[3000,   "Intimidating"],
						[6000,  "Scary big"],
						[12000,  "Terrifying"],
						[18626,  "Monstrous"] ];

	for (var i = 0; i < kMassLevels.length; i++)
	{
		if (gMonster.mass < kMassLevels[i][0])
		{
			return kMassLevels[i][1];
		}
	}
	
	return "Leviathan";
}






///////UI: User interface class
function UI(x,y,width,height,restingy)
{
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.restingy = restingy || y;
	this.open = false;
	
	this.sprites = new Array(7);
	this.sprites[0] = new Image();
	this.sprites[0].src="data:image/png;base64,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";
	this.sprites[1] = new Image();
	this.sprites[1].src="data:image/png;base64,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";
	this.sprites[2] = new Image();
	this.sprites[2].src="data:image/png;base64,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";
	this.sprites[3] = new Image();
	this.sprites[3].src="data:image/png;base64,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";
	this.sprites[4] = new Image();
	this.sprites[4].src="data:image/png;base64,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";
	this.sprites[5] = new Image();
	this.sprites[5].src="data:image/png;base64,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";
	this.sprites[6] = new Image();
	this.sprites[6].src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAyCAYAAAAZUZThAAABhklEQVR42u3cO6rCQBhA4SzAUrAQWzdgJwQFV2BhlUqIVSp7N5EyXZZi4z7cSS4RlOSaiN4nON+B06X6h0NIZpIoiqKKZK+GQAqEFAgpEPJ/AwFCRCCAQACBAAIBBAIIBFdOp1OVpulD62sgkOAoiuLp9+/z+VwoAgnrzvGVjaosywxPIO/PdrttzXg4HFaz2azlZDIRiUDC5Hg83ua7XC57r9vtdpdYRqNRa03yPDdEgbw3ZVlefJbxeHxbkziODVAgaLLZbAQiEPSxWq0EIhB0cTgcWmsiEIEER9+m4WKxuFuT+uEdAgkqjmf2QerXweIQSNAP4H1Op1ODEohABoPB3aahu4ZABOIBXCAQiEAgEIHgJ2keXlyv1wYiEDRpHl585XwWBBIMrx5ehEAAgQACAQQCCAS/wPl8rvb7vT+XCASfw6iPtPveXCDoiKNr3nbSBYKqvTnoYyiBoIMkSXzzIRA84vrvK3cOgQACAQQCCEQgEIhAgO8EQlIgpEBIgZACIf/eD0qX8/tEI32xAAAAAElFTkSuQmCC";


	
	var min_spacing = 10;
	this.aVspacing = 10;
	this.amargin = width * 0.05;
	this.aVmargin = height * 0.15;
	this.achievements_per_row = Math.floor((width - this.amargin * 2.0) / (200 + min_spacing));
	this.aHspacing = (width - 2.0 * this.amargin - 200 * this.achievements_per_row) / (this.achievements_per_row-1);
}

UI.prototype.isOpen = function()
{
	return (this.y > this.restingy);
}

UI.prototype.getAchievementPosition = function(index)
{
	return new vector2(Math.floor(this.x + this.amargin + (index % this.achievements_per_row) * (200 + this.aHspacing)),Math.floor(this.y + this.aVmargin + Math.floor(index / this.achievements_per_row) * (50 + this.aVspacing)));
}




///////boat: Boat class, which includes birds for now
function boat(x,y, des_speed, ox, oy, width, height, max_speed, image_index, reward_fame, mine_drop)
{
	this.x 				= x;//current x coordinate
	this.y 				= y;//current y coordinate
	this.vx 			= 0.0;//current x component of the velocity
	this.vy 			= 0.0;//current y component of the velocity
	this.sprite_rot 	= 0.0;//sprite rotation
	this.des_speed 		= des_speed;//desired horizontal speed
	this.ox 			= ox;//origin x coordinate
	this.oy 			= oy;//origin y coordinate
	this.width 			= width;
	this.height 		= height;
	this.capsized 		= false;
	this.max_speed 		= max_speed;
	this.image_index 	= image_index;
	this.in_the_air 	= false;
	this.spin 			= 0.0;
	this.reward_mass 	= width * height;
	this.reward_fame 	= reward_fame;
	this.inactive 		= false;
	this.hit_by_monster	= false;
	this.mine_drop		= mine_drop || -1;
	this.mine_delay		= 300;
}






///////achievement: class that holds an achievement
function achievement(name,min_fame,flavor_text)
{
	this.name = name;
	this.min_fame = min_fame;
	this.flavor_text = flavor_text;
	this.done = false;
}

function getAchievementByName(achievement_list,name)
{
	for (var i = 0; i < achievement_list.length; i++)
	{
		if (achievement_list[i].name == name)
			return achievement_list[i];
	}
}







///////some factory functions
function sailboat_factory(x)
{
	x = x || Math.round(Math.random()) * kWidth;
	var y = gPoints[Math.min(kPoints - 1,Math.max(Math.floor(kPoints * x / kWidth),0))] + kWaterLine;
	return new boat(x,y,Math.random() * 5.0 - 2.5,18,48,36,53,20.0,1,0.05);
}

function jetski_factory(x)
{
	x = x || Math.round(Math.random()) * kWidth;
	var y = gPoints[Math.min(kPoints - 1,Math.max(Math.floor(kPoints * x / kWidth),0))] + kWaterLine;
	return new boat(x,y,Math.random() * 10.0 - 5.0,12,15,26,17,60.0,2,0.0);
}

function bird_factory(x,y)
{
	var xx = Math.random() * (kWidth - gWindow.width);
	if (xx >= gWindow.left && xx <= (gWindow.left + gWindow.width))
		xx = (xx + gWindow.width) % kWidth;
	x = x || xx;
	y = y || Math.random() * (gPoints[Math.min(kPoints - 1,Math.max(Math.floor(kPoints * x / kWidth),0))] + kWaterLine - 100.0);
	return new boat(x,y,(Math.random() * 2.0 + 2.0) * (x < kWidth / 2.0 ? 1 : -1),8,8,4,4,10.0,3,0.0);//yes, birds are boats...
}

function battleship_factory(x)
{
	x = x || Math.round(Math.random()) * kWidth;
	var y = gPoints[Math.min(kPoints - 1,Math.max(Math.floor(kPoints * x / kWidth),0))] + kWaterLine;
	//205,45
	return new boat(x,y,Math.random() * 4.0 - 2.0,102,40,205,45,20.0,4,10);
}
