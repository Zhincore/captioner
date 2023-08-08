<script lang="ts">
  import { faBackward, faForward, faSave, faUndo } from "@fortawesome/free-solid-svg-icons";
  import { filesystem } from "@neutralinojs/lib";
  import Fa from "svelte-fa";
  import LoadingOverlay from "./LoadingOverlay.svelte";
  import Scaler from "./Scaler.svelte";
  import { appEvents } from "./events";

  export let selectedPath: string | null = null;
  export let unsavedPaths: string[] = [];
  export let horizontal = false;

  let ref: HTMLElement;
  let size = 100;

  const captionCache = new Map<string, string>();
  $: captionPath = selectedPath ? selectedPath.split(".").slice(0, -1).join(".") + ".txt" : "";
  let loadedCaption = "";
  let lastPath = selectedPath;
  let loadingCaption = false;

  async function loadCaption() {
    loadingCaption = true;

    return filesystem
      .readFile(captionPath)
      .then((result) => {
        loadedCaption = result;
      })
      .catch(() => {
        loadedCaption = "";
      })
      .finally(() => (loadingCaption = false));
  }

  function reset() {
    loadCaption();
    newCaption = loadedCaption;
  }

  // Store state
  $: if (newCaption && newCaption != loadedCaption) {
    captionCache.set(lastPath, newCaption);
    unsavedPaths = Array.from(captionCache.keys());
  } else captionCache.delete(lastPath);

  $: if (selectedPath) {
    // Set new state
    lastPath = selectedPath;
    newCaption = "";

    const cached = captionCache.get(selectedPath);
    loadedCaption = cached ?? "";

    // Start loading
    if (!cached) loadCaption();
  } else {
    loadedCaption = "";
  }
  $: newCaption = loadedCaption;

  $: ready = selectedPath && !loadingCaption;
</script>

<div
  bind:this={ref}
  class="relative flex h-full min-h-[8rem] w-full flex-col"
  style="{horizontal ? 'width' : 'height'}: {size ? size + 'px' : 'unset'}"
>
  <Scaler reference={ref} bind:size direction="top" />

  {#if loadingCaption}<LoadingOverlay />{/if}

  <textarea
    class="h-full w-full resize-none bg-black bg-opacity-50 px-2 py-1 text-white placeholder:text-zinc-600 disabled:opacity-50"
    disabled={!ready}
    placeholder={selectedPath ? "A photo of an image with a caption" : "Choose an image in the left panel"}
    bind:value={newCaption}
  />

  <div class="flex gap-1 whitespace-nowrap">
    <button class="w-1/2 bg-zinc-800 p-2 hover:bg-zinc-700" on:click={() => appEvents.emit("prevFile")}>
      <Fa icon={faBackward} class="mr-2 inline-block" />
      Previous
    </button>
    <button class="bg-zinc-800 p-2 hover:bg-zinc-700" on:click={reset}>
      <Fa icon={faUndo} class="mr-2 inline-block" />
      Reset
    </button>
    <button class="w-full bg-zinc-800 p-2 hover:bg-zinc-700">
      <Fa icon={faSave} class="mr-2 inline-block" />
      Save
    </button>
    <button class="w-1/2 bg-zinc-800 p-2 hover:bg-zinc-700" on:click={() => appEvents.emit("nextFile")}>
      Next
      <Fa icon={faForward} class="ml-2 inline-block" />
    </button>
  </div>
</div>
