var socket = io.connect("http://localhost:8000");

var viewer = OpenSeadragon({
  id: "openseadragon1",
  prefixUrl: "../openseadragon/images/",
  tileSources: "../image/mydz.dzi",
  visibilityRatio: 1.0,
  constrainDuringPan: true,
});

viewer.addHandler("canvas-drag", function () {
  const center = viewer.viewport.getCenter();

  var data = {
    center: center,
  };

  socket.emit("message", data);
});

viewer.addHandler("canvas-scroll", function () {
  const zoom = viewer.viewport.getZoom();
  const center = viewer.viewport.getCenter();

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
    viewer.viewport.panTo(data.center);
  } else if (
    data.type === "event" &&
    socket.id !== data.socketId &&
    data.hasOwnProperty("zoom")
  ) {
    viewer.viewport.zoomTo(data.zoom);
    viewer.viewport.panTo(data.center);
  }
});
