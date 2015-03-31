//constants
var kMaxBoats = 100;
var kMaxBirds = 50;
var kFrameDelay = 30;
var kPoints = 501;
var kWaterGrad;
var kSkyGrad;
var kDampening = 0.005;
var kTension = 0.1;
var kStiffness = 0.025;
//var gWindow.width = window.innerWidth - 20;
//var gWindow.height = window.innerHeight - 20;
var kWidth = (window.innerWidth - 20) * 5;//2000;
var kHeight = window.innerHeight - 20;
var kWaterLine = kHeight / 2;
var kBoatStats;

var gBoats;
var gBirds;
var gMonster;
var gSprites;
var gAchievements;
var gPoints;
var gSpeeds;
var gContext;
var gKeys;
//var gWindow.left;
//var gWindow.top;
var gFrame;
var gBoatDelays;
var gUI;

function Window()
{
	this.render_width = window.innerWidth - 20;
	this.render_height = window.innerHeight - 20;
	this.width = window.innerWidth - 20;
	this.height = window.innerHeight - 20;
	this.left = 0.0;
	this.top = 0.0;
	this.zoom = 1.0;
}

var gWindow = new Window();

function new_game()
{
	for (var i = 0; i < kPoints; i++)
	{
		gPoints[i] = 0.0;
		gSpeeds[i] = 0.0;// Math.random() * 20.0 - 10.0;
	}
	
	for (var i = 0; i < gBoatDelays.length; i++)
		gBoatDelays[i] = 0;
		
	for (var i = 0; i < kMaxBoats; i++)
	{
		gBoats[i] = new boat();
		gBoats[i].inactive = true;
	}
	
	for (var i = 0; i < gBirds.length; i++)
	{
		gBirds[i] = new boat(); //yes, birds are boats...
		gBirds[i].inactive = true;
	}
	
	gAchievements = new Array(6);
	gAchievements[0] = new achievement("ate_jetski",0,"Eat a jetski. <br /><span style=\"font-style: italic; font-size: 50%\">Mmm... Tasty...</span>");
	gAchievements[1] = new achievement("ate_sailboat",0,"Eat a sailboat. <br /><span style=\"font-style: italic; font-size: 50%\">Incredible texture</span>");
	gAchievements[2] = new achievement("named",10,"Name your monster. <br /><span style=\"font-style: italic; font-size: 50%\">Spoilers: it does nothing</span>");
	gAchievements[3] = new achievement("hit_bird_with_boat",20,"Hit a bird with any sea-vessel. <br /><span style=\"font-style: italic; font-size: 50%\">What'd that bird ever do to you?</span>");
	gAchievements[4] = new achievement("wave_sink",30,"Sink a sea-vessel without ever touching it. <br /><span style=\"font-style: italic; font-size: 50%\">Easier said than done</span>");
	gAchievements[5] = new achievement("object_into_space",1000,"Knock an object really, really high. <br /><span style=\"font-style: italic; font-size: 50%\">Now it's a spaceship</span>");
	
	gUI = new UI(gWindow.render_width * 0.1, -gWindow.render_height * 0.7, gWindow.render_width * 0.8, gWindow.render_height * 0.8);
	
	gWindow.zoom = 38.5/15.0;
	gMonster = new monster(100.0,kWaterLine + 100.0);
}

function init()
{
	gSprites = new Array(5);
	gPoints = new Array(kPoints);
	gSpeeds = new Array(kPoints);
	gBoats = new Array(kMaxBoats);
	gBirds = new Array(kMaxBirds);
	gKeys = new Array(6);
	gKeys[0] = gKeys[1] = gKeys[2] = gKeys[3] = gKeys[4] = gKeys[5] = false;
	
	//encoded as a base-64 string so I don't have to upload the boat image to some server.
	gSprites[0] = new Image();
	gSprites[0].src="data:image/png;base64,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";
	//gSprites[0].src = "monster.png";

	gSprites[1] = new Image();
	gSprites[1].src="data:image/png;base64,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";
	//gSprites[1].src = "sailboat.png";
	
	gSprites[2] = new Image();
	gSprites[2].src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAARCAYAAADDjbwNAAAA8UlEQVQ4T92U0RGDQAhEoYKkFZNmtJBUkULOZqIdpAY7IAMGBxnOw8lf7sdRd3kuJ4fQXmQk2JbHiqyRplKkwm0Ysp4dMWWaStlS/QdoIZBEVwTpgCY8k67ZOoUoiO/fY4Gu72UPELFZQ3RHf5GFWJ0m42dEROBYGNRNgWxh/2EEa1v98rAUyO6PLViDWI0CU/1lI7dx17JKklo6CwpboMaF5K+TFQkfAeEZHCmHkG8iuLj8UXHPUxhm+szm7r6WmF/rNQNh3Q6UNR2NQvRug/C48RzM43i2RkrPQ60DLaDI9Svcnxzb9taAqU+viOzx9AEz8VYMnOvuJQAAAABJRU5ErkJgggAA";
	//gSprites[2].src = "jetski.png";
	
	gSprites[3] = new Image();
	gSprites[3].src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAOUlEQVQYV2NkgIK//+//h7GZGRUZYWw4AyQAU0SaAnRdID7IBJg43ApkN4Csg1mD4gaYw5BpyhUAAAP3G+PtETNHAAAAAElFTkSuQmCC";
	//gSprites[3].src = "bird.png";
	
	gSprites[4] = new Image();
	gSprites[4].src="data:image/png;base64,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";


	kBoatStats = new Array(2);
	kBoatStats[0] = sailboat_factory;
	kBoatStats[1] = jetski_factory;
	kBoatStats[2] = battleship_factory;
	gBoatDelays = new Array(kBoatStats.length);
	
	var canvas = document.getElementById("canvasbox");
	canvas.addEventListener("click", gameClick, false);
	canvas.addEventListener("mousemove",gameMouseMove, false);
	canvas.addEventListener("mousewheel",gameMouseScroll,false);
	document.addEventListener("keydown", KeyPressed, false);
	document.addEventListener("keyup", KeyReleased, false);
	gContext = canvas.getContext('2d');
	
	canvas.width = gWindow.render_width;
	canvas.height = gWindow.render_height;
	
	kWaterGrad = gContext.createLinearGradient(0,kWaterLine,0,kHeight);
	kWaterGrad.addColorStop(0,"rgba(0,46,255,0.5)");
	kWaterGrad.addColorStop(1,"rgba(0,8,46,0.9)");
	
	kSkyGrad = gContext.createLinearGradient(0,-4000,0,kWaterLine);
	//kSkyGrad.addColorStop(0,"#000000");
	kSkyGrad.addColorStop(0,"#007399");
	kSkyGrad.addColorStop(1,"#00BFFF");
	
	gFrame = 0;
	
	new_game();
	
	update();
}

