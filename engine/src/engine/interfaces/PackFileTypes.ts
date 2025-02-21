export enum FileType {
    PACK_INFO = "pack.info",
    MODULE_INFO = "module.info",
    HTML = "html",
    SCENE = "scene",
    IMAGE = "images",
    AUDIO = "audio",
}

export enum FileContentType {
    JSON = "JSON",
    TEXT = "TEXT",
    BIN = "BIN"
}

export function getFileContentType(type: FileType): FileContentType {
    switch (type) {
        case FileType.PACK_INFO:
        case FileType.MODULE_INFO:
        case FileType.SCENE:
            return FileContentType.JSON;
        
        case FileType.HTML:
            return FileContentType.TEXT;

        case FileType.IMAGE:
        case FileType.AUDIO:
            return FileContentType.BIN;

        default:
            return FileContentType.TEXT;
    }
}

export function getFileExtension(type: FileType): string {
    switch (type) {
        case FileType.HTML:
            return ".html";
        default:
            return "";
    }
}