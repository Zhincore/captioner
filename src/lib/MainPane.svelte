<script lang="ts">
  import { faImage } from "@fortawesome/free-solid-svg-icons";
  import { filesystem } from "@neutralinojs/lib";
  import { tick } from "svelte";
  import Fa from "svelte-fa";
  import CapitionPane from "./CapitionPane.svelte";
  import LoadingOverlay from "./LoadingOverlay.svelte";

  export let selectedPath: string | null = null;
  export let unsavedPaths: string[] = [];

  let imageUrl: string | null = null;
  let img: HTMLImageElement | null = null;

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

<main class="flex h-full flex-grow flex-col gap-2 p-2">
  <div class="relative flex h-1/4 max-h-full flex-grow items-center justify-center bg-black bg-opacity-25">
    {#if imageUrl}
      <img bind:this={img} on:load={onLoad} src={imageUrl} alt="" class="h-auto max-h-full w-full object-contain" />
    {:else}
      <Fa icon={faImage} scale="2xl" />
    {/if}

    {#if loadingImage}<LoadingOverlay />{/if}
  </div>

  <CapitionPane {selectedPath} bind:unsavedPaths />
</main>
