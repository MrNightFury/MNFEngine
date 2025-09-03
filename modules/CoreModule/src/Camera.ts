import { Position } from "engine/Objects/SceneObject.ts";


export class Camera {
    position: Position = { x: 0, y: 0 };

    moveTo(position: Position) {
        this.position = position;
    }

    moveBy(delta: Position) {
        this.position.x += delta.x;
        this.position.y += delta.y;
    }

    toScreenCoordinates(worldPosition: Position): Position {
        return {
            x: worldPosition.x - this.position.x,
            y: worldPosition.y - this.position.y
        }
    }

    fromScreenCoordinates(screenPosition: Position): Position {
        return {
            x: screenPosition.x + this.position.x,
            y: screenPosition.y + this.position.y
        }
    }
}