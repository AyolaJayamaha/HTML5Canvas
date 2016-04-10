/*!
 * Tool contains canvas2 and context2
 * functions
 *
 * by Ayola Jayamaha
 * Date: 2016-04-10
 */

 var canvas2 = document.getElementById('canvas2');
var context2 = canvas2.getContext('2d');
var selectedItem = '';
var selectedMethod = '';


$('#pickCircle').click(function() {
    selectedMethod = 'c';
    selectedItem = 'r';

});

$('#pickSquare').click(function() {
    selectedMethod = 's';
    selectedItem = 's';

});

$('#pickLine').click(function() {
    selectedMethod = 'l';
    selectedItem = 'l';

});



canvas2.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas2, evt);

    switch (selectedMethod) {
        case 'c':

            switch (selectedItem) {
                case 'r':
                    r.x = mousePos.x;
                    r.y = mousePos.y;

                    context2.beginPath();
                    context2.arc(r.x, r.y, 3, 0, 360, false);
                    context2.fillStyle = 'black';
                    context2.fill();
                    context2.stroke();

                    selectedItem = 'q';
                    break;
                case 'q':
                    q.x = mousePos.x;
                    q.y = mousePos.y;
                    var diffx = r.x - q.x;
                    var diffy = r.y - q.y;

                    context2.beginPath();
                    context2.arc(q.x, q.y, 3, 0, 360, false);
                    context2.fillStyle = 'black';
                    context2.fill();
                    context2.stroke();

                    var radius2 = Math.sqrt((diffx * diffx) + (diffy * diffy));
                    context2.beginPath();
                    context2.arc(r.x, r.y, radius2, 0, 360, false);
                    context2.stroke();
                    selectedItem = 'r';
                    break;
            }

            break;

        case 's':

            switch (selectedItem) {
                case 's':
                    s.x = mousePos.x;
                    s.y = mousePos.y;

                    context2.beginPath();
                    context2.arc(s.x, s.y, 3, 0, 360, false);
                    context2.fillStyle = 'black';
                    context2.fill();
                    context2.stroke();
                    selectedItem = 't';
                    break;
                case 't':
                    t.x = mousePos.x;
                    t.y = mousePos.y;

                    context2.beginPath();
                    context2.arc(t.x, t.y, 3, 0, 360, false);
                    context2.fillStyle = 'black';
                    context2.fill();
                    context2.stroke();


                    context2.beginPath();
                    context2.rect(s.x, s.y, Math.abs(t.x - s.x), Math.abs(t.y - s.y));
                    context2.stroke();
                    selectedItem = 's';
                    break;
            }

            break;

        case 'l':
            switch (selectedItem) {
                case 'l':
                    l.x = mousePos.x;
                    l.y = mousePos.y;

                    context2.beginPath();
                    context2.arc(l.x, l.y, 3, 0, 360, false);
                    context2.fillStyle = 'black';
                    context2.fill();
                    context2.stroke();

                    selectedItem = 'm';
                    break;

                case 'm':
                    m.x = mousePos.x;
                    m.y = mousePos.y;

                    context2.beginPath();
                    context2.arc(m.x, m.y, 3, 0, 360, false);
                    context2.fillStyle = 'black';
                    context2.fill();
                    context2.stroke();

                    context2.beginPath();
                    context2.moveTo(l.x, l.y);
                    context2.lineTo(m.x, m.y);
                    context2.stroke();
                    selectedItem = 'l';
                    break;
            }


            break;
    }
}, true);

var canvas1 = document.getElementById('canvas1');
var context1 = canvas1.getContext('2d');
var layer = document.getElementById('measurementlayer');
var context = layer.getContext('2d');
var selectedItem = '';


canvas1.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas1, evt);
    var message = '(X,Y): ' + mousePos.x / 50 + ',' + mousePos.y / 50;
    writeMessage(canvas1, message);

    if (selectedItem == 'b') {
        writeMessage(canvas, "Length :" + Math.sqrt((mousePos.x / 50 - $('#x1').val()) * (mousePos.x / 50 - $('#x1').val()) + (mousePos.y / 50 - $('#y1').val()) * (mousePos.y / 50 - $('#y1').val())));
    } else if (selectedItem == 'r') {
        writeMessage(canvas, "Radius :" + Math.sqrt((mousePos.x / 50 - $('#x').val()) * (mousePos.x / 50 - $('#x').val()) + (mousePos.y / 50 - $('#y').val()) * (mousePos.y / 50 - $('#y').val())));
    } else if (selectedItem == 'k') {
        setAngle(evt);
        writeMessage(canvas, "Angle :" + ($('#sa').val() - $('#ea').val()));
    }
}, false);

