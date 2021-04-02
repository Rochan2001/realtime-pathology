// var socket = io.connect("172.16.20.50:8000");
var socket = io.connect("http://localhost:8000");
var temp = false;

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

socket.on("connect", function () {
  document.getElementById("doc1").innerHTML = "docId: " + socket.id.toString();
});

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
  console.log(socket.id + " " + data.socketId);
  if (socket.id !== data.socketId) {
    if (temp === false) {
      document.getElementById("doc2").innerHTML =
        "docId: " + data.socketId.toString();
      temp = true;
    }
    if (
      data.type === "event" &&
      data.hasOwnProperty("center") &&
      !data.hasOwnProperty("zoom")
    ) {
      viewer2.viewport.panTo(data.center);
    } else if (data.type === "event" && data.hasOwnProperty("zoom")) {
      viewer2.viewport.zoomTo(data.zoom);
      viewer2.viewport.panTo(data.center);
    }
  }
});
