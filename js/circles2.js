(function(window) {

//coded by Ayola Jayamaha
// holds all  circles
var circles2 = []; 

var selectionHandles = [];

// Hold canvas information
var canvas;
var ctx;
var WIDTH;
var HEIGHT;
var INTERVAL = 20; 

var isDrag = false;
var isResizeDrag = false;
var expectResize = -1;
var mx, my; // mouse coordinates

var circle; //if circle is selected

var canvasValid = false;

var mySel = null;

var mySelColor = 'black';
var mySelWidth = 2;
var mySelBoxColor = 'black';
var mySelBoxSize = 6;

var ghostcanvas;
var gctx; // fake canvas context

var offsetx, offsety;

// Padding and border style widths for mouse offsets
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;



function Circle2() {
  this.x = 50;
  this.y = 100;
  this.r = 30; 
  
 
}

// New methods on the Box class
Circle2.prototype = {

  draw: function(context, optionalColor) 
  {
      if (context == gctx) {
        context.fillStyle = 'black'; 
      } else {
        context.fillStyle = this.fill;
      }
      

      if (this.x > WIDTH || this.y > HEIGHT) return; 
     if (this.x - this.r < 0 || this.y - this.r < 0) return;
      
      // draw the boxes      
      var half = this.r;
      
//        3 
//      0   1
//        2

      selectionHandles[0].x = this.x-half;
      selectionHandles[0].y = this.y;
      
      selectionHandles[1].x = this.x+half;
      selectionHandles[1].y = this.y;
      
      selectionHandles[2].x = this.x;
      selectionHandles[2].y = this.y-half;
      
      
      selectionHandles[3].x = this.x;
      selectionHandles[3].y = this.y+half;
      
      
      

      
      for (var i = 0; i < 4; i ++)
       {
        var cur = selectionHandles[i];
        context.beginPath();
        context.lineWidth="2";
        context.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
        context.strokeStyle = 'black';

        
      }
    
      context.beginPath();
        context.lineWidth="2";
        context.arc(this.x, this.y, this.r,0,2*Math.PI,true);
        context.strokeStyle = 'black';
        context.closePath();
        context.stroke();
    
  } // end draw

}

//Initialize a new Circle, add it, and invalidate the canvas
function addCircle(x, y, r) {
  var cir = new Circle2();
  cir.x = x;
  cir.y = y;
  cir.r = r;
  
  circles2.push(cir);
  invalidate();
}

// initialize our canvas, add a ghost canvas, set draw loop
// then add everything we want to intially exist on the canvas
function init3() {
  canvas = document.getElementById('canvas2');
  HEIGHT = canvas.height;
  WIDTH = canvas.width;
  ctx = canvas.getContext('2d');
  ghostcanvas = document.createElement('canvas');
  ghostcanvas.height = HEIGHT;
  ghostcanvas.width = WIDTH;
  gctx = ghostcanvas.getContext('2d');
  
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.onselectstart = function () { return false; }
  
  // fixes mouse co-ordinate problems when there's a border or padding
  // see getMouse for more detail
  if (document.defaultView && document.defaultView.getComputedStyle) 
  {
    stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)     || 0;
    stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)      || 0;
    styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
    styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)  || 0;
  }
  
  // make mainDraw() fire every INTERVAL milliseconds
  setInterval(this.mainDraw3, INTERVAL);
  
  // set our events. Up and down are for dragging,
  // double click is for making new boxes
  canvas.onmousedown = myDown;
  canvas.onmouseup = myUp;
  canvas.ondblclick = myDblClick;
  canvas.onmousemove = myMove;
  
  // set up the selection handle boxes
  for (var i = 0; i < 4; i ++) {
    var cir = new Circle2;
    selectionHandles.push(cir);
  }
  

}


//wipes the canvas context
function clear(c) {
  c.clearRect(0, 0, WIDTH, HEIGHT);
}

// Main draw loop.
// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
function mainDraw3() {
  if (canvasValid == false) {
    clear(ctx);
    
    // Add stuff you want drawn in the background all the time here
    
    // draw all circles
   
    for (var i = 0; i < circles2.length; i++) {
      circles2[i].draw(ctx); // we used to call drawshape, but now each box draws itself
    }
    
    // Add stuff you want drawn on top all the time here
    
    canvasValid = true;
  }
}

