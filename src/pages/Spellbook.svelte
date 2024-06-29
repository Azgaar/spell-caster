<script lang="ts">
  import {fly} from "svelte/transition";
  import PageContainer from "../components/PageContainer.svelte";
  import PrimaryButton from "../components/PrimaryButton.svelte";
  import spells from "../lib/spells";
  import {page} from "../lib/store";

  let spellIndex = 0;
  let currentSpell = spells[spellIndex];
</script>

<PageContainer>
  <main class="relative flex flex-1 items-center justify-center">
    <div
      id="book"
      class="flex flex-col gap-2 p-5 w-[90%] h-[90%] rounded-lg bg-[#eae5de] shadow-glow overflow-y-auto bg-[url('/book.webp')] bg-[size:100%_100%]"
    >
      <h2 class="text-3xl m-4 text-left text-primary">{currentSpell.name}</h2>

      <div class="flex h-full">
        <div id="left-page" class="flex flex-col flex-1 gap-8 px-6 text-dark text-lg">
          <p
            id="spell-description"
            class="first-letter:[initial-letter:3] first-letter:text-primary first-letter:pr-2 first-letter:font-serif"
          >
            {currentSpell.name} is a fundamental chronomancy spell that freezes a target in time. When cast successfully,
            the target becomes immobilized and unaware of the passage of time.
          </p>

          <div class="p-5 rounded-lg bg-primary/5 flex flex-col gap-1 text-base">
            <p><strong class="text-primary">Difficulty:</strong> Novice</p>
            <p><strong class="text-primary">Energy Cost:</strong> 25</p>
            <p><strong class="text-primary">Duration:</strong> Up to 1 minute</p>
            <p><strong class="text-primary">Range:</strong> 30 feet</p>
          </div>
        </div>

        <div id="right-page" class="flex flex-col justify-between flex-1 gap-8 px-6 text-dark text-lg">
          <div class="flex flex-col gap-8">
            <p>
              {currentSpell.name} is often considered the cornerstone of chronomancy. Its ability to halt the flow of time
              for a single target makes it invaluable in both combat and non-combat situations.
            </p>
            <p>
              When casting {currentSpell.name}, visualize time as a river flowing around your target. Your goal is to
              create a perfectly still eddy in that river, isolating your target from the timestream.
            </p>
            <p>Common applications of {currentSpell.name} include:</p>
            <ul>
              <li>Freezing an opponent in combat</li>
              <li>Preserving a dying creature until healing can be administered</li>
              <li>Protecting fragile objects during transport</li>
              <li>Creating "living statues" for artistic or strategic purposes</li>
            </ul>
            <p>
              <strong class="text-surface">Warning:</strong> Overuse of {currentSpell.name} on living beings can have unforeseen
              consequences. Always release the spell carefully, allowing the target to gradually reintegrate with the normal
              flow of time.
            </p>
          </div>
          <div id="page-number" class="text-right text-lg pb-4">- {spellIndex + 1} -</div>
        </div>
      </div>
    </div>
  </main>

  <aside
    id="ui-container"
    class="p-5 flex flex-col gap-4 flex-[0_0_var(--aside-width)] overflow-y-auto select-none bg-surface border-l-2 border-primary"
    in:fly={{x: 400, delay: 300}}
    out:fly={{y: -1000, delay: 0}}
  >
    <h1 class="text-3xl text-center">Spellbook</h1>

    <nav class="flex flex-col gap-4">
      <div id="spells-list" class="flex flex-col gap-2">
        {#each spells as spell, index}
          <PrimaryButton
            onClick={() => {
              spellIndex = index;
              currentSpell = spell;
            }}
            current={index === spellIndex}>{spell.name}</PrimaryButton
          >
        {/each}
      </div>
      <PrimaryButton onClick={() => page.set("canvas")}>Back to practice</PrimaryButton>
    </nav>
  </aside>
</PageContainer>