function update()
{
	//handle keyboard input
	processKeyboardInput();
	
	//update the user interface
	updateUI();
	
	//if the UI drawer has been pulled out, pause the rest of the game
	if (!gUI.isOpen())
	{
		//create more boats, if necessary
		gFrame++;
		createBoats(gFrame);
		
		//move stuff
		physicsWater();
		physicsBoats();
		physicsBirds();
		physicsMonster();
	}

	//clear the screen
	gContext.fillStyle = kSkyGrad;
	gContext.fillRect(0,0,gWindow.render_width,gWindow.render_height);
	
	//draw stuff
	drawBoats();
	drawBirds();
	drawMonster();
	drawWater();
	drawUI();
	
	setTimeout(update,kFrameDelay);
}

function processKeyboardInput()
{
	var max_speed = 20.0;
	var speed_increments = 0.1;
	var angle_increments = 0.1;

	if (!gMonster.out_of_water && !gUI.isOpen())
	{
		if (gKeys[0])//right arrow
			gMonster.angle -= angle_increments;
		if (gKeys[1])//left arrow
			gMonster.angle += angle_increments;
		if (gKeys[2] && gMonster.speed > 0.0)//down arrow
			gMonster.speed = Math.max(0.0, gMonster.speed - speed_increments * 5.0);
		if (gKeys[3] && gMonster.speed < max_speed)//up arrow
			gMonster.speed += speed_increments;
		//if (gKeys[4])
		//	gUIOpen = !gUIOpen;
		
		//if nothing is being pushed, slow down
		if (!gKeys[0] && !gKeys[1] && !gKeys[2] && !gKeys[3])
			gMonster.speed *= 0.99;
	}
}

function createBoats(frame)
{
	for (var i = 0; i < gBoatDelays.length; i++)
	{
		if (frame >= gBoatDelays[i])
		{
			//find the first inactive boat
			for (var j = 0; j < kMaxBoats; j++)
			{
				if (gBoats[j].inactive)
				{
					//make the boat
					gBoats[j] = kBoatStats[i](Math.random() * (kWidth - gWindow.width));
					if (gBoats[j].x >= gWindow.left && gBoats[j].x <= (gWindow.left + gWindow.width))
						gBoats[j].x = (gBoats[j] + gWindow.width) % kWidth;
					
					//gBoats[j] = kBoatStats[i](Math.round(Math.random()) * kWidth);

					//make the delay
					gBoatDelays[i] += Math.floor(Math.random() * 300);
					
					break;
				}
			}
			
			//now make a bird!
			for (var j = 0; j < gBirds.length; j++)
			{
				if (gBirds[j].inactive)
				{
					gBirds[j] = bird_factory();
					break;
				}
			}
		}
	}
}

function updateUI()
{
	if (gUI.open)
	{
		//move the drawer is still being pulled out, pull it out!
		if (gUI.y < gWindow.render_height * 0.1)
		{
			gUI.y += gUI.height / 15.0;
			
			if (gUI.y > gWindow.render_height * 0.1)
				gUI.y = gWindow.render_height * 0.1;
		}
	}
	else if (gUI.y > gUI.restingy)
	{
		gUI.y -= gUI.height / 15.0;
		
		if (gUI.y < gUI.restingy)
			gUI.y = gUI.restingy;
	}
}

