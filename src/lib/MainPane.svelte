<script lang="ts">
  import { convertFileSrc } from "@tauri-apps/api/tauri";
  import Scaler from "./Scaler.svelte";
  import Fa from "svelte-fa";
  import { faImage } from "@fortawesome/free-solid-svg-icons";
  import { readTextFile } from "@tauri-apps/api/fs";
  import LoadingOverlay from "./LoadingOverlay.svelte";

  const captionCache = new Map<string, string>();

  export let selectedPath: string | null = null;
  export let unsavedFiles: string[] = [];
  $: captionPath = selectedPath ? selectedPath.split(".").slice(0, -1).join(".") + ".txt" : "";

  let caption = "";

  let loadingCaption = false;
  let loadingImage = false;

  let img: HTMLImageElement | null = null;
  let ref: HTMLElement;
  let horizontal = false;
  let size = 100;

  $: if (selectedPath) {
    // Save state
    if (caption) captionCache.set(selectedPath, caption);

    // Set new state
    caption = captionCache.get(selectedPath) ?? "";

    // Start loading
    loadingImage = true;
    loadingCaption = !caption;

    if (!caption) {
      readTextFile(captionPath)
        .then((result) => {
          caption = result;
        })
        .catch((err) => {
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
    class="relative h-full min-h-[4rem] w-full"
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
  </div>
</main>
