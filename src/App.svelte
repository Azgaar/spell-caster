<script lang="ts">
  import {page} from "./lib/store";
  import Canvas from "./pages/Canvas.svelte";
  import Spellbook from "./pages/Spellbook.svelte";
  import Strokes from "./pages/Strokes.svelte";
</script>

{#if $page === "canvas"}<Canvas />{/if}
{#if $page === "spellbook"}<Spellbook />{/if}
{#if $page === "strokes"}<Strokes />{/if}
