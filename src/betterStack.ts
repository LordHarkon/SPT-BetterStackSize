import { inject, injectable } from "tsyringe";
import { ParentSetting, Settings } from "./types";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { DatabaseService } from "@spt/services/DatabaseService";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";

@injectable()
export class BetterStackSize
{
    private barterConfig: Settings = require("../config/barter.json");
    private clothingConfig: Settings = require("../config/clothing.json");
    private medicalConfig: Settings = require("../config/medicals.json");
    private partsnmodsConfig: ParentSetting = require("../config/partsnmods.json");
    private provisionsConfig: Settings = require("../config/provisions.json");
    private keycardsConfig: ParentSetting = require("../config/keycards.json");
    private othersConfig: Settings = require("../config/others.json");

    private items: Record<string, ITemplateItem>;

    constructor(
        @inject("DatabaseService") private db: DatabaseService,
        @inject("WinstonLogger") private logger: ILogger
    )
    {
        this.items = db.getTables().templates.items;

        this.log("Changing the stack sizes...");
        this.changeSettings(this.clothingConfig);
        this.changeSettings(this.provisionsConfig);
        this.changeSettings(this.medicalConfig, true);
        this.changeSettings(this.barterConfig);
        this.changeParentSettings(this.partsnmodsConfig);
        this.changeParentSettings(this.keycardsConfig);
        this.changeSettings(this.othersConfig);
        this.log("Finished changing the stack sizes.");
    }

    private changeSettings(data: Settings, isMedical: boolean = false): void
    {
        if (!this.isActive(data)) return;

        Object.keys(data.List).forEach((itemInfoKey) =>
        {
            const itemInfo = data.List[itemInfoKey];
            this.forEachItem(itemInfo._id, false, isMedical, itemInfo._props.StackMaxSize, data.StackMult);
        });
    }

    private changeParentSettings(data: ParentSetting): void
    {
        if (!this.isActive(data)) return;

        Object.keys(data.ParentList).forEach((parentInfoKey) =>
        {
            const parentInfo = data.ParentList[parentInfoKey];
            this.forEachItem(parentInfo._id, true, false, parentInfo.StackMaxSize, data.StackMult);
        });
    }

    private forEachItem(
        id: string,
        isParent: boolean = false,
        isMedical: boolean = false,
        stackMaxSize: number,
        stackMult: number
    ): void
    {
        Object.keys(this.items).forEach((itemKey) =>
        {
            const item: ITemplateItem = this.items[itemKey];

            if (
                !item._props ||
                (isParent && item._parent != id) ||
                item._id != id ||
                !item._props.StackMaxSize ||
                (isMedical && !item._props.MaxHpResource) ||
                (isMedical && item._props.MaxHpResource > 0)
            )
                return;

            item._props.StackMaxSize = stackMaxSize * stackMult;
            item._props.StackMinRandom = 1;
        });
    }

    private isActive(data: Settings): boolean
    {
        return !!data && !!data.Active;
    }

    private log(message: string): void
    {
        this.logger.logWithColor("[Better Stack Size] " + message, LogTextColor.CYAN);
    }
}
