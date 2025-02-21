import { AudioService, BaseService } from "engine/EngineServices.ts";
import { FileType } from "engine/Interfaces/PackFileTypes.ts";

import { inview } from "./RunInView.ts";
import { Engine } from "engine/Engine.ts";


declare global {
    var backgroundMusic: HTMLAudioElement;
}

export class WebviewAudioService extends BaseService implements AudioService {
    @inview
    private playSoundInview(soundPath: string) {
        const audio = new Audio(soundPath);
        audio.play();
    }

    @inview
    private setBackgroundInview(soundPath: string) {
        if (globalThis.backgroundMusic) {
            globalThis.backgroundMusic.pause();
        }
        globalThis.backgroundMusic = new Audio(soundPath);
        globalThis.backgroundMusic.loop = true;
        globalThis.backgroundMusic.play();
    }

    playSound(identifier: string): void {
        const path = this.engine.loader.getPathFromIdentifier(identifier, FileType.AUDIO);
        if (!path) {
            this.logger.error(`Sound not found: ${identifier}`);
            return;
        }
        this.playSoundInview(path);
    }

    setBackgrountMusic(identifier: string): void {
        const path = this.engine.loader.getPathFromIdentifier(identifier, FileType.AUDIO);
        if (!path) {
            this.logger.error(`Sound not found: ${identifier}`);
            return;
        }
        this.setBackgroundInview(path);
    }

    /**
     * 
     * @param baseIdentifier 
     * @param range last sound index (inclusive, starts from 0)
     * @returns 
     */
    playRandomSound(baseIdentifier: string, range: number): void {
        const filenameParts = baseIdentifier.split(".")
        const path = Engine.instance.loader.getPathFromIdentifier(
            filenameParts[0] + "_" + Math.floor(Math.random() * (range + 1)) + "." + filenameParts[1], FileType.AUDIO);
            
        if (!path) {
            this.logger.error(`Sound not found: ${baseIdentifier}`);
            return;
        }
        this.playSoundInview(path);
    }

    /**
     * 
     * @param baseIdentifier 
     * @param range last sound index (inclusive, starts from 0)
     * @param count 
     * @param interval [ms]
     */
    playRandomSequence(baseIdentifier: string, range: number, count: number, interval: number): void {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.playRandomSound(baseIdentifier, range);
            }, interval * i);
        }
    }
}