function physicsWater()
{
	//apply the physics
	for (var i = 0; i < kPoints; i++)
	{
		gPoints[i] += Math.min(gSpeeds[i],100.0);//dampening and surface tension will quickly bring the actual speed under control
		//gSpeeds[i] = (1.0 - kDampening) * (gSpeeds[i] - kStiffness * gPoints[i]);
		gSpeeds[i] += -kStiffness * (gPoints[i] - 5.0 * Math.sin(gFrame / 10.0 + i / 5.0)) - gSpeeds[i] * kDampening;
	}
	
	//move the surrounding water
	var leftDeltas = new Array(kPoints);
	var rightDeltas = new Array(kPoints);
	
	var iterations = 8;
	var last_point_index = kPoints - 1;
	for (var i = 0; i < iterations; i++)
	{
		leftDeltas[0] = kTension * (gPoints[last_point_index] - gPoints[0]);
		rightDeltas[0] = kTension * (gPoints[1] - gPoints[0]);
		for (var j = 1; j < last_point_index; j++)
		{
				leftDeltas[j] = kTension * (gPoints[j - 1] - gPoints[j]);
				rightDeltas[j] = kTension * (gPoints[j + 1] - gPoints[j]);
		}
		leftDeltas[last_point_index] = kTension * (gPoints[last_point_index - 1] - gPoints[last_point_index]);
		rightDeltas[last_point_index] = kTension * (gPoints[0] - gPoints[last_point_index]);
		
		
		//gPoints[0] += rightDeltas[0];
		//gSpeeds[0] += rightDeltas[0];
		
		//gPoints[kPoints - 1] += leftDeltas[kPoints - 1];
		//gSpeeds[kPoints - 1] += leftDeltas[kPoints - 1];
		
		//for (var j = 1; j < (kPoints-1); j++)
		for (var j = 0; j < kPoints; j++)
		{
			var diff = leftDeltas[j] + rightDeltas[j];
			
			//if (isNaN(diff))
			//	diff = 0.0;
			
			gPoints[j] += diff;
			gSpeeds[j] += diff;
		}
	}
}

