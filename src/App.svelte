<script lang="ts">
  import {Route, Router} from "svelte-routing";
  import Canvas from "~pages/Canvas.svelte";
  import Effects from "~pages/Effects.svelte";
  import Spellbook from "~pages/Spellbook.svelte";
  import Strokes from "~pages/Strokes.svelte";
</script>

<Router>
  <Route path="/" component={Canvas} />
  <Route path="spellbook/:id" component={Spellbook} />
  <Route path="strokes/:id" component={Strokes} />
  <Route path="effects/:id" component={Effects} />
</Router>
