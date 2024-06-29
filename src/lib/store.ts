import {writable} from "svelte/store";

type Page = "canvas" | "spellbook";

export const page = writable<Page>("canvas");
