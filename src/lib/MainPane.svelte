<script lang="ts">
  import { faImage } from "@fortawesome/free-solid-svg-icons";
  import { filesystem } from "@neutralinojs/lib";
  import { createEventDispatcher, tick } from "svelte";
  import Fa from "svelte-fa";
  import CapitionPane, { type CaptionEvents } from "./CapitionPane.svelte";
  import LoadingOverlay from "./LoadingOverlay.svelte";

  const event = createEventDispatcher<CaptionEvents>();

  export let selectedPath: string | null = null;
  export let unsavedPaths: string[] = [];

  let imageUrl: string | null = null;
  let img: HTMLImageElement | null = null;
  let horizontal = false;

  let loadingImage = false;

  function clean() {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      imageUrl = null;
    }
  }

  $: if (selectedPath) {
    loadingImage = true;

    clean();

    filesystem.readBinaryFile(selectedPath).then((result) => {
      imageUrl = URL.createObjectURL(new Blob([result], { type: "image/" + selectedPath.split(".").slice(-1)[0] }));
    });

    tick().then(onLoad);
  } else clean();

  function onLoad() {
    if (img?.complete) loadingImage = false;
  }
</script>

<main class={["flex max-h-screen flex-grow gap-2 p-2", horizontal ? "flex-row" : "flex-col"].join(" ")}>
  <div
    class={[
      "relative flex max-h-full max-w-full flex-grow items-center justify-center bg-black bg-opacity-25",
      horizontal ? "h-full w-1/4" : "h-1/4 w-full",
    ].join(" ")}
  >
    {#if imageUrl}
      <img
        bind:this={img}
        on:load={onLoad}
        src={imageUrl}
        alt=""
        class="h-auto max-h-full w-full max-w-full object-contain"
      />
    {:else}
      <Fa icon={faImage} scale="2xl" />
    {/if}

    {#if loadingImage}<LoadingOverlay />{/if}
  </div>

  <CapitionPane
    {selectedPath}
    {horizontal}
    bind:unsavedPaths
    on:next={event.bind(null, ["next"])}
    on:previous={event.bind(null, ["previous"])}
  />
</main>
