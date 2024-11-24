function doorInteract(item) {
    if (item?.name == "crowbar") {
        this.Controller.currentScene.objects = this.Controller.currentScene?.objects.filter(object => object.id != this.id);
        this.element?.remove();

        this.Controller.inventory.removeItem(this.Controller.inventory.selectedItemIndex);

        this.Controller.savedState.time = 3;
        // setInterval(() => {console.log(this.Controller.savedState.time)}, 1000)

        this.Controller.changeScene("0.4_openedDoor")
    }
}

function fightEntry() {
    if (this.Controller.inventory.hasItem("crowbar")) {
        this.Controller.currentScene.addObject("hitWithCrowbarText");
    }
}

function getMeat() {
    this.Controller.currentScene.addObject("meat");
}

function dogInteract() {
    let item = this.Controller.inventory.selectedItem?.name;
    if (item == "meat") {
        // Собака отвлеклась
        this.Controller.inventory.removeItem(this.Controller.inventory.selectedItemIndex);
        this.Controller.currentScene.addObject("meat");
        this.Controller.savedState.meat = true;
    } else if (item == "crowbar") {
        // Дерёмся с собакой
        this.Controller.currentScene.objects = this.Controller.currentScene?.objects.filter(object => object.id != this.id);
        this.element?.remove();

        this.Controller.inventory.removeItem(this.Controller.inventory.selectedItemIndex);

        this.Controller.currentScene.addObject("dogIsKilled");
        this.Controller.currentScene.addObject("goTrapdoorText");
        

        if (!decreaseTime.bind(this)())
            return;
        this.Controller.savedState.blood = true;
    } else {
        this.Controller.currentScene.objects = this.Controller.currentScene?.objects.filter(object => object.id != this.id);
        this.element?.remove();
        
        if (!decreaseTime.bind(this)(2))
            return;
        this.Controller.savedState.blood = true;
        this.Controller.currentScene.addObject("dogIsKilledByHands");
        this.Controller.currentScene.addObject("goTrapdoorText");
    }
}

function moveShelf() {
    if (this.Controller.savedState.time >= 1) {
        this.Controller.savedState.time += 1;
        this.Controller.currentScene.addObject("shelfMovedText");
    } else {

    }
}

function dogWait() {
    if (decreaseTime.bind(this)())
    if (this.Controller.savedState.meat) {
        this.Controller.currentScene.removeObject("meat");
        this.Controller.currentScene.removeObject("dog");

        this.Controller.currentScene.addObject("dogIsGoneText");
        this.Controller.currentScene.addObject("goTrapdoorText");
    }
}

function decreaseTime(i) {
    this.Controller.savedState.time -= i ? i : 1;
    if (this.Controller.savedState.time == 0) {
        this.Controller.changeScene("e.3_time");
        return false;
    }
    
    console.log(this.Controller.savedState.time);
    return true;
}

function tryToRun() {
    let time = this.Controller.savedState.time;
    if (!this.Controller.savedState.blood && time >= 1 || time >= 2) {
        this.Controller.changeScene("666_finish");
    } else {
        this.Controller.changeScene("e.4_blood");
    }
}

function trapdoorInteract() {
    if (this.Controller.inventory.selectedItem?.name != "crowbar") {
        if (!decreaseTime.bind(this)()) {
            return;
        }
    }
    this.Controller.changeScene("2.0_underTrapdoor");
}