function physicsBoats()
{
	for (var i = 0; i < gBoats.length; i++)
	{
		if (gBoats[i].inactive)
			continue;
		
		//determine which point we're above
		var p = Math.floor(gBoats[i].x * kPoints / kWidth);
	
		//first off, do something completely different if capsized
		if (gBoats[i].capsized && gBoats[i].y > gPoints[p] + kWaterLine)
		{
			if (gBoats[i].y > kHeight)
				gBoats[i].inactive = true;
			else
				gBoats[i].y += 0.98 + gSpeeds[p] * (1.0 - (gBoats[i].y - kWaterLine) / kWaterLine);
		}
		else
		{
			//apply the phyics from the previous frame
			gBoats[i].x += gBoats[i].vx;
			gBoats[i].y += gBoats[i].vy;
			
			//determine if we're touching the water
			if (gBoats[i].y >= (gPoints[p] + kWaterLine))
			{
				//if we just hit the water, check if it needs to get capsized
				if (gBoats[i].in_the_air)
				{
					var true_angle = clip_angle(gBoats[i].sprite_rot);
					if (gBoats[i].vy > gBoats[i].max_speed || (true_angle > Math.PI * 0.5 && true_angle < Math.PI * 1.5))
					{
						gBoats[i].capsized = true;
						gMonster.fame += gBoats[i].reward_fame;
						
						if (!gBoats[i].hit_by_monster)
							getAchievementByName(gAchievements,"wave_sink").done = true;
					}
				}
				else
				{
					//if we're touching the water, fix the velocities
					gBoats[i].y = gPoints[p] + kWaterLine;
					gBoats[i].vx = gBoats[i].des_speed;
					gBoats[i].vy = gSpeeds[p];
					
					//now determine our sprite rotation
					var offset = Math.floor((gBoats[i].width / 2.0) / (kWidth / kPoints));
					var lp = Math.max(0,p - offset);
					var rp = Math.min(kPoints-1,p + offset);
					
					gBoats[i].sprite_rot = Math.atan2(gPoints[rp] - gPoints[lp], rp - lp) * 0.5;
				}
				
				gBoats[i].in_the_air = false;
			}
			//if we're not touching, keep flying!
			else
			{
				//if we just achieved flight, check for spin
				if (!gBoats[i].in_the_air)
				{
					gBoats[i].spin = Math.min(0.5,gBoats[i].sprite_rot * gBoats[i].vy / 50.0);
				}
				else if (gBoats[i].y < -4000.0)
				{
					getAchievementByName(gAchievements,"object_into_space").done = true;
				}
				
				//now apply gravity
				gBoats[i].vy += 0.98;
				
				//now spin
				gBoats[i].sprite_rot += gBoats[i].spin;
				
				//now apply the terminal velocity
				if (gBoats[i].vy > 60.0)
					gBoats[i].vy = 60.0;
				else if (gBoats[i].vy < -100.0)
					gBoats[i].vy = -100.0;
					
				gBoats[i].in_the_air = true;
				
				//now check for birds!
				for (var k = 0; k < gBirds.length; k++)
				{
					if (!gBirds[k].inactive)
					{
						if (circle_boat_collision(gBirds[k].x,gBirds[k].y,(gBirds[k].width + gBirds[k].height) / 2.0, gBoats[i]))
						{
							gBirds[k].vx = gBoats[i].vx * 1.1;
							gBirds[k].vy = gBoats[i].vy * 1.5;
							gBirds[k].capsized = true;
							getAchievementByName(gAchievements,"hit_bird_with_boat").done = true;
						}
					}
				}
			}
			
			//if we're out of bounds then put us back in
			if (gBoats[i].x < 0)
			{
				gBoats[i].x += kWidth;
				//gBoats[i].des_speed = -gBoats[i].des_speed;
				//gBoats[i].x = 0;
				//gBoats[i].vx = -gBoats[i].vx;
			}
			else if (gBoats[i].x > (kWidth - 1))
			{
				gBoats[i].x -= kWidth;
				//gBoats[i].des_speed = -gBoats[i].des_speed;
				//gBoats[i].x = kWidth - 1;
				//gBoats[i].vx = -gBoats[i].vx;
			}
			
			//if the monster hit this boat...
			//if it ever becomes apparent that we need more accuracy, rotate the monster coordinates by the inverse of boat's rotation for this calculation
			/*
			var cx = Math.max(gBoats[i].x - gBoats[i].ox, Math.min(gBoats[i].x + gBoats[i].width - gBoats[i].ox, gMonster.x));
			var cy = Math.max(gBoats[i].y - gBoats[i].oy , Math.min(gBoats[i].y + gBoats[i].height - gBoats[i].oy, gMonster.y));
			var dx = gMonster.x - cx;
			var dy = gMonster.y - cy;
			//var hyp = gMonster.radius;
			if (dx * dx + dy * dy < gMonster.radius * gMonster.radius)*/
			var dir = clip_angle(gMonster.angle);
			if (circle_boat_collision(gMonster.x, gMonster.y, gMonster.radius, gBoats[i]))
			{
				//if it's from above, crush this boat
				if (dir > Math.PI)
				{
					if (gMonster.y < gBoats[i].y)
					{
						gMonster.fame += gBoats[i].reward_fame;
						
						if (gBoats[i].reward_mass < gMonster.mass)
						{
							gMonster.mass += gBoats[i].reward_mass;
							gBoats[i].inactive = true;
							
							if (gBoats[i].image_index == 1)
								getAchievementByName(gAchievements,"ate_sailboat").done = true;
							else if (gBoats[i].image_index == 2)
								getAchievementByName(gAchievements,"ate_jetski").done = true;
						}
						else
						{
							gBoats[i].capsized = true;
							gBoats[i].y += gMonster.radius;
						}
					}
				}
				
				else
				{
					//shoot it into the air (even more than the water did)
					var mv = gMonster.getMovementVector();
					var totmass = gMonster.mass + gBoats[i].reward_mass;
					var bvx = (2*gMonster.mass * mv.x - gMonster.mass * gBoats[i].vx + gBoats[i].reward_mass * gBoats[i].vx) / totmass;
					var bvy = (2*gMonster.mass * mv.y - gMonster.mass * gBoats[i].vy + gBoats[i].reward_mass * gBoats[i].vy) / totmass;
					
					var mvx = (2 * gBoats[i].reward_mass * gBoats[i].vx - gBoats[i].reward_mass * mv.x + gMonster.mass * mv.x) / totmass;
					var mvy = (2 * gBoats[i].reward_mass * gBoats[i].vy - gBoats[i].reward_mass * mv.y + gMonster.mass * mv.y) / totmass;
					
					gBoats[i].vx = bvx;
					gBoats[i].vy = bvy;
					
					gMonster.setMovementVector(mvx,mvy);
					
					//gBoats[i].vx = Math.cos(gMonster.angle) * gMonster.speed * gMonster.radius / 40.0;
					//gBoats[i].vy = -Math.sin(gMonster.angle) * gMonster.speed * gMonster.radius / 15.0;
					
					//give it a spin
					gBoats[i].spin = (gMonster.x - gBoats[i].x) * gMonster.speed * gMonster.radius / 40000.0;
					
					//set the flag
					gBoats[i].hit_by_monster = true;
				}
			}
		}
	}
}

