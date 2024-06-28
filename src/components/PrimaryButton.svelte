<script lang="ts">
  export let onClick: VoidFunction;
</script>

<button on:click={onClick}><slot></slot></button>

<style>
  button {
    padding: var(--gap);
    border: none;
    border-radius: 5px;

    background-color: var(--primary-color);
    color: var(--font-color);
    font-size: 100%;
    font-family: var(--font-family);
    transition: all 0.3s ease;
  }

  button:hover {
    background-color: var(--primary-accent-color);
    box-shadow: 0 0 20px var(--primary-color);
  }
</style>
