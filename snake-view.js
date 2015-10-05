(function (){
  if (typeof Game === 'undefined') {
    var Game = window.Game = {};
  }

  var LOSE_MESSAGES = ["Don't reach, young blood.",
  "Too easy out here against these young bloods.",
  "These hippidy hop young bloods just don't practice the fundamentals."
  ];

  var View = window.Game.View = function(board, $el) {
    this.$el = $el;
    this.board = board;
    $(window).on("keydown", this.handleKeyEvent.bind(this));
    setInterval(this.step.bind(this), 50);
  };

  View.prototype.step = function () {
    this.board.snake.move();
    this.$el.html("<pre>" + this.board.render() + "</pre>");
  };

  View.prototype.handleKeyEvent = function (e) {
    e.preventDefault();
    var key = e.keyCode;

    if (key === 38) {
      this.board.snake.turn([-1,0]);
    } else if (key === 40) {
      this.board.snake.turn([1,0]);
    } else if (key === 37) {
      this.board.snake.turn([0,-1]);
    } else if (key === 39) {
      this.board.snake.turn([0,1]);
    }
  };

  function Snake(board) {
    this.dir = [0, -1];
    this.segments = [[5,4]];
    this.justLeft = [0,0];
    this.board = board;
  }

  Snake.prototype.addTwoCoords = function (coord1, coord2) {
    var length1 = parseInt(coord1[0])+ parseInt(coord2[0]);
    var length2 = parseInt(coord1[1])+ parseInt(coord2[1]);
    return [[(length1 + 18) % 18], [(length2 + 18) % 18]];
  };

  Snake.prototype.equals = function (coord1, coord2) {
    return coord1[0]===coord2[0] && coord1[1] === coord2[1];
  };

  Snake.prototype.move = function () {
    var that = this;
    this.segments.unshift(this.addTwoCoords(this.segments[0], that.dir));
    this.justLeft = this.segments.pop();
    this.handleGame();
  };



  Snake.prototype.handleGame = function () {
    if (this.board.grid[this.segments[0][0]]
      [this.segments[0][1]] === "<div class='apple'></div>") {
      this.segments.push(this.justLeft);
      this.segments.push(this.justLeft);
      this.board.placeApple();
    } else if (this.board.grid[this.segments[0][0]]
      [this.segments[0][1]] === "<div class='snake'></div>") {
        alert(LOSE_MESSAGES[Math.floor(Math.random()*3)]);
        location.reload();
    } else if (this.segments.length === 30) {
      alert("Basketball isn't a game; It's an art form. " +
      "You can master the fundamentals so you can forget 'em, " +
      "so you can improvise and just concentrate on what really matters; " +
      "getting buckets. ");
      location.reload();
    }
  };


  Snake.prototype.turn = function (dir) {
    this.dir = dir;
  };

  var Board = window.Game.Board = function() {
    this.grid = [];
    this.snake = new Snake(this);
    this.setupBoard();
    this.render();
  };

  Board.prototype.setupBoard = function () {
    var that = this;

    for (var i = 0; i < 18; i++) {
      that.grid.push([]);
      for (var j = 0; j < 18; j++) {
        that.grid[i].push("<div class='empty'></div>");
      }
    }
    this.placeApple();
  };

  Board.prototype.placeApple = function () {
    var randomCoord = [Math.floor(Math.random()*18), Math.floor(Math.random()*18)];
    while (this.grid[randomCoord[0]]
      [randomCoord[1]] !== "<div class='empty'></div>") {
        randomCoord = [Math.floor(Math.random()*18), Math.floor(Math.random()*18)];
      }
    this.grid[randomCoord[0]][randomCoord[1]] = "<div class='apple'></div>";
  };
  Board.prototype.render = function () {
    var that = this;

    this.snake.segments.forEach(function(el) {
      that.grid[el[0]][el[1]] = "<div class='snake'></div>";
    });

    this.grid[this.snake.justLeft[0]][this.snake.justLeft[1]] = "<div class='empty'></div>";

    return this.grid.map(function(el){
      return el.join('');
    }).join('\n');
  };

})();
