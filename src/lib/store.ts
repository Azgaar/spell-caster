import {writable} from "svelte/store";

type Page = "canvas" | "spellbook" | "strokes" | "effects";

export const page = writable<Page>("canvas");