canvas1.addEventListener('mousedown', function(evt) {
    var mousePos = getMousePos(canvas1, evt);

    switch (selectedMethod) {
        case 'r':
            switch (selectedItem) {

                case 'a':
                    setA(evt);
                    measurementlayerUp();
                    context.beginPath();
                    context.arc(mousePos.x, mousePos.y, 3, 0, 360, false);
                    context.fillStyle = 'black';
                    context.fill();
                    context.stroke();
                    measurementlayerDown();
                    selectedItem = 'b';
                    break;

                case 'b':
                    setB(evt);
                    measurementlayerUp();
                    context.beginPath();
                    context.arc(mousePos.x, mousePos.y, 3, 0, 360, false);
                    context.fillStyle = 'black';
                    context.fill();
                    context.stroke();
                    measurementlayerDown();
                    ruler();
                    selectedItem = 'a';
                    clear();
                    break;
            }
            break;

        case 'c':
            switch (selectedItem) {
                case 'c':
                    setC(evt);
                    measurementlayerUp();
                    context.beginPath();
                    context.arc(mousePos.x, mousePos.y, 3, 0, 360, false);
                    context.fillStyle = 'black';
                    context.fill();
                    context.stroke();
                    measurementlayerDown();
                    selectedItem = 'r';
                    break;

                case 'r':
                    setR(evt);
                    measurementlayerUp();
                    context.beginPath();
                    context.arc(mousePos.x, mousePos.y, 3, 0, 360, false);
                    context.fillStyle = 'black';
                    context.fill();
                    context.stroke();
                    measurementlayerDown();
                    selectedItem = 'k';
                    break;

                case 'k':
                    setAngle(evt);
                    selectedItem = 'c';
                    compass();
                    clear();
                    break;
            }
            break;

        case 'l':
            switch (selectedItem) {

                case 'l':
                    setL(evt);
                    break;
            }

            break;
    }
}, false);

layer.addEventListener('mousedown', function(evt) {
    var mousePos = getMousePos(layer, evt);

    switch (selectedMethod) {

        case 'm':
            switch (selectedItem) {
                case 'a':
                    setX(evt);
                    context.beginPath();
                    context.arc(mousePos.x, mousePos.y, 3, 0, 360, false);
                    context.fillStyle = 'black';
                    context.fill();
                    context.stroke();

                    selectedItem = 'b';
                    break;

                case 'b':
                    setY(evt);
                    context.beginPath();
                    context.arc(mousePos.x, mousePos.y, 3, 0, 360, false);
                    context.fillStyle = 'black';
                    context.fill();
                    context.stroke();

                    measurelength();
                    selectedItem = 'a';
                    break;
            }
            break;

    }

}, false);

function saveTextAsFile() {
    var textToWrite = document.getElementById("inputTextToSave").value;
    var textFileAsBlob = new Blob([textToWrite], {
        type: 'text/plain'
    });
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

function loadFileAsText() {
    var fileToLoad = document.getElementById("fileToLoad").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        document.getElementById("inputTextToSave").value = textFromFileLoaded;
    }
    fileReader.readAsText(fileToLoad, "UTF-8");
}

function loaddrawingcalls() {

    var string = "";

    for (var i = 0; i < rulers.length; i++) {
        string += "ruler";
        string = string.concat(" (id: ", rulers[i].index);
        string = string.concat(", x1: ", rulers[i].xs);
        string = string.concat(", y1: ", rulers[i].ys);
        string = string.concat(", x2: ", rulers[i].xe);
        string = string.concat(", y2: ", rulers[i].ye);
        string = string.concat("), \n");
    }

    for (var i = 0; i < compasses.length; i++) {
        string += "compass";
        string = string.concat(" (id: ", compasses[i].index);
        string = string.concat(", x: ", compasses[i].x);
        string = string.concat(", y: ", compasses[i].y);
        string = string.concat(", radius: ", compasses[i].radius);
        string = string.concat(", s. angle: ", compasses[i].starta);
        string = string.concat(", e. angle: ", compasses[i].enda);
        if (compasses[i].rotation) {
            string = string.concat(", rotation:a ");
        } else {
            string = string.concat(", rotation:c ");
        }
        string = string.concat("), \n ");
    }

    for (var i = 0; i < labels.length; i++) {
        string += "label";
        string = string.concat(" (id: ", labels[i].index);
        string = string.concat(" x: ", labels[i].xp);
        string = string.concat(" y: ", labels[i].yp);
        string = string.concat(" text: ", labels[i].message);
        string = string.concat("), \n");
    }

    document.getElementById("inputTextToSave").innerHTML = string;
}



function cleardrawing() {
    clearCanvas();

}

//dragging for shapes
function allowDrop(ev) {
            ev.preventDefault();
        }

        function drag(ev) {
            ev.dataTransfer.setData("image", ev.target.id);
        }

        function drop(ev) {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("image");
            ev.target.appendChild(document.getElementById(data));
        }