function physicsBirds()
{
	for (var i = 0; i < gBirds.length; i++)
	{
		if (gBirds[i].inactive)
			continue;
		
		//determine which point we're above
		var p = Math.floor(gBirds[i].x * kPoints / kWidth);
	
		//first off, do something completely different if capsized
		if (gBirds[i].capsized && gBirds[i].y > gPoints[p] + kWaterLine)
		{
			if (gBirds[i].y > kHeight)
				gBirds[i].inactive = true;
			else
				gBirds[i].y += 0.98 + gSpeeds[p] * (1.0 - (gBirds[i].y - kWaterLine) / kWaterLine);
		}
		else
		{
			//apply the phyics from the previous frame
			gBirds[i].x += gBirds[i].vx;
			gBirds[i].y += gBirds[i].vy;
			gBirds[i].sprite_rot += gBirds[i].spin;
			
			//determine if we're touching the water
			if (gBirds[i].y >= (gPoints[p] + kWaterLine))
			{
				gBirds[i].capsized = true;
				gMonster.fame += gBirds[i].reward_fame;
			}
			//if we're not touching, keep flying!
			else
			{
				if (gBirds[i].capsized)
				{
					gBirds[i].spin = Math.min(0.5,gBirds[i].sprite_rot * gBirds[i].vy / 50.0);
					gBirds[i].vy += 0.98;
					//gBirds[i].sprite_rot += gBirds[i].spin;
					
					if (gBirds[i].vy > 60.0)
						gBirds[i].vy = 60.0;
					else if (gBirds[i].vy < -100.0)
						gBirds[i].vy = -100.0;
				}
				else
				{
					gBirds[i].vy = 0.0;
					gBirds[i].vx = gBirds[i].des_speed;
				}
			}
			
			//if we're out of bounds then wrap around
			if (gBirds[i].x < 0)
				gBirds[i].x += kWidth;
			else if (gBirds[i].x >= kWidth)
				gBirds[i].x -= kWidth;
			/*
			if (gBirds[i].x < 0 || gBirds[i].x > kWidth)
			{
				gBirds[i].inactive = true;
			}
			*/
			
			//if the monster hit this bird...
			var dx = gMonster.x - gBirds[i].x;
			var dy = gMonster.y - gBirds[i].y;
			var hyp = gMonster.radius + gBirds[i].width / 2.0;
			//var dir = clip_angle(gMonster.angle);
			if (dx * dx + dy * dy < hyp * hyp)
			{
				//if we can eat it...
				if (gBirds[i].reward_mass < gMonster.mass)
				{
					gMonster.mass += gBirds[i].reward_mass;
					gBirds[i].inactive = true;
				}
				else
				{
					gBirds[i].capsized = true;
					
					//shoot it into the air
					var mv = gMonster.getMovementVector();
					var totmass = gMonster.mass + gBirds[i].reward_mass;
					gBirds[i].vx = (2*gMonster.mass * mv.x - gMonster.mass * gBirds[i].vx + gBirds[i].reward_mass * gBirds[i].vx) / totmass;
					gBirds[i].vy = (2*gMonster.mass * mv.y - gMonster.mass * gBirds[i].vy + gBirds[i].reward_mass * gBirds[i].vy) / totmass;
					
					//give it a spin
					gBirds[i].spin = Math.random() * Math.PI / 32.0;
				}
			}
		}
	}
}

function physicsMonster()
{
	//not really physics, but grow the monster if necessary
	gMonster.mass = Math.min(gMonster.mass, 18627.0);
	gMonster.radius = Math.floor(Math.sqrt(gMonster.mass / Math.PI));

	//reign it in if it's trying to escape
	if (gMonster.x <= 0.0)
	{
		//gMonster.angle = Math.PI - gMonster.angle;
		//gMonster.x = 0.0;
		gMonster.x += kWidth;
	}
	if (gMonster.x >= kWidth)
	{
		//gMonster.angle = Math.PI - gMonster.angle;
		//gMonster.x = kWidth - 1;
		gMonster.x -= kWidth;
	}
	
	if (gMonster.y >= kHeight)
	{
		gMonster.angle = 2.0 * Math.PI - gMonster.angle;
		gMonster.y = kHeight - 1;
	}
	
	//now check if we're out of water
	var v = gMonster.getMovementVector();
	var p = Math.floor(gMonster.x * kPoints / kWidth);
	if (gPoints[p] + kWaterLine > gMonster.y)
	{
		//create a wave if we just broke the surface
		if (!gMonster.out_of_water)
		{
			var watermass = kWaterLine - gPoints[p];
			var mvy = -Math.sin(gMonster.angle) * gMonster.speed;
			var totmass = watermass + gMonster.mass;
			var new_speed = (3 * gMonster.mass * mvy - gMonster.mass * gSpeeds[p] + watermass * gSpeeds[p]) / totmass;
			gSpeeds[p] = new_speed;
			//gSpeeds[p] = v.y * gMonster.radius / 4.0;
		}
		
		//apply gravity
		gMonster.setMovementVector(v.x,v.y + 0.98);
		
		gMonster.out_of_water = true;
	}
	else
	{
		if (gMonster.out_of_water)
		{
			var watermass = kWaterLine - gPoints[p];
			var mvy = -Math.sin(gMonster.angle) * gMonster.speed;
			var totmass = watermass + gMonster.mass;
			var new_speed = (2 * gMonster.mass * mvy - gMonster.mass * gSpeeds[p] + watermass * gSpeeds[p]) / totmass;
			gSpeeds[p] = new_speed;
			//gSpeeds[p] = v.y * gMonster.radius / 4.0;
		}
		
		gMonster.out_of_water = false;
		gMonster.speed = Math.min(gMonster.speed, 50.0);
	}
	
	//now actually apply the physics
	gMonster.x += v.x;
	gMonster.y += v.y;
	
	//finally, not physics, but adjust the viewport to follow the little guy and adjust the fame
	gWindow.zoom = Math.max(38.5 / gMonster.radius, gWindow.zoom - 0.005);
//	gWindow.zoom = 38.5 / gMonster.radius;
	gWindow.width = gWindow.render_width / gWindow.zoom;
	gWindow.height = gWindow.render_height / gWindow.zoom;
	
	gWindow.left = gMonster.x - gWindow.width / 2.0;
	gWindow.top = Math.min(kHeight - gWindow.height, gMonster.y - gWindow.height / 2.0);
	
	if (gWindow.left < 0.0)
		gWindow.left += kWidth;
	if (gWindow.left > kWidth)
		gWindow.left -= kWidth;
	
	if (gMonster.out_of_water)
		gMonster.fame += 0.003 * (gMonster.radius / 15.0);
}

