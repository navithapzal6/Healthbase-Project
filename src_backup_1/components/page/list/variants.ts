import { cva } from "class-variance-authority";

export const listPageVariants = cva("flex h-full flex-col gap-5");

export const listHeaderVariants = cva("flex flex-col gap-1");

export const listToolbarVariants = cva(`
flex
flex-col
gap-3
lg:flex-row
lg:items-center
lg:justify-between
`);

export const listContentVariants = cva(`
flex-1
overflow-hidden
`);
