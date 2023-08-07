<script lang="ts" context="module">
  export type CaptionEvents = {
    next: null;
    previous: null;
  };
</script>

<script lang="ts">
  import { faBackward, faForward, faSave, faUndo } from "@fortawesome/free-solid-svg-icons";
  import { readTextFile } from "@tauri-apps/api/fs";
  import { createEventDispatcher } from "svelte";
  import Fa from "svelte-fa";
  import LoadingOverlay from "./LoadingOverlay.svelte";
  import Scaler from "./Scaler.svelte";

  export let selectedPath: string | null = null;
  export let unsavedFiles: string[] = [];
  export let horizontal = false;

  let ref: HTMLElement;
  let size = 100;

  const captionCache = new Map<string, string>();
  const event = createEventDispatcher<CaptionEvents>();
  $: captionPath = selectedPath ? selectedPath.split(".").slice(0, -1).join(".") + ".txt" : "";
  let loadedCaption = "";
  let lastPath = selectedPath;
  let newCaption = loadedCaption;
  let loadingCaption = false;

  $: {
    selectedPath; // Dependency
    unsavedFiles = Array.from(captionCache.keys());
  }

  $: if (selectedPath) {
    // Save state
    if (loadedCaption) captionCache.set(lastPath, loadedCaption);

    // Set new state
    lastPath = selectedPath;
    loadedCaption = captionCache.get(selectedPath) ?? "";

    // Start loading
    loadingCaption = !loadedCaption;

    if (!loadedCaption) {
      readTextFile(captionPath)
        .then((result) => {
          loadedCaption = result;
        })
        .catch(() => {
          loadedCaption = "";
        })
        .finally(() => (loadingCaption = false));
    }
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
    <button class="w-1/2 bg-zinc-800 p-2 hover:bg-zinc-700" on:click={() => event("previous")}>
      <Fa icon={faBackward} class="mr-2 inline-block" />
      Previous
    </button>
    <button class="bg-zinc-800 p-2 hover:bg-zinc-700">
      <Fa icon={faUndo} class="mr-2 inline-block" />
      Reset
    </button>
    <button class="w-full bg-zinc-800 p-2 hover:bg-zinc-700">
      <Fa icon={faSave} class="mr-2 inline-block" />
      Save
    </button>
    <button class="w-1/2 bg-zinc-800 p-2 hover:bg-zinc-700" on:click={() => event("next")}>
      Next
      <Fa icon={faForward} class="ml-2 inline-block" />
    </button>
  </div>
</div>