// Happens when the mouse is moving inside the canvas
function myMove(e){
  if (isDrag){
    getMouse(e);
    
    mySel.x = mx - offsetx;
    mySel.y = my - offsety;   
    
    // something is changing position so we better invalidate the canvas!
    invalidate();
  } else if (isResizeDrag) {
    // time ro resize!
    var oldx = mySel.x;
    var oldy = mySel.y;
    
    // 0  1  2
    // 3     4
    // 5  6  7
    switch (expectResize) {
      case 0:
        mySel.x = mx;
        mySel.y = my;
        mySel.w += oldx - mx;
        mySel.h += oldy - my;
        break;
      case 1:
        mySel.y = my;
        mySel.h += oldy - my;
        break;
      case 2:
        mySel.y = my;
        mySel.w = mx - oldx;
        mySel.h += oldy - my;
        break;
      case 3:
        mySel.x = mx;
        mySel.w += oldx - mx;
        break;
      case 4:
        mySel.w = mx - oldx;
        break;
      case 5:
        mySel.x = mx;
        mySel.w += oldx - mx;
        mySel.h = my - oldy;
        break;
      case 6:
        mySel.h = my - oldy;
        break;
      case 7:
        mySel.w = mx - oldx;
        mySel.h = my - oldy;
        break;
    }
    
    invalidate();
  }
  
  getMouse(e);
  // if there's a selection see if we grabbed one of the selection handles
  if (mySel !== null && !isResizeDrag) {
    for (var i = 0; i < 4; i++) {
      // 0  1  2
      // 3     4
      // 5  6  7
      
      var cur = selectionHandles[i];
      
      // we dont need to use the ghost context because
      // selection handles will always be rectangles
      if (mx >= cur.x && mx <= cur.x + mySelBoxSize &&
          my >= cur.y && my <= cur.y + mySelBoxSize) {
        // we found one!
        expectResize = i;
        invalidate();
        
        switch (i) {
          case 0:
            this.style.cursor='n-resize';
            break;
          case 1:
            this.style.cursor='s-resize';
            break;
          case 2:
            this.style.cursor='e-resize';
            break;
          case 3:
            this.style.cursor='w-resize';
            break;
          
          
        }
        return;
      }
      
    }
    // not over a selection box, return to normal
    isResizeDrag = false;
    expectResize = -1;
    this.style.cursor='auto';
  }
  
}

// Happens when the mouse is clicked in the canvas
function myDown(e)
{
  getMouse(e);
  
  //we are over a selection box
  if (expectResize !== -1) 
  {
    isResizeDrag = true;
    return;
  }
  
  clear(gctx);
  var l = circles2.length;
  for (var i = l-1; i >= 0; i--) {
    // draw shape onto ghost context
    circles2[i].draw(gctx, 'black');
    
    // get image data at the mouse x,y pixel
    var imageData = gctx.getImageData(mx, my, 1, 1);
    var index = (mx + my * imageData.width) * 4;
    
    // if the mouse pixel exists, select and break
    if (imageData.data[3] > 0) {
      mySel = circles2[i];
      offsetx = mx - mySel.x;
      offsety = my - mySel.y;
      mySel.x = mx - offsetx;
      mySel.y = my - offsety;
      isDrag = true;
      
      invalidate();
      clear(gctx);
      return;
    }
    
  }
  // havent returned means we have selected nothing
  mySel = null;
  // clear the ghost canvas for next time
  clear(gctx);
  // invalidate because we might need the selection border to disappear
  invalidate();
}

function myUp(e){

  if(circle=true)
  {
    
    addCircle(60,120,50);
  }
  isDrag = false;
  isResizeDrag = false;
  expectResize = -1;

}

// adds a new node
function myDblClick(e) {
  }



function invalidate() {
  canvasValid = false;
}

// Sets mx,my to the mouse position relative to the canvas
// unfortunately this can be tricky, we have to worry about padding and borders
function getMouse(e) {
      var element = canvas, offsetX = 0, offsetY = 0;

      if (element.offsetParent) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
      }

      // Add padding and border style widths to offset
      offsetX += stylePaddingLeft;
      offsetY += stylePaddingTop;

      offsetX += styleBorderLeft;
      offsetY += styleBorderTop;

      mx = e.pageX - offsetX;
      my = e.pageY - offsetY
}



$('#pickCircle').click(function(){
circle=true;

});


window.init3 = init3;
})(window);