function drawWater()
{
	/*
	var p = real_to_view(0.0,gPoints[0] + kWaterLine);
	gContext.beginPath();
	gContext.moveTo(p.x,p.y);
	
	var separation = kWidth / (kPoints-1);
	for (var i = 1; i <= kPoints; i++)
	{
		p = real_to_view(i * separation,gPoints[i] + kWaterLine);
		gContext.lineTo(p.x,p.y);
	}
	
	gContext.strokeStyle = "#000A99";
	gContext.lineWidth = 5 * gWindow.zoom;
	gContext.lineJoin = "round";
	
	gContext.stroke();
	
	p = real_to_view(kWidth,kHeight);
	gContext.lineTo(p.x,p.y);
	p = real_to_view(0,kHeight);
	gContext.lineTo(p.x,p.y);
	
	//gContext.lineTo((kWidth - gWindow.left) * gWindow.zoom, (kHeight - gWindow.top) * gWindow.zoom);
	//gContext.lineTo(0,(kHeight - gWindow.top) * gWindow.zoom);

	gContext.closePath();
	gContext.fillStyle = kWaterGrad;
	gContext.fill();
	*/
	
	var separation = kWidth / (kPoints-1);
	var p = real_to_view(0,kWaterLine);
	gContext.beginPath();
	gContext.moveTo(-100.0,p.y);
	
	//figure out which point to start with (since order matters or things get weird)
	var fp = Math.floor(gWindow.left / separation);
	if (fp <= 0)
		fp = kPoints - 1;
	var num_points_to_cover = Math.ceil(gWindow.width / separation) + 2;
	for (var i = 0; i < num_points_to_cover; i++)
	{
		p = real_to_view(((fp + i) % kPoints) * separation, gPoints[((fp + i) % kPoints)] + kWaterLine);
		
		//if ((p.x + separation / gWindow.zoom) >= gWindow.left && p.x < (gWindow.left + gWindow.width + separation / gWindow.zoom))
		gContext.lineTo(p.x,p.y);
	}
	
	gContext.strokeStyle = "#000A99";
	gContext.lineWidth = 5.0 * gWindow.zoom;
	gContext.lineJoin = "round";
	
	//p = real_to_view(kWidth,kHeight);
	//p = real_to_view(0,kWaterLine);
	//gContext.lineTo(gWindow.left + gWindow.render_width + 100.0,p.y);
	
	gContext.stroke();
	
	p = real_to_view(0,kHeight);
	gContext.lineTo(gWindow.render_width + 100.0,p.y);
	gContext.lineTo(-100,p.y);
	
	//gContext.lineTo((kWidth - gWindow.left) * gWindow.zoom, (kHeight - gWindow.top) * gWindow.zoom);
	//gContext.lineTo(0,(kHeight - gWindow.top) * gWindow.zoom);

	gContext.closePath();
	gContext.fillStyle = kWaterGrad;
	gContext.fill();
}

function drawBoats()
{
	for (var i = 0; i < gBoats.length; i++)
	{
		if (!gBoats[i].inactive)
			rotateAndPaintImage(gSprites[gBoats[i].image_index], gBoats[i].sprite_rot, gBoats[i].vx < 0.0, gBoats[i].x, gBoats[i].y, gBoats[i].ox,gBoats[i].oy);
	}
}

function drawBirds()
{
	for (var i = 0; i < gBirds.length; i++)
	{
		if (!gBirds[i].inactive)
			rotateAndPaintImage(gSprites[gBirds[i].image_index], gBirds[i].sprite_rot, gBirds[i].vx < 0.0, gBirds[i].x, gBirds[i].y, gBirds[i].ox,gBirds[i].oy);
	}
}

function drawMonster()
{
	var p = real_to_view(gMonster.x, gMonster.y);
	var angle = -gMonster.angle;
	var scale_factor = 0.5;//gWindow.zoom * gMonster.radius / 77;
	var yflip = clip_angle(gMonster.angle - Math.PI / 2.0) < Math.PI ? -1 : 1;
	
	gContext.translate(p.x, p.y);
	gContext.rotate(angle);
	gContext.scale(scale_factor, yflip * scale_factor);
	gContext.drawImage( gSprites[0], -105, -103 );
	gContext.scale(1.0 / scale_factor, 1.0 / (yflip * scale_factor));//wanna see something really weird? swap the order of this line and the one below it
	gContext.rotate(-angle);
	gContext.translate(-p.x,-p.y);
	
	//rotateAndPaintImage(gSprites[0], -gMonster.angle, false, , gMonster.x - gWindow.left, gMonster.y - gWindow.top, 105, 103);
}

