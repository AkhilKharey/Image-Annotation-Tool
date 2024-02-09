let canvas = new fabric.Canvas('annotationCanvas', { selection: false });
let annotations = {}; // Object to store annotations for each label

function handleImage() {
    let input = document.getElementById('imageInput');
    let reader = new FileReader();

    reader.onload = function () {
        let img = new Image();
        img.onload = function () {
            canvas.clear();
            canvas.setBackgroundImage(reader.result, canvas.renderAll.bind(canvas));
            canvas.setDimensions({ width: img.width, height: img.height });
        };
        img.src = reader.result;
    };

    if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]);
    }
}

// function createRectangle(options) {
//     let pointer = canvas.getPointer(options.e);
//     let startX = pointer.x;
//     let startY = pointer.y;

//     let rect = new fabric.Rect({
//         left: startX,
//         top: startY,
//         originX: 'left',
//         originY: 'top',
//         width: 0,
//         height: 0,
//         selectable: true,
//         fill: 'transparent',
//         stroke: 'red',
//         strokeWidth: 2,
//         cornerSize: 10,
//         transparentCorners: false,
//         label: document.getElementById('classInput').value,
        
//     });

//     canvas.add(rect);
//     canvas.setActiveObject(rect);

//     let isResizing = false;
//     canvas.on('mouse:move', function (options) {
//         if (isResizing) {
//             let pointer = canvas.getPointer(options.e);
//             rect.set({
//                 width: pointer.x - rect.left,
//                 height: pointer.y - rect.top
//             });
//             canvas.renderAll();
//         }
//     });

//     canvas.on('mouse:up', function () {
//         isResizing = false;
//     });

//     rect.on('mousedown', function () {
//         isResizing = true;
//     });

//     return rect;
// }
function createRectangle(options) {
    let pointer = canvas.getPointer(options.e);
    let startX = pointer.x;
    let startY = pointer.y;

    let rect = new fabric.Rect({
        left: startX,
        top: startY,
        originX: 'left',
        originY: 'top',
        width: 0,
        height: 0,
        selectable: true,
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 2,
        cornerSize: 10,
        transparentCorners: false,
        label: document.getElementById('classInput').value,
        
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);

    let isResizing = false;
    canvas.on('mouse:move', function (options) {
        if (isResizing) {
            let pointer = canvas.getPointer(options.e);
            rect.set({
                width: pointer.x - rect.left,
                height: pointer.y - rect.top
            });
            canvas.renderAll();
        }
    });

    canvas.on('mouse:up', function () {
        isResizing = false;
    });

    rect.on('mousedown', function () {
        isResizing = true;
    });
    
    return rect;
}

// function createRectangle(options) {
//     let pointer = canvas.getPointer(options.e);
//     let startX = pointer.x;
//     let startY = pointer.y;

//     let rect = new fabric.Rect({
//         left: startX,
//         top: startY,
//         originX: 'left',
//         originY: 'top',
//         width: 0,
//         height: 0,
//         selectable: true,
//         fill: 'transparent',
//         stroke: 'red',
//         strokeWidth: 2,
//         cornerSize: 10,
//         transparentCorners: false,
//         label: document.getElementById('classInput').value,
//         id: Date.now().toString() // Assign a unique ID to the rectangle
//     });

//     canvas.add(rect);
//     canvas.setActiveObject(rect);

//     let isResizing = false;
//     canvas.on('mouse:move', function (options) {
//         if (isResizing) {
//             let pointer = canvas.getPointer(options.e);
//             rect.set({
//                 width: pointer.x - rect.left,
//                 height: pointer.y - rect.top
//             });
//             canvas.renderAll();
//         }
//     });

//     canvas.on('mouse:up', function () {
//         isResizing = false;
//     });

//     rect.on('mousedown', function () {
//         isResizing = true;
//     });
    
//     return rect;
// }

canvas.on('mouse:down', function (options) {
    let rect = createRectangle(options);

    rect.on('modified', function () {
        updateAnnotation(rect);
    });
});

function updateAnnotation(rect) {
    let annotation = annotations[rect.label].find(a => a.id === rect.id);
    if (annotation) {
        annotation.x = rect.left / canvas.width;
        annotation.y = rect.top / canvas.height;
        annotation.width = rect.width / canvas.width;
        annotation.height = rect.height / canvas.height;
    }
}

function addAnnotation() {
    let classInput = document.getElementById('classInput').value;
    if (!annotations[classInput]) {
        annotations[classInput] = []; // Create array for new label if it doesn't exist
    }

    let rect = createRectangle({ e: { clientX: 0, clientY: 0 } });
    let annotation = {
        id: rect.id,
        x: rect.left / canvas.width,
        y: rect.top / canvas.height,
        width: rect.width / canvas.width,
        height: rect.height / canvas.height,
    };
    annotations[classInput].push(annotation); // Add annotation to corresponding label array
}

// function saveAnnotations(label) {
//     if (!annotations[label] || annotations[label].length === 0) {
//         alert(`No annotations for label "${label}" to save.`);
//         return;
//     }

//     let yoloAnnotations = annotations[label].map(annotation => {
//         return `${annotation.x + annotation.width / 2} ${annotation.y + annotation.height / 2} ${annotation.width} ${annotation.height}`;
//     });

//     let blob = new Blob([yoloAnnotations.join('\n')], { type: 'text/plain' });
//     let fileName = `${label}_annotations.txt`; // Constructing the filename
//     let link = document.createElement('a');
//     link.href = window.URL.createObjectURL(blob);
//     link.download = fileName;
//     link.click();
// }
function saveAnnotations(label) {
    if (!annotations[label] || annotations[label].length === 0) {
        alert(`No annotations for label "${label}" to save.`);
        return;
    }

    let yoloAnnotations = annotations[label].map(annotation => {
        return `${annotation.x + annotation.width / 2} ${annotation.y + annotation.height / 2} ${annotation.width} ${annotation.height}`;
    });

    let blob = new Blob([yoloAnnotations.join('\n')], { type: 'text/plain' });
    let fileName = `${label}_annotations.txt`; // Constructing the filename
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    // Clear label input field after saving annotations
    document.getElementById('classInput').value = "";
}
// function clearLastAnnotation() {
//     if (annotations.length === 0) {
//         alert('No annotations to clear.');
//         return;
//     }

//     let lastAnnotation = annotations.pop(); // Remove the last annotation from the array

//     // Iterate through canvas objects to find the corresponding fabric.js object
//     canvas.getObjects().forEach(function(object) {
//         if (object.id === lastAnnotation.id) {
//             canvas.remove(object); // Remove the rectangle from the canvas
//         }
//     });

//     canvas.renderAll(); // Render the canvas
// }

function clearLastAnnotation() {
    // Retrieve the label from the input field
    let label = document.getElementById('classInput').value;
    
    // Check if there are annotations for the current label
    if (!annotations[label] || annotations[label].length === 0) {
        alert('No annotations to clear for the current label.');
        return;
    }

    // Retrieve the last annotation for the current label
    let lastAnnotation = annotations[label].pop();

    // Find the corresponding fabric.js object and remove it from the canvas
    let rectToRemove = canvas.getObjectById(lastAnnotation.id);
    if (rectToRemove) {
        canvas.remove(rectToRemove);
        canvas.renderAll();
    }
}

