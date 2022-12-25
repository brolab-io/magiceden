AFRAME.registerComponent("glb-model-logger", {
  init: function () {
    this.el.addEventListener("model-loaded", (e) => {
      console.log(this.el.getObject3D("mesh"));
    });
  },
});
