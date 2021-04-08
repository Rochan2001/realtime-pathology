//var socket = io.connect("172.16.20.50:8000");
// var socket = io.connect("172.16.20.103:8000");
var socket = io.connect("http://localhost:8000");
var temp = false;
var viewer1 = OpenSeadragon({
  id: "openseadragon1",
  prefixUrl: "../openseadragon/images/",
  tileSources: "../image/mydz.dzi",
  visibilityRatio: 1.0,
  constrainDuringPan: true,
});

viewer1.initializeAnnotations();

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
    if (data.hasOwnProperty("annotation")) {
      console.log(data);
      viewer1.annotations.set(data.annotation);
    }
    if (data.hasOwnProperty("center") && !data.hasOwnProperty("zoom")) {
      viewer1.viewport.panTo(data.center);
    } else if (data.hasOwnProperty("zoom")) {
      viewer1.viewport.zoomTo(data.zoom);
      viewer1.viewport.panTo(data.center);
    }
  }
});
