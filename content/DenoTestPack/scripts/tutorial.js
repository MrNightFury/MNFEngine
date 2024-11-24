function tutorial1() {
    if (this.Controller.inventory.addItem({ name: this.name, sprite: this.sprite ?? {path: "", size: 100}}) != -1){
        this.Controller.currentScene.objects = this.Controller.currentScene?.objects.filter(object => object.name != this.name);
        this.element?.remove();
    }

    this.Controller.currentScene.addObject("tutorial2");
}

function tutorial2(item) {
    if (item?.name == "Key") {
        this.Controller.currentScene.objects = this.Controller.currentScene?.objects.filter(object => object.name != this.name);
        this.element?.remove();

        this.Controller.inventory.removeItem(this.Controller.inventory.selectedItemIndex);

        this.Controller.currentScene.addObject("tutorial3");
        this.Controller.currentScene.addObject("door");
    }
}

function finish() {
    this.Controller.setPack("ChoosePack").then(() => {
        this.Controller.changeScene(this.Controller.packInfo.defaultScene);
    })
}