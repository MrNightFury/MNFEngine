import * as path from "https://deno.land/std@0.224.0/path/mod.ts";
import { parse } from "https://cdn.skypack.dev/jsonc-parser";

console.log("Build");

async function getTsConfig() {
    try {
        const tsConfigPath = path.join(Deno.cwd(), "tsconfig.json");
        const tsConfigText = await Deno.readTextFile(tsConfigPath);
        const tsConfig = parse(tsConfigText);
        return tsConfig;
    } catch (error) {
        console.error("Error loading tsconfig.json:", error);
    }
}

const distDir = path.join(Deno.cwd(), 'js');


const cfg = await getTsConfig();
const paths = new Map<string, string>();

for (const k in cfg.compilerOptions.paths) {
    paths.set(k, cfg.compilerOptions.paths[k][0]);
}
console.log(paths);

processDir(distDir)

async function processDir(dir: string) {
    const files = Deno.readDirSync(dir);
    for (const file of files) {
        console.log(file.name);

        const filePath = path.join(dir, file.name);
        if (file.isDirectory) {
            processDir(filePath);
        }
        if (file.isFile && filePath.endsWith('.js')) {
            let content = await Deno.readTextFile(filePath);

            // Replace path aliases with relative paths
            paths.forEach((v, k) => {
                const alias = k.replace('/*', '');
                const path = v.replace('/*', '');

                content = content.replaceAll(new RegExp(`import\s*\\((\s*"${alias})`, 'g'),
                                            `import(globalThis.path + "${path?.replace('.ts', '.js').replace('./src/', '')}`);
                //import { FileType } from "engine/interfaces/PackFiles.js";
                // console.log(new RegExp(`from\\s*"${alias}`, 'g'))
                
                // content = content.replaceAll(new RegExp(`from(\\s*)"${alias}`, 'g'),
                //                              `from "${path?.replace('.ts', '.js').replace('./src/', '')}`);
                content = content.replaceAll(`from "${alias}`, `from "${path?.replace('.ts', '.js').replace('./src/', './')}`)
                // console.log(content)
            })

            await Deno.writeTextFile(filePath, content);
        }
    }
}

