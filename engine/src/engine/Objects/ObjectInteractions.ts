import { Logger } from "misc/Logger.ts";
import { getInviewFunction } from "window/RunInView.ts";

export enum InteractionType {
    RUN_CODE = "runCode"
}

interface BaseInteraction {
    type: InteractionType;
}

interface RunCodeInteraction extends BaseInteraction {
    type: InteractionType.RUN_CODE;
    code: string;
    inview: boolean;
}

export type Interaction = RunCodeInteraction;


const logger = new Logger("ObjectInteractionParser");


export function parseInteraction(interaction: Interaction | Interaction[]): () => void {
    if (Array.isArray(interaction)) {
        return () => {
            interaction.map(parseInteraction).forEach(f => f())
        };
    }

    switch (interaction.type) {
        case InteractionType.RUN_CODE:
            return () => {
                interaction.inview ? getInviewFunction((text) => eval(text))(interaction.code) : eval(interaction.code);
            }

        default:
            logger.error("Unknown interaction type: ", interaction.type);
            return () => {};
    }
}