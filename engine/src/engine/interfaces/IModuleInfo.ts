export interface IBaseModuleInfo {
    mfv: number | undefined;

    name: string;
    entryPoints: {
        deno: string;
        browser: string;
    };
    namespace: string;
    dependencies?: string[];
}

export interface IModuleInfov1 extends IBaseModuleInfo {
    pfv: 1;
}

export type IModuleInfo = IModuleInfov1;