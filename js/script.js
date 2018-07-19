var PONGVADERS = {
    // set up some initial values
    WIDTH: 320, 
    HEIGHT:  480, 
    scale: 1,
    offset: { top: 0, left: 0 }, //position of the canvas in relation to the screen
    entities: [], //store all particles, touches, bubbles, etc
    nextPowerUp: 100, //amount of gamet icks until new power up
    score: {
        points: 0,
        enemiesKilled: 0
    },
    RATIO:  null,
    currentWidth:  null,
    currentHeight:  null,
    canvas: null,
    ctx:  null,
    ua: null,
    android: null,
    ios: null,

    init: function() {

        // the proportion of width to height (should try to maintain 2:3)
        PONGVADERS.RATIO = PONGVADERS.WIDTH / PONGVADERS.HEIGHT;
        // these will change when the screen is resized
        PONGVADERS.currentWidth = PONGVADERS.WIDTH;
        PONGVADERS.currentHeight = PONGVADERS.HEIGHT;
        // this is our canvas element
        PONGVADERS.canvas = document.getElementsByTagName('canvas')[0];
        // setting this is important
        // otherwise the browser will
        // default to 320 x 200
        PONGVADERS.canvas.width = PONGVADERS.WIDTH;
        PONGVADERS.canvas.height = PONGVADERS.HEIGHT;
        // the canvas context enables us to 
        // interact with the canvas api
        PONGVADERS.ctx = PONGVADERS.canvas.getContext('2d');

        PONGVADERS.ua = navigator.userAgent.toLowerCase();
        PONGVADERS.android = PONGVADERS.ua.indexOf('android') > -1 ? true : false;
        PONGVADERS.ios = ( PONGVADERS.ua.indexOf('iphone') > -1 || PONGVADERS.ua.indexOf('ipad') > -1 ) ? true : false;
        // we're ready to resize
        PONGVADERS.resize();

    },

    resize: function() {

        // PONGVADERS.currentHeight = window.innerHeight;
        // // resize the width in proportion
        // // to the new height
        // PONGVADERS.currentWidth = PONGVADERS.currentHeight * PONGVADERS.RATIO;

        // // this will create some extra space on the
        // // page, allowing us to scroll past
        // // the address bar, thus hiding it.
        // if (PONGVADERS.android || PONGVADERS.ios) {
        //     document.body.style.height = (window.innerHeight + 50) + 'px';
        // }

        // // set the new canvas style width and height
        // // note: our canvas is still 320 x 480, but
        // // we're essentially scaling it with CSS
        // PONGVADERS.canvas.style.width = PONGVADERS.currentWidth + 'px';
        // PONGVADERS.canvas.style.height = PONGVADERS.currentHeight + 'px';

        // // we use a timeout here because some mobile
        // // browsers don't fire if there is not
        // // a short delay
        // window.setTimeout(function() {
        //         window.scrollTo(0,1);
        // }, 1);
    }

};

var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback ) {
        window.setTimeout(callback, 1000/60)
    };

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}
Paddle.prototype.render = function() {
    PONGVADERS.ctx.fillStyle = "#0000FF";
    PONGVADERS.ctx.fillRect(this.x, this.y, this.width, this.height);
};
Paddle.prototype.move = function(x,y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if(this.x < 0) {
        this.x = 0;
        this.x_speed = 0;
    } else if(this.x + this.width > 320) {
        this.x = 320 - this.width;
        this.x_speed = 0;
    }
}
function Player() {
    this.paddle = new Paddle(135, 460, 50, 10);
}
Player.prototype.render = function() {
    this.paddle.render();
}
Player.prototype.update = function() {
    for(var key in keysDown) {
        var value = Number(key);
        if(value == 37) {
            this.paddle.move(-3,0);
        } else if (value == 39) {
            this.paddle.move(3,0);
        } else {
            this.paddle.move(0,0);
        }
    }
}

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 2;
    this.radius = 5;
}
Ball.prototype.render = function() {
    PONGVADERS.ctx.beginPath();
    PONGVADERS.ctx.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    PONGVADERS.ctx.fillStyle = "#000000";
    PONGVADERS.ctx.fill();
};
var update = function() {
    player.update();
    ball.update(player.paddle);
};

Ball.prototype.update = function(paddle1) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    if(this.x - 5 < 0) {
        this.x = 5;
        this.x_speed = -this.x_speed;
    }else if(this.x + 5 > 320) {
        this.x = 315;
        this.x_speed = -this.x_speed;
    }

    // if(this.y < 0 || this.y > 600) {
    //     this.x_speed = 0;
    //     this.y_speed = 2;
    //     this.x = 200;
    //     this.y = 300;
    // }
    if(this.y < 0 || this.y > 480) {
        this.y_speed = -this.y_speed;
    }
    if(top_y > 240) {
        if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = -2;
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
    }
};
var player = new Player();
var ball = new Ball(160, 260);
var keysDown = {};

var step = function() {
    update();
    render();
    animate(step);
};

var render = function() {
    PONGVADERS.ctx.fillStyle = "#FF00FF";
    PONGVADERS.ctx.fillRect(0, 0, PONGVADERS.currentWidth, PONGVADERS.currentHeight);
    player.render();
    ball.render();
};



window.onload = function() {
    animate(step);
}
window.addEventListener('load', PONGVADERS.init, false);
window.addEventListener('resize', PONGVADERS.resize, false);
window.addEventListener('keydown', function(event){
    keysDown[event.keyCode] = true;
});
window.addEventListener('keyup', function(event){
    delete keysDown[event.keyCode];
});