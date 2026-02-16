import { GenericQueryCtx, GenericMutationCtx } from "convex/server";

export type DataModel = any;

export declare const query: (options: {
    args?: any;
    handler: (ctx: GenericQueryCtx<DataModel>, args: any) => any;
}) => any;

export declare const mutation: (options: {
    args?: any;
    handler: (ctx: GenericMutationCtx<DataModel>, args: any) => any;
}) => any;
