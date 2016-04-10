/*!
 *
 * by Ayola Jayamaha
 * Date: 2016-04-10
 */
 
 function drawBoard() {
    var canvas = document.getElementById("canvas");
    var p = 0;
    //size of canvas
    var bw = 800,
        bh = 500;
    var cw = bw + (p * 2) + 1;
    var ch = bh + (p * 2) + 1;
    var context = canvas.getContext("2d");
    context.beginPath();
    for (var x = 0; x <= bw; x += 50) {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bh + p);
    }


    for (var x = 0; x <= bh; x += 50) {
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(bw + p, 0.5 + x + p);
    }

    context.strokeStyle = "blue";
    context.stroke();
}


function compass() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        //arc(center cordinates,radius,start angle,end angle,anticlockvise)
        var x = document.getElementById('x').value;
        var y = document.getElementById('y').value;
        var radius = document.getElementById('radius').value;
        var startAngle = document.getElementById('sa').value;
        var endAngle = document.getElementById('ea').value;
        var counterClockwise = false;
        if (document.getElementById('rotation1').checked) {
            var counterClockwise = document.getElementById('rotation1').value;
        }
        var clc = document.getElementById('clc').value;
        ctx.beginPath();
        startAngle = startAngle * Math.PI / 180;
        endAngle = endAngle * Math.PI / 180;
        ctx.strokeStyle = clc;
        ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);
        ctx.stroke();
    }
}

function ruler() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");


        var x1 = document.getElementById('x1').value;
        var y1 = document.getElementById('y1').value;
        var x2 = document.getElementById('x2').value;
        var y2 = document.getElementById('y2').value;
        var e1 = document.getElementById('e1').value;
        var e2 = document.getElementById('e2').value;

        var rcolor = document.getElementById('clr').value;
        ctx.strokeStyle = rcolor;
        if (e1 > 0) {
            var m0 = (y1 - y2) / (x1 - x2);
            var x0 = x1 - (e1 / Math.sqrt(m0 * m0 + 1));
            var test = (y1 - y2) / (x1 - x2) * (x0 - x1);
            if (test < 0)
                var y0 = y1 - Math.abs(test);
            else
                var y0 = y1 + Math.abs(test);


            x1 = x0;
            y1 = y0;

        }

        if (e2 > 0) {
            var m1 = (y1 - y2) / (x1 - x2);
            var x3 = x2 + (e2 / Math.sqrt(m1 * m1 + 1));

            var ext = m1 * (x3 - x2);
            if (ext > 0)
                var y3 = y2 + Math.abs(ext);
            else
                var y3 = y2 - Math.abs(ext);

            x2 = x3;
            y2 = y3;
            window.alert(m1);
            window.alert(ext);
            window.alert(x1);

            window.alert(x2);
            window.alert(y1);
            window.alert(y2)
        }
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

function label() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        var x = document.getElementById('xx').value;
        var y = document.getElementById('yx').value;
        var text = document.getElementById('txt').value;
        ctx.font = "11px Arial";
        ctx.fillText(text, x, y);
    }
}

function writeMessage(canvas, message) {
    var context = canvas.getContext('2d');
    context.clearRect(canvas.width - 198, 0, canvas.width, canvas.height - 451);
    context.font = '12pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, canvas.width - 190, 25);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function Shape(x, y, w, h, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.fill = fill || '#AAAAAA';
}

// Draws this shape to a given context
Shape.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}

function CanvasState(canvas) {

    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');



    // **** Keep track of state! ****

    this.valid = false; // when set to true, the canvas will redraw everything
    this.shapes = []; // the collection of things to be drawn
    this.dragging = false; // Keep track of when we are dragging
    // the current selected object.
    // In the future we could turn this into an array for multiple selection
    this.selection = null;
    this.dragoffx = 0;
    this.dragoffy = 0;

    var myState = this;

    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    }, false);
    // Up, down, and move are for dragging
    canvas.addEventListener('mousedown', function(e) {
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var shapes = myState.shapes;
        var l = shapes.length;
        for (var i = l - 1; i >= 0; i--) {
            if (shapes[i].contains(mx, my)) {
                var mySel = shapes[i];
                // Keep track of where in the object we clicked
                // so we can move it smoothly (see mousemove)
                myState.dragoffx = mx - mySel.x;
                myState.dragoffy = my - mySel.y;
                myState.dragging = true;
                myState.selection = mySel;
                myState.valid = false;
                return;
            }
        }
        // havent returned means we have failed to select anything.
        // If there was an object selected, we deselect it
        if (myState.selection) {
            myState.selection = null;
            myState.valid = false; // Need to clear the old selection border
        }
    }, true);
    canvas.addEventListener('mousemove', function(e) {
        if (myState.dragging) {
            var mouse = myState.getMouse(e);
            // We don't want to drag the object by its top-left corner, we want to drag it
            // from where we clicked. Thats why we saved the offset and use it here
            myState.selection.x = mouse.x - myState.dragoffx;
            myState.selection.y = mouse.y - myState.dragoffy;
            myState.valid = false; // Something's dragging so we must redraw
        }
    }, true);
    canvas.addEventListener('mouseup', function(e) {
        myState.dragging = false;
    }, true);
    // double click for making new shapes
    canvas.addEventListener('dblclick', function(e) {
        var mouse = myState.getMouse(e);
        myState.addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
    }, true);

    // **** Options! ****

    this.selectionColor = '#CC0000';
    this.selectionWidth = 2;
    this.interval = 30;
    setInterval(function() {
        myState.draw();
    }, myState.interval);
}

CanvasState.prototype.addShape = function(shape) {
    this.shapes.push(shape);
    this.valid = false;
}

CanvasState.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
        // if our state is invalid, redraw and validate!
        if (!this.valid) {
            var ctx = this.ctx;
            var shapes = this.shapes;
            this.clear();


            //showing divs
            $(document).ready(function() {
                $("#hideRuler").click(function() {
                    console.log('hide');
                    $("#ruler").hide();
                    $("#showRuler").show();
                    $("#hideRuler").hide();
                });
                $("#hideSRuler").click(function() {
                    console.log('hide');
                    $("#ruler").hide();
                    $("#showRuler").show();
                    $("#hideRuler").hide();
                });

                $("#showRuler").click(function() {
                    console.log('show');
                    $("#ruler").show();
                    $("#hideRuler").show();
                    $("#showRuler").hide();
                });

                //Label
                $("#hideLabel").click(function() {
                    console.log('hide');
                    $("#label").hide();
                    $("#showLabel").show();
                    $("#hideLabel").hide();
                });
                $("#hideSLabel").click(function() {
                    console.log('hide');
                    $("#label").hide();
                    $("#showLabel").show();
                    $("#hideLabel").hide();
                });

                $("#showLabel").click(function() {
                    console.log('show');
                    $("#label").show();
                    $("#hideLabel").show();
                    $("#showLabel").hide();
                });


                //compass
                $("#hideCompass").click(function() {
                    console.log('hide');
                    $("#compass").hide();
                    $("#showCompass").show();
                    $("#hideCompass").hide();
                });
                $("#hideSCompass").click(function() {
                    console.log('hide');
                    $("#compass").hide();
                    $("#showCompass").show();
                    $("#hideCompass").hide();
                });

                $("#showCompass").click(function() {
                    console.log('show');
                    $("#compass").show();
                    $("#hideCompass").show();
                    $("#showCompass").hide();
                });

            });