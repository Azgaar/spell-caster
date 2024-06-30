<script lang="ts">
  import {draw} from "svelte/transition";
  import PageContainer from "~components/PageContainer.svelte";
  import PrimaryButton from "~components/PrimaryButton.svelte";
  import {DRAW_TIME} from "~lib/config";
  import {page} from "~lib/store";
  import strokes from "~lib/strokes";

  let animated: Record<string, boolean> = {};
</script>

<PageContainer>
  <main class="flex-1 overflow-y-auto">
    <div id="strokes-list" class="p-4 grid grid-cols-4 gap-2">
      {#each Object.entries(strokes) as [strokeName, points] (strokeName)}
        <button on:click={() => (animated[strokeName] = !animated[strokeName])} class="rounded-lg bg-surface">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {#key animated[strokeName]}
              <polyline
                points={points.join(" ")}
                fill="none"
                stroke="var(--primary-color)"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                in:draw={{duration: DRAW_TIME}}
              />
            {/key}
          </svg>
          <h2 class="mb-2">{strokeName}</h2>
        </button>
      {/each}
    </div>
  </main>

  <aside
    id="ui-container"
    class="p-5 flex flex-col gap-4 flex-[0_0_var(--aside-width)] overflow-y-auto select-none bg-surface border-l-2 border-primary"
  >
    <h1 class="text-3xl text-center">Strokes</h1>

    <nav class="flex flex-col gap-4">
      <PrimaryButton onClick={() => page.set("canvas")}>Back to practice</PrimaryButton>
    </nav>
  </aside>
</PageContainer>
