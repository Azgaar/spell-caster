import {writable} from "svelte/store";

type Page = "canvas" | "spellbook" | "strokes";

export const page = writable<Page>("canvas");
