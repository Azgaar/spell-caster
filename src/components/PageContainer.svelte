<script lang="ts">
  import {fade} from "svelte/transition";
  const timeout = 300;
</script>

<div
  aria-label="page container"
  in:fade={{duration: timeout, delay: timeout}}
  out:fade={{duration: timeout, delay: timeout}}
>
  <slot />
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    display: flex;
  }
</style>
