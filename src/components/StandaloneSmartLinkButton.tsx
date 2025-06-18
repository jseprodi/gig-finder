import React from "react";
// Placeholder for smart link utils
const createItemSmartLink = (id: string) => ({ "data-smartlink-item": id });
const createElementSmartLink = (codename: string) => ({ "data-smartlink-element": codename });

export const StandaloneSmartLinkButton = (props: { isPreview: boolean; itemId?: string; elementCodename?: string }) => {
    if (!props.isPreview) {
        return null;
    }
    return (
        <div className="absolute right-0 top-0 w-12 h-12 m-0" {...("itemId" in props ? createItemSmartLink(props.itemId!) : createElementSmartLink(props.elementCodename!))} />
    );
};
