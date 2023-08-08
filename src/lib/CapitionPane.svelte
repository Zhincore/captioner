<script lang="ts">
  import { faBackward, faForward, faSave, faUndo } from "@fortawesome/free-solid-svg-icons";
  import { filesystem } from "@neutralinojs/lib";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import LoadingOverlay from "./LoadingOverlay.svelte";
  import Scaler from "./Scaler.svelte";
  import { appEvents } from "./events";
  import { getCaptionPath } from "./files";

  export let selectedPath: string | null = null;
  export let unsavedPaths: string[] = [];
  export let horizontal = false;

  let ref: HTMLElement;
  let size = 100;

  const captionCache = new Map<string, string>();
  $: captionPath = selectedPath ? getCaptionPath(selectedPath) : "";
  let loadedCaption = "";
  let lastPath = selectedPath;
  let loadingCaption = false;

  function reset() {
    newCaption = loadedCaption;
  }

  function save() {
    loadingCaption = true;
    filesystem
      .writeFile(captionPath, newCaption)
      .then(() => (loadedCaption = newCaption))
      .finally(() => (loadingCaption = false));
  }

  onMount(() => {
    const saveAll = async () => {
      const promises = [];
      for (const [imgPath, caption] of captionCache) {
        promises.push(filesystem.writeFile(getCaptionPath(imgPath), caption));
      }
      captionCache.clear();
      loadedCaption = newCaption;
      unsavedPaths = Array.from(captionCache.keys());
      return Promise.all(promises);
    };

    appEvents.on("saveAllFiles", saveAll);

    return () => {
      appEvents.off("saveAllFiles", saveAll);
    };
  });

  // Store state
  $: {
    if (newCaption && newCaption != loadedCaption) {
      captionCache.set(lastPath, newCaption);
    } else {
      captionCache.delete(lastPath);
    }
    unsavedPaths = Array.from(captionCache.keys());
  }

  $: if (selectedPath) {
    // Set new state
    lastPath = selectedPath;
    newCaption = "";

    // Start loading
    loadingCaption = true;
    filesystem
      .readFile(captionPath)
      .then((result) => {
        loadedCaption = result;
      })
      .catch(() => {
        loadedCaption = "";
      })
      .finally(() => (loadingCaption = false));
  } else {
    loadedCaption = "";
  }
  $: newCaption = captionCache.get(lastPath) ?? loadedCaption;

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
    <button
      class="w-1/2 bg-zinc-800 p-2 transition hover:bg-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500"
      disabled={!selectedPath}
      on:click={() => appEvents.emit("prevFile")}
    >
      <Fa icon={faBackward} class="mr-2 inline-block" />
      Previous
    </button>
    <button
      class="bg-zinc-800 p-2 transition hover:bg-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500"
      on:click={reset}
      disabled={!selectedPath || newCaption == loadedCaption}
    >
      <Fa icon={faUndo} class="mr-2 inline-block" />
      Reset
    </button>
    <button
      class="w-full bg-zinc-800 p-2 transition hover:bg-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500"
      on:click={save}
      disabled={!selectedPath || newCaption == loadedCaption}
    >
      <Fa icon={faSave} class="mr-2 inline-block" />
      Save
    </button>
    <button
      class="w-1/2 bg-zinc-800 p-2 transition hover:bg-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500"
      disabled={!selectedPath}
      on:click={() => appEvents.emit("nextFile")}
    >
      Next
      <Fa icon={faForward} class="ml-2 inline-block" />
    </button>
  </div>
</div>
