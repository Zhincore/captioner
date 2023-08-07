<script lang="ts">
  import { faBackward, faForward, faImage, faSave, faUndo } from "@fortawesome/free-solid-svg-icons";
  import { readTextFile } from "@tauri-apps/api/fs";
  import { convertFileSrc } from "@tauri-apps/api/tauri";
  import { createEventDispatcher, tick } from "svelte";
  import Fa from "svelte-fa";
  import LoadingOverlay from "./LoadingOverlay.svelte";
  import Scaler from "./Scaler.svelte";

  const captionCache = new Map<string, string>();
  const event = createEventDispatcher<{
    next: null;
    previous: null;
  }>();

  export let selectedPath: string | null = null;
  export let unsavedFiles: string[] = [];
  $: captionPath = selectedPath ? selectedPath.split(".").slice(0, -1).join(".") + ".txt" : "";

  let lastPath = selectedPath;
  let caption = "";

  let loadingCaption = false;
  let loadingImage = false;

  let img: HTMLImageElement | null = null;
  let ref: HTMLElement;
  let horizontal = false;
  let size = 100;

  $: {
    selectedPath; // Dependency
    unsavedFiles = Array.from(captionCache.keys());
  }

  $: if (selectedPath) {
    // Save state
    if (caption) captionCache.set(lastPath, caption);

    // Set new state
    lastPath = selectedPath;
    caption = captionCache.get(selectedPath) ?? "";

    // Start loading
    loadingImage = true;
    loadingCaption = !caption;

    tick().then(() => {
      if (img?.complete) loadingImage = true;
    });

    if (!caption) {
      readTextFile(captionPath)
        .then((result) => {
          caption = result;
        })
        .catch(() => {
          caption = "";
        })
        .finally(() => (loadingCaption = false));
    }
  } else {
    caption = "";
  }

  $: ready = selectedPath && !loadingCaption;
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
        on:load={() => (loadingImage = false)}
        class="h-full w-auto object-contain"
        src={convertFileSrc(selectedPath)}
        alt=""
      />
    {:else}
      <Fa icon={faImage} scale="2xl" />
    {/if}

    {#if loadingImage}<LoadingOverlay />{/if}
  </div>

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
      bind:value={caption}
    />

    <div class="flex gap-1">
      <button class="-mt-1 w-1/2 bg-zinc-800 p-2 hover:bg-zinc-700" on:click={() => event("previous")}>
        <Fa icon={faBackward} class="mr-2 inline-block" />
        Previous
      </button>
      <button class="-mt-1 w-1/2 bg-zinc-800 p-2 hover:bg-zinc-700">
        <Fa icon={faUndo} class="mr-2 inline-block" />
        Reset
      </button>
      <button class="-mt-1 w-full bg-zinc-800 p-2 hover:bg-zinc-700">
        <Fa icon={faSave} class="mr-2 inline-block" />
        Save
      </button>
      <button class="-mt-1 w-1/2 bg-zinc-800 p-2 hover:bg-zinc-700" on:click={() => event("next")}>
        Next
        <Fa icon={faForward} class="ml-2 inline-block" />
      </button>
    </div>
  </div>
</main>
