<script lang="ts">
  import { faImage } from "@fortawesome/free-solid-svg-icons";
  import { convertFileSrc } from "@tauri-apps/api/tauri";
  import { createEventDispatcher, tick } from "svelte";
  import Fa from "svelte-fa";
  import CapitionPane, { type CaptionEvents } from "./CapitionPane.svelte";
  import LoadingOverlay from "./LoadingOverlay.svelte";

  const event = createEventDispatcher<CaptionEvents>();

  export let selectedPath: string | null = null;

  let img: HTMLImageElement | null = null;
  let horizontal = false;

  let loadingImage = false;

  $: if (selectedPath) {
    loadingImage = true;

    tick().then(onLoad);
  }

  function onLoad() {
    if (img?.complete) loadingImage = false;
  }
</script>

<main class={["flex max-h-screen flex-grow gap-2 p-2", horizontal ? "flex-row" : "flex-col"].join(" ")}>
  <div
    class={[
      "relative flex max-h-full max-w-full flex-grow items-center justify-center",
      horizontal ? "h-full w-1/4" : "h-1/4 w-full",
    ].join(" ")}
  >
    {#if selectedPath}
      <img
        bind:this={img}
        on:load={onLoad}
        class="h-full w-auto object-contain"
        src={convertFileSrc(selectedPath)}
        alt=""
      />
    {:else}
      <Fa icon={faImage} scale="2xl" />
    {/if}

    {#if loadingImage}<LoadingOverlay />{/if}
  </div>

  <CapitionPane
    {selectedPath}
    {horizontal}
    on:next={event.bind(null, ["next"])}
    on:previous={event.bind(null, ["previous"])}
  />
</main>
