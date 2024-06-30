<script lang="ts">
  import Router from "svelte-spa-router";
  import Canvas from "~pages/Canvas.svelte";
  import Effects from "~pages/Effects.svelte";
  import Spellbook from "~pages/Spellbook.svelte";
  import Strokes from "~pages/Strokes.svelte";

  const routes = {
    "/": Canvas,
    "/spellbook/:spell": Spellbook,
    "/strokes/:stroke": Strokes,
    "/effects/:effect": Effects
  };
</script>

<Router {routes} />
