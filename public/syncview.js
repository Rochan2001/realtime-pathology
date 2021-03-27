// var socket = io.connect("172.16.20.50:8000");
var socket = io.connect("http://localhost:8000");
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

viewer2.addHandler("canvas-drag", function () {
  const center = viewer2.viewport.getCenter();

  var data = {
    center: center,
  };

  socket.emit("message", data);
});

viewer2.addHandler("canvas-scroll", function () {
  const zoom = viewer2.viewport.getZoom();
  const center = viewer2.viewport.getCenter();

  var data = {
    zoom: zoom,
    center: center,
  };
  socket.emit("message", data);
});

socket.on("message", function (data) {
  console.log(socket.id + " " + data.socketId);
  if (
    data.type === "event" &&
    socket.id !== data.socketId &&
    data.hasOwnProperty("center") &&
    !data.hasOwnProperty("zoom")
  ) {
    viewer2.viewport.panTo(data.center);
  } else if (
    data.type === "event" &&
    socket.id !== data.socketId &&
    data.hasOwnProperty("zoom")
  ) {
    viewer2.viewport.zoomTo(data.zoom);
    viewer2.viewport.panTo(data.center);
  }
});
