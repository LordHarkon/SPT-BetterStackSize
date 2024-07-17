import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { BetterStackSize } from "./betterStack";

class BetterStack implements IPostDBLoadMod
{
    private logger: ILogger;

    public preSptLoad(container: DependencyContainer): void
    {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.log("Loading items in memory...")

        container.register<BetterStackSize>("BetterStackSize", BetterStackSize);
    }

    public postDBLoad(container: DependencyContainer): void
    {
        container.resolve<BetterStackSize>("BetterStackSize");
        this.log("Finished loading items in memory.");
    }

    private log(message: string): void
    {
        this.logger.logWithColor("[Better Stack Size] " + message, LogTextColor.CYAN);
    }
}

export const mod = new BetterStack();
