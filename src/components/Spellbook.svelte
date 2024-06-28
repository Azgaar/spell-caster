<script lang="ts">
  import spells from "../lib/spells";

  let dialog: HTMLDialogElement;

  function closeDialog() {
    dialog.close();
  }
</script>

<dialog bind:this={dialog}>
  <div class="content">
    <h2>Spellbook</h2>
    <button class="close-button" on:click={closeDialog}>Close</button>

    <div>
      {#each spells as spell}
        <div>
          <h3>{spell.name}</h3>
          <p>{spell.description}</p>
        </div>
      {/each}
    </div>
  </div>
</dialog>

<style>
  .content {
    padding: 1rem;
    max-width: 80vw;
    max-height: 60vh;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
</style>