function drawUI()
{
	//before drawing the drawer, draw any achievements that should be partially hidden
	if (gUI.isOpen())
	{
		for (var i = 0; i < gAchievements.length; i++)
		{
			if (!gAchievements[i].done)
			{
				var p = gUI.getAchievementPosition(i);
				
				if (gAchievements[i].min_fame > gMonster.fame)
					gContext.drawImage(gUI.sprites[gUI.sprites.length-1],p.x,p.y);
				else
					gContext.drawImage(gUI.sprites[i],p.x,p.y);
			}
		}
	}
	
	//draw the drawer
	gContext.fillStyle = "rgba(0,0,0,0.5)";
	gContext.strokeStyle = "black";
	
	gContext.fillRect(gUI.x, gUI.y, gUI.width, gUI.height);
	gContext.lineWidth = 5;
	gContext.strokeRect(gUI.x, gUI.y, gUI.width, gUI.height);
	
	//draw the fame meter
	gContext.fillStyle= "white";
	gContext.font = "36px serif";
	gContext.textAlign = "left";
	gContext.fillText("Fame: " + gMonster.getFameText(), gUI.x + gUI.width * 0.05, gUI.y + gUI.height * 0.95);//UI, so it doesn't need a window offset

	//draw the mass
	gContext.textAlign = "right";
	gContext.fillText("Size: " + gMonster.getSizeText(), gUI.x + gUI.width * 0.95, gUI.y + gUI.height * 0.95);
	
	//now draw all of the other UI stuff if necessary
	if (gUI.isOpen())
	{
		gContext.textAlign = "center";
		gContext.fillText("News for \"" + gMonster.name + "\"", gUI.x + gUI.width / 2.0, gUI.y + gUI.height * 0.1);
		
		//after drawing the drawer, draw any achievements that shouldn't be hidden
		for (var i = 0; i < gAchievements.length; i++)
		{
			if (gAchievements[i].done)
			{
				var p = gUI.getAchievementPosition(i);
				gContext.drawImage(gUI.sprites[i],p.x,p.y);
			}
		}
	}
}

function rotateAndPaintImage (image, angleInRad, xflip, positionX, positionY, axisX, axisY)
{
	var s = gWindow.zoom;
	var p = real_to_view(positionX,positionY);
	gContext.translate( p.x , p.y );
	gContext.rotate( angleInRad );
	gContext.scale(xflip ? -s: s, s);
	gContext.drawImage( image, -axisX, -axisY );
	gContext.scale(xflip ? -1/s : 1/s, 1/s);//wanna see something really weird? swap the order of this line and the one below it
	gContext.rotate( -angleInRad );
	gContext.translate( -p.x, -p.y );
}

function clip_angle(angle)
{
	var twopi = Math.PI * 2.0;
	while (angle < 0.0)
		angle += twopi;
	while (angle > twopi)
		angle -= twopi;
	
	return angle;
}

function KeyPressed(e)
{
	if (e.keyCode == 39)
		gKeys[0] = true;
	else if (e.keyCode == 37)
		gKeys[1] = true;
	else if (e.keyCode == 40)
		gKeys[2] = true;
	else if (e.keyCode == 38)
		gKeys[3] = true;
	else if (e.keyCode == 32)
		gKeys[4] = true;
	else if (e.keyCode == 13)
		gKeys[5] = true;
}

function KeyReleased(e)
{
	if (e.keyCode == 39)
		gKeys[0] = false;
	else if (e.keyCode == 37)
		gKeys[1] = false;
	else if (e.keyCode == 40)
		gKeys[2] = false;
	else if (e.keyCode == 38)
		gKeys[3] = false;
	else if (e.keyCode == 32)
	{
		if (!gUI.open || document.getElementById("nameinput").style.display == "none")
			gUI.open = !gUI.open;
		
		//gUIOpen = !gUIOpen && (!gUIOpen || document.getElementById("nameinput").style.display == "none");
		 //&& document.getElementById("nameinput").style.display != "none";
		gKeys[4] = false;
	}
	else if (e.keyCode == 13)
	{
		gKeys[5] = false;
		
		if (gUI.open && document.getElementById("nameinput").style.display == "none")
		{
			document.getElementById("nameinput").style.display = "inline";
			document.getElementById("nameinput").focus();
		}
		else
		{
			document.getElementById("nameinput").style.display = "none";
			gMonster.name = document.getElementById("nameinput").value;
			
			if (gMonster.name == "" || gMonster.name == "?")
				gMonster.name = "?";
			else
				getAchievementByName(gAchievements,"named").done = true;
		}
	}
}

