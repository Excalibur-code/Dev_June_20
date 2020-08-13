
let pencil = document.querySelector("#pencil");
let eraser = document.querySelector("#eraser");
let undo = document.querySelector("#undo");
let redo = document.querySelector("#redo");

// ctx.lineWidth=10;
pencil.addEventListener("click", function () {
    ctx.strokeStyle = "black";
})
eraser.addEventListener("click", function () {
    ctx.strokeStyle = "white";
})
undo.addEventListener("click", function () {
    undoMaker()
})
redo.addEventListener("click", function () {
    redoMaker();
})
document.addEventListener("keydown", function (e) {
    var evtobj = e;
    if (evtobj.keyCode == 90 && evtobj.ctrlKey)
        undoMaker();
})
document.addEventListener("keydown", function (e) {
    var evtobj = e;
    if (evtobj.keyCode == 89 && evtobj.ctrlKey)
        redoMaker();
})

