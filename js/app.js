var START_X = 200;
var START_Y = 400;
var bugSprite = 'images/enemy-bug.png';
var playerSprite = 'images/char-boy.png';

//enemy specific values
var collisionOffset = 55;
var enemyRowValues = [230, 145, 60];

var RandomNumber = function(min, max)
{
    if(min === 0 )
        max++;
    return Math.floor((Math.random() * max) + min);
}

var GameObject = function(spriteFile, x, y, column, row)
{
    this.sprite = spriteFile;
    this.x  =  x;
    this.y =  y;
    this.column = column; // one based
    this.row = row; // one based
}

GameObject.prototype.update = function(dt){}
GameObject.prototype.render = function()
{
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Enemy = function(speed, row) 
{
    GameObject.call(this, bugSprite, 0, enemyRowValues[row - 3], 1, row);
    this.speed = speed;
}

Enemy.prototype = Object.create(GameObject.prototype);
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) 
{
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x > 500)
    {
        var randomRow = RandomNumber(0,2);
        this.x = 1;
        this.row = randomRow + 3;
        this.y = enemyRowValues[randomRow];
        this.speed = RandomNumber(1,5);
    }
    else
    {
        this.x = (this.x + this.speed);
    }
    this.updateColumnValue();
}
Enemy.prototype.updateColumnValue = function()
{
    if(this.x + collisionOffset < 101)
        this.column = 1;
    else if(this.x + collisionOffset >= 101 && this.x + collisionOffset < 202)
        this.column = 2;
    else if(this.x  + collisionOffset >= 201 && this.x + collisionOffset  < 303)
        this.column = 3;
    else if(this.x + collisionOffset >= 303 && this.x + collisionOffset  < 404)
        this.column = 4;
    else
    {
        this.column = 5;
    }
}



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function()
{
    GameObject.call(this, playerSprite, START_X, START_Y, 3, 1);
}
Player.prototype = Object.create(GameObject.prototype);
Player.prototype.update = function()
{
    this.handleColisions();
}
Player.prototype.handleInput = function(keyCode)
{
    switch(keyCode) {
        case "up":
            if(this.y > 60)
            {
                this.y -= 85;
                this.row++;
            }
            else
            {
                this.y = START_Y;
                this.x = START_X;
                this.column = 3;
                this.row = 1;
            }
            break;
        case "down":
            if(this.y < 400)
            {
                this.y += 85;
                this.row--;
            }
            break;
        case "left":
            if(this.x > 0)
            {
                this.x -= 100;
                this.column--;
            }
            break;
        case "right":
            if(this.x < 400)
            {
                this.x += 100;
                this.column++;
            }
            break;
        default:
            break;
    }
}
Player.prototype.handleColisions = function()
{
    for(i = 0; i < allEnemies.length; i++)
    {
        if(player.column === allEnemies[i].column && player.row === allEnemies[i].row)
        {
            player.x = START_X;
            player.y = START_Y;
            player.column = 3;
            player.row = 1;
        }
    }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for(i = 0;  i < 5; i++)
{
    allEnemies.push(new Enemy(RandomNumber(2,8),i+3));
}
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    e.preventDefault();
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

document.addEventListener('keydown', function(e) {
    e.preventDefault();
});