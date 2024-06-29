<script lang="ts">
  import {fly} from "svelte/transition";
  import PageContainer from "../components/PageContainer.svelte";
  import PrimaryButton from "../components/PrimaryButton.svelte";
  import spells from "../lib/spells";
  import {page} from "../lib/store";

  let currentSpell = spells[0];
</script>

<PageContainer>
  <main id="book-container">
    <div id="book">
      <div class="page" id="left-page">
        <h1>{currentSpell.name}</h1>
        <div class="spell-entry">
          <p id="spell-description">
            A fundamental chronomancy spell that freezes a target in time. When cast successfully, the target becomes
            immobilized and unaware of the passage of time.
          </p>
          <div class="spell-details">
            <p><strong>Difficulty:</strong> Novice</p>
            <p><strong>Energy Cost:</strong> 25</p>
            <p><strong>Duration:</strong> Up to 1 minute per caster level</p>
            <p><strong>Range:</strong> 30 feet</p>
            <div class="spell-component">
              <span class="spell-component-title">Verbal Component:</span> "Tempus Immobilus"
            </div>
            <div class="spell-component">
              <span class="spell-component-title">Somatic Component:</span> Circular motion with the dominant hand, followed
              by an abrupt stop pointing at the target.
            </div>
            <div class="spell-component">
              <span class="spell-component-title">Material Component:</span> A small hourglass filled with silver sand (consumed
              in casting)
            </div>
          </div>
          <div id="practice-area">
            <button id="practice">Practice {currentSpell.name}</button>
          </div>
        </div>
      </div>
      <div class="page" id="right-page">
        <h2>Mastering {currentSpell.name}</h2>
        <p>
          {currentSpell.name} is often considered the cornerstone of chronomancy. Its ability to halt the flow of time for
          a single target makes it invaluable in both combat and non-combat situations.
        </p>
        <p>
          When casting {currentSpell.name}, visualize time as a river flowing around your target. Your goal is to create
          a perfectly still eddy in that river, isolating your target from the timestream.
        </p>
        <p>Common applications of {currentSpell.name} include:</p>
        <ul>
          <li>Freezing an opponent in combat</li>
          <li>Preserving a dying creature until healing can be administered</li>
          <li>Protecting fragile objects during transport</li>
          <li>Creating "living statues" for artistic or strategic purposes</li>
        </ul>
        <p>
          <strong>Warning:</strong> Overuse of {currentSpell.name} on living beings can have unforeseen consequences. Always
          release the spell carefully, allowing the target to gradually reintegrate with the normal flow of time.
        </p>
        <div class="page-number">1</div>
      </div>
    </div>
  </main>

  <aside id="ui-container" in:fly={{x: 400, delay: 300}} out:fly={{y: -1000, delay: 0}}>
    <h2>Spellbook</h2>
    <nav id="navigation">
      <div id="spells-list">
        {#each spells as spell}
          <PrimaryButton onClick={() => (currentSpell = spell)}>{spell.name}</PrimaryButton>
        {/each}
      </div>
      <PrimaryButton onClick={() => page.set("canvas")}>Back to practice</PrimaryButton>
    </nav>
  </aside>
</PageContainer>

<style>
  #book-container {
    flex: 1;
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  #book {
    width: 90%;
    height: 90%;
    background: rgba(255, 253, 240, 0.9);
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    display: flex;
    overflow: hidden;
  }

  .page {
    flex: 1;
    padding: 40px;
    color: #2a1a4a;
    font-size: 18px;
    overflow-y: auto;
  }

  #ui-container {
    padding: var(--gap2);

    flex: 0 0 var(--aside-width);
    background: var(--surface-color);
    border-left: 2px solid var(--primary-color);

    display: flex;
    flex-direction: column;
    gap: var(--gap2);

    overflow-y: auto;
    user-select: none;
  }

  h2 {
    text-align: center;
  }

  #navigation {
    display: flex;
    flex-direction: column;
    gap: var(--gap2);
  }

  #spells-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
  }
</style>
