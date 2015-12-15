var paintBucketApp = (function() {
  "use strict";
  var context,
  ctx = new C2S(792,592),
    canvasWidth = 792,
    canvasHeight = 592,
    colorPurple = {
      r: 103,
      g: 53,
      b: 148
    },
    colorGreen = {
      r: 101,
      g: 155,
      b: 65
    },
    colorYellow = {
      r: 255,
      g: 207,
      b: 51
    },
    colorPink = {
      r: 200,
      g: 20,
      b: 30
    },
    colorWhite = {
      r: 255,
      g: 255,
      b: 255
    },
    curColor = colorPurple,
    outlineImage = new Image(),
    swatchImage = new Image(),
    backgroundImage = new Image(),
    swatchStartX = 18,
    swatchStartY = 19,
    swatchImageWidth = 93,
    swatchImageHeight = 46,
    drawingAreaX = 111,
    drawingAreaY = 11,
    drawingAreaWidth = 672,
    drawingAreaHeight = 572,
    colorLayerData,
    outlineLayerData,
    totalLoadResources = 3,
    curLoadResNum = 0,
    // Clears the canvas.
    clearCanvas = function() {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	  ctx.clearRect(0, 0, context.canvas.width, context.canvas.height);
    },
    // Draw a color swatch
    drawColorSwatch = function(color, x, y) {
      context.beginPath();
      context.arc(x + 46, y + 23, 18, 0, Math.PI * 2, true);
      context.closePath();
      context.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b +
        ")";
      context.fill();
	  
	  ctx.beginPath();
	  ctx.arc(x + 46, y + 23, 18, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b +
        ")";
      ctx.fill();
	  
      if (curColor == color) {
        context.drawImage(swatchImage, 0, 0, 59, swatchImageHeight, x, y,
          59, swatchImageHeight);
		
		ctx.drawImage(swatchImage, 0, 0, 59, swatchImageHeight, x, y,
          59, swatchImageHeight);
		  
      } else {
        context.drawImage(swatchImage, x, y, swatchImageWidth,
          swatchImageHeight);
		  
		ctx.drawImage(swatchImage, x, y, swatchImageWidth,
          swatchImageHeight);
		  
      }
    },
    // Draw the elements on the canvas
    redraw = function() {
      var locX,
        locY;
      // Make sure required resources are loaded before redrawing
      if (curLoadResNum < totalLoadResources) {
        return;
      }
      clearCanvas();
      // Draw the current state of the color layer to the canvas
      context.putImageData(colorLayerData, 0, 0);
	  ctx.putImageData(colorLayerData, 0, 0);
	  
      // Draw the background
      context.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
	  ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
	  
      // Draw the color swatches
      locX = 52;
      locY = 19;
      drawColorSwatch(colorPurple, locX, locY);
      locY += 46;
      drawColorSwatch(colorGreen, locX, locY);
      locY += 46;
      drawColorSwatch(colorYellow, locX, locY);
      locY += 46;
      drawColorSwatch(colorPink, locX, locY);
      locY += 46;
      drawColorSwatch(colorWhite, locX, locY);
      // Draw the outline image on top of everything. We could move this to a separate 
      //   canvas so we did not have to redraw this everyime.
      context.drawImage(outlineImage, drawingAreaX, drawingAreaY,
        drawingAreaWidth, drawingAreaHeight);
		
		ctx.drawImage(outlineImage, drawingAreaX, drawingAreaY,
        drawingAreaWidth, drawingAreaHeight);
    },
    matchOutlineColor = function(r, g, b, a) {
      return (r + g + b < 100 && a === 255);
    },
    matchStartColor = function(pixelPos, startR, startG, startB) {
      var r = outlineLayerData.data[pixelPos],
        g = outlineLayerData.data[pixelPos + 1],
        b = outlineLayerData.data[pixelPos + 2],
        a = outlineLayerData.data[pixelPos + 3];
      // If current pixel of the outline image is black
      if (matchOutlineColor(r, g, b, a)) {
        return false;
      }
      r = colorLayerData.data[pixelPos];
      g = colorLayerData.data[pixelPos + 1];
      b = colorLayerData.data[pixelPos + 2];
      // If the current pixel matches the clicked color
      if (r == startR && g == startG && b == startB) {
        return true;
      }
      // If current pixel matches the new color
      if (r == curColor.r && g == curColor.g && b == curColor.b) {
        return false;
      }
      return true;
    },
    colorPixel = function(pixelPos, r, g, b, a) {
      colorLayerData.data[pixelPos] = r;
      colorLayerData.data[pixelPos + 1] = g;
      colorLayerData.data[pixelPos + 2] = b;
      colorLayerData.data[pixelPos + 3] = a !== undefined ? a : 255;
    },
    floodFill = function(startX, startY, startR, startG, startB) {
      var newPos,
        x,
        y,
        pixelPos,
        reachLeft,
        reachRight,
        drawingBoundLeft = drawingAreaX,
        drawingBoundTop = drawingAreaY,
        drawingBoundRight = drawingAreaX + drawingAreaWidth - 1,
        drawingBoundBottom = drawingAreaY + drawingAreaHeight - 1,
        pixelStack = [
          [startX, startY]
        ];
      while (pixelStack.length) {
        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];
        // Get current pixel position
        pixelPos = (y * canvasWidth + x) * 4;
        // Go up as long as the color matches and are inside the canvas
        while (y >= drawingBoundTop && matchStartColor(pixelPos, startR,
            startG, startB)) {
          y -= 1;
          pixelPos -= canvasWidth * 4;
        }
        pixelPos += canvasWidth * 4;
        y += 1;
        reachLeft = false;
        reachRight = false;
        // Go down as long as the color matches and in inside the canvas
        while (y <= drawingBoundBottom && matchStartColor(pixelPos, startR,
            startG, startB)) {
          y += 1;
          colorPixel(pixelPos, curColor.r, curColor.g, curColor.b);
          if (x > drawingBoundLeft) {
            if (matchStartColor(pixelPos - 4, startR, startG, startB)) {
              if (!reachLeft) {
                // Add pixel to stack
                pixelStack.push([x - 1, y]);
                reachLeft = true;
              }
            } else if (reachLeft) {
              reachLeft = false;
            }
          }
          if (x < drawingBoundRight) {
            if (matchStartColor(pixelPos + 4, startR, startG, startB)) {
              if (!reachRight) {
                // Add pixel to stack
                pixelStack.push([x + 1, y]);
                reachRight = true;
              }
            } else if (reachRight) {
              reachRight = false;
            }
          }
          pixelPos += canvasWidth * 4;
        }
      }
    },
    // Start painting with paint bucket tool starting from pixel specified by startX and startY
    paintAt = function(startX, startY) {
      var pixelPos = (startY * canvasWidth + startX) * 4,
        r = colorLayerData.data[pixelPos],
        g = colorLayerData.data[pixelPos + 1],
        b = colorLayerData.data[pixelPos + 2],
        a = colorLayerData.data[pixelPos + 3];
      if (r == curColor.r && g == curColor.g && b == curColor.b) {
        // Return because trying to fill with the same color
        return;
      }
      if (matchOutlineColor(r, g, b, a)) {
        // Return because clicked outline
        return;
      }
      floodFill(startX, startY, r, g, b);
      redraw();
    },
    // Add mouse event listeners to the canvas
    createMouseEvents = function() {
      $('#canvas').mousedown(function(e) {
        // Mouse down location
        var mouseX = e.pageX - this.offsetLeft,
          mouseY = e.pageY - this.offsetTop;
        if (mouseX < drawingAreaX) { // Left of the drawing area
          if (mouseX > swatchStartX) {
            if (mouseY > swatchStartY && mouseY < swatchStartY +
              swatchImageHeight) {
              curColor = colorPurple;
              redraw();
            } else if (mouseY > swatchStartY + swatchImageHeight &&
              mouseY < swatchStartY + swatchImageHeight * 2) {
              curColor = colorGreen;
              redraw();
            } else if (mouseY > swatchStartY + swatchImageHeight * 2 &&
              mouseY < swatchStartY + swatchImageHeight * 3) {
              curColor = colorYellow;
              redraw();
            } else if (mouseY > swatchStartY + swatchImageHeight * 3 &&
              mouseY < swatchStartY + swatchImageHeight * 4) {
              curColor = colorPink;
              redraw();
            } else if (mouseY > swatchStartY + swatchImageHeight * 4 &&
              mouseY < swatchStartY + swatchImageHeight * 5) {
              curColor = colorWhite;
              redraw();
            }
          }
        } else if ((mouseY > drawingAreaY && mouseY < drawingAreaY +
            drawingAreaHeight) && (mouseX <= drawingAreaX +
            drawingAreaWidth)) {
          // Mouse click location on drawing area
          paintAt(mouseX, mouseY);
        }
      });
    },
    // Calls the redraw function after all neccessary resources are loaded.
    resourceLoaded = function() {
      
      curLoadResNum += 1;
      if (curLoadResNum == totalLoadResources) {
        createMouseEvents();
        redraw();
      }
    },
	
	loadimage1= function()
{
outlineImage.src ="image/v1.png";

},
loadimage2=function()
{
outlineImage.src ="image/v2.png";

},

loadimage21=function()
{
outlineImage.src ="image/v4.png";

},

 loadimage3=function()
{
outlineImage.src ="image/diagram.png";

},

	
	
    // Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
    init = function(image) {
	 
	  switch(image)
	  {
	  case 'A':
		loadimage1();
		break;
		case 'B':
		loadimage2();
		break;
		case 'C':
		loadimage3();
		break;
		case 'D':
		loadimage21();
		break;
	 }
      // Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
      var canvas = document.createElement('canvas');
      canvas.setAttribute('width', canvasWidth);
      canvas.setAttribute('height', canvasHeight);
      canvas.setAttribute('id', 'canvas');
	  canvas.setAttribute('style','z-index: 1; position:; left:200px;top:100px; border:1px solid #d3d3d3;');
      document.getElementById('canvasdiv').appendChild(canvas);
      if (typeof G_vmlCanvasManager != "undefined") {
        canvas = G_vmlCanvasManager.initElement(canvas);
      }
      context = canvas.getContext("2d"); // Grab the 2d canvas context
	 
	 
      // Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
      //     context = document.getElementById('canvas').getContext("2d");
      // Load images
      backgroundImage.onload = resourceLoaded;
      backgroundImage.src = "image/background-max.png";
      swatchImage.onload = resourceLoaded;
      swatchImage.src = "image/paint-outline.png";
      outlineImage.onload = function() {
        context.drawImage(outlineImage, drawingAreaX, drawingAreaY,
          drawingAreaWidth, drawingAreaHeight);
		  ctx.drawImage(outlineImage, drawingAreaX, drawingAreaY,
          drawingAreaWidth, drawingAreaHeight);
		  
        // Test for cross origin security error (SECURITY_ERR: DOM Exception 18)
        try {
          outlineLayerData = context.getImageData(0, 0, canvasWidth,
            canvasHeight);
         
        } catch (ex) {
          window.alert(
            "Application cannot be run locally. Please run on a server."
          );
          return;
        }
        clearCanvas();
		
        colorLayerData = context.getImageData(0, 0, canvasWidth,
          canvasHeight);
        resourceLoaded();
      };
	 
	 
    };
	
	
  return {
    init: init
  };
}());

