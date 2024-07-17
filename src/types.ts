/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/brace-style */
export interface ParentSetting extends Settings {
    ParentList: ItemParentSetting[];
}

export interface Settings {
    Active: boolean;
    StackMult: number;
    List: ItemPropSettings[];
}

// it is strange, but this is a config that changes all items that have this parent.
// ItemPropSettings changes the "Max stack size" per item.
export interface ItemParentSetting extends ItemSetting {
    StackMaxSize: number;
}

export interface ItemPropSettings extends ItemSetting {
    _props: PropSetting;
}

export interface ItemSetting {
    name: string;
    _id: string;
}

export interface PropSetting {
    StackMaxSize: number;
}