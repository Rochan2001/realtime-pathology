// var socket = io.connect("172.16.20.50:8000");
var socket = io.connect("http://localhost:8000");
var temp = false;
var output = document.querySelector("#output");
var feedback = document.querySelector("#feedback");
var handle = document.querySelector("#handle");
var btn = document.querySelector("#send");

var viewer1 = OpenSeadragon({
  id: "openseadragon1",
  prefixUrl: "../openseadragon/images/",
  tileSources: "../image/mydz.dzi",
  visibilityRatio: 1.0,
  constrainDuringPan: true,
});
var viewer2 = OpenSeadragon({
  id: "openseadragon2",
  prefixUrl: "../openseadragon/images/",
  tileSources: "../image/mydz.dzi",
  visibilityRatio: 1.0,
  constrainDuringPan: true,
});

// var anno = OpenSeadragon.Annotorious(viewer1);
// console.log(anno);
// anno.addAnnotation(annotation);
viewer1.initializeAnnotations();

socket.on("connect", function () {
  document.getElementById("doc1").innerHTML = "docId: " + socket.id.toString();
});

function annotation(event) {
  if (viewer1.annotations.get().length !== 0) {
    var data = {
      annotation: viewer1.annotations.get(),
    };
    socket.emit("message", data);
  }
}

viewer1.addHandler("canvas-drag", function () {
  const center = viewer1.viewport.getCenter();

  var data = {
    center: center,
  };

  socket.emit("message", data);
});

viewer1.addHandler("canvas-scroll", function () {
  const zoom = viewer1.viewport.getZoom();
  const center = viewer1.viewport.getCenter();

  var data = {
    zoom: zoom,
    center: center,
  };
  socket.emit("message", data);
});

socket.on("message", function (data) {
  if (socket.id !== data.socketId && data.type === "event") {
    if (temp === false) {
      document.getElementById("doc2").innerHTML =
        "docId: " + data.socketId.toString();
      temp = true;
    }
    if (data.hasOwnProperty("annotation")) {
      console.log(data);
      viewer1.annotations.set(data.annotation);
    }
    if (data.hasOwnProperty("center") && !data.hasOwnProperty("zoom")) {
      viewer2.viewport.panTo(data.center);
    } else if (data.hasOwnProperty("zoom")) {
      viewer2.viewport.zoomTo(data.zoom);
      viewer2.viewport.panTo(data.center);
    }
  }
});

btn.addEventListener("click", function () {
  socket.emit("chat", {
    handle: handle.value,
    message: message.value,
  });
});

socket.on("chat", function (data) {
  output.innerHTML +=
    "<p><strong>" + data.handle + ":</strong>" + data.message + "</p>";
  feedback.innerHTML = "";
});
