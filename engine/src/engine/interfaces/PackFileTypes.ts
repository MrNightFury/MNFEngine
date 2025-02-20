export enum FileType {
    PACK_INFO = "pack.info",
    MODULE_INFO = "module.info",
    HTML = "html",
    SCENE = "scene",
    IMAGE = "images",
}

export enum FileContentType {
    JSON = "JSON",
    TEXT = "TEXT"
}

export function getFileContentType(type: FileType): FileContentType {
    switch (type) {
        case FileType.PACK_INFO:
        case FileType.MODULE_INFO:
            return FileContentType.JSON;
        
        case FileType.HTML:
            return FileContentType.TEXT;

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