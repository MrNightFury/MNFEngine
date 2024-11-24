function goback() {
    this.Controller.changeScene(this.Controller.lastSavedScene)
}

function reload() {
    this.Controller.clearSave();
    this.Controller.changeScene("0.0_startScene")
}