function gameMouseScroll(e)
{
	var delta = e.wheelDelta ? e.wheelDelta/40 : e.detail ? -e.detail : 0;
	if (delta)
	{
		gWindow.zoom += delta;
		if (gWindow.zoom < 0.5)
			gWindow.zoom = 0.5;
		gWindow.width = gWindow.render_width / gWindow.zoom;
		gWindow.height = gWindow.render_height / gWindow.zoom;
	}
}

function gameClick(e) 
{
	var x;
	var y;
	
	if (e.pageX != undefined && e.pageY != undefined)
	{
		x = e.pageX;
		y = e.pageY;
	}
	else 
	{
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	x -= document.getElementById("canvasbox").offsetLeft;
	y -= document.getElementById("canvasbox").offsetTop;
	
	x = Math.max(Math.min(x, gWindow.render_width),0);
	y = Math.max(Math.min(y, gWindow.render_height),0);
	
	hide_tooltip();

	//now that we've figured out exactly where the mouse is, check what we clicked on!
	if (is_between(gUI.x, gUI.x + gUI.width, x) && is_between(gUI.y, gUI.y + gUI.height,y))
	{
		//we clicked in the UI somewhere...
		if (!gUI.isOpen())
			gUI.open = true;
		else
		{
			//if we clicked on the title portion
			if (y < gUI.y + gUI.aVmargin)
			{
				document.getElementById("nameinput").style.display = "inline";
				document.getElementById("nameinput").focus();
			}
			//if we didn't...
			else
			{
				//first off, close the naming dialog if it's up
				document.getElementById("nameinput").style.display = "none";
				gMonster.name = document.getElementById("nameinput").value;
				
				if (gMonster.name == "" || gMonster.name == "?")
					gMonster.name = "?";
				else
					gAchievements.named = true;
				
				//now check if we clicked on one of the achievements
				for (var i = 0; i < gAchievements.length; i++)
				{
					var p = gUI.getAchievementPosition(i);
					if (is_between(p.x,p.x + 200, x) && is_between(p.y, p.y + 50, y))
					{
						if (gAchievements[i].min_fame <= gMonster.fame || gAchievements[i].done)
							display_tooltip(x,y,gAchievements[i].flavor_text);
						else
							display_tooltip(x,y,"?");
						break;
					}
				}
			}
		}
	}
	else
	{
		if (gUI.open)
			gUI.open = false;
	}
}

function gameMouseMove(e)
{
	if (gUI.isOpen())
	{
		var x;
		var y;
		
		if (e.pageX != undefined && e.pageY != undefined)
		{
			x = e.pageX;
			y = e.pageY;
		}
		else 
		{
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		x -= document.getElementById("canvasbox").offsetLeft;
		y -= document.getElementById("canvasbox").offsetTop;
		
		x = Math.max(Math.min(x, gWindow.render_width),0);
		y = Math.max(Math.min(y, gWindow.render_height),0);
		
		hide_tooltip();

		//now check if we are hovering over on one of the achievements
		for (var i = 0; i < gAchievements.length; i++)
		{
			var p = gUI.getAchievementPosition(i);
			if (is_between(p.x,p.x + 200, x) && is_between(p.y, p.y + 50, y))
			{
				if (gAchievements[i].min_fame <= gMonster.fame || gAchievements[i].done)
					display_tooltip(x,y,gAchievements[i].flavor_text);
				else
					display_tooltip(x,y,"?");
				break;
			}
		}
	}
}

function display_tooltip(x,y,text)
{
	var elm = document.getElementById("tooltipDiv");
	elm.style.display = "inline";
	elm.style.left = String(x) + "px";
	elm.style.top = String(y) + "px";
	elm.innerHTML = text;
}

function hide_tooltip()
{
	document.getElementById("tooltipDiv").style.display = "none";
}

function is_between(min,max,val)
{
	return (val >= min && val <= max);
}

function axis_aligned_collision(x1, y1, w1, h1, x2, y2, w2, h2)
{
	return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2);
}

function circle_boat_collision(cx,cy,cr, b)
{
	//first off, rotate the circle by the inverse of the rectangle's rotation
	var st = -Math.sin(-b.sprite_rot);
	var ct = Math.cos(-b.sprite_rot);
	var rcx = (cx - b.x) * ct - (cy - b.y) * st + b.x;
	var rcy = (cx - b.x) * st + (cy - b.y) * ct + b.y;
	var ix = Math.max(b.x - b.ox,Math.min(b.x + b.width  - b.ox,rcx));
	var iy = Math.max(b.y - b.oy,Math.min(b.y + b.height - b.oy,rcy));
	var dx = rcx - ix;
	var dy = rcy - iy;

	return (dx * dx + dy * dy < cr * cr);
}

function real_to_view(x,y)
{
	var r = new vector2(x,y);
	r.x -= gWindow.left;
	r.y -= gWindow.top;
	
	if (x < gWindow.left || x > (gWindow.left + gWindow.width))
	{
		if ((x + kWidth) < (gWindow.left + gWindow.width * 2.0))
			r.x += kWidth;
		else if (x > (gWindow.left - gWindow.width + kWidth))
			r.x -= kWidth;
	}
	
	r.x *= gWindow.zoom;
	r.y *= gWindow.zoom;
	
	return r;
}
