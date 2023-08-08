<script lang="ts">
  import { os } from "@neutralinojs/lib";
  import MainPane from "./lib/MainPane.svelte";
  import SidePane from "./lib/SidePane.svelte";

  let path: string | null = import.meta.hot?.data.folder ?? null;
  let selectedPath: string | null = null;
  let unsavedPaths: string[];

  // Save state before hot reload
  $: if (import.meta.hot && path) import.meta.hot.data.folder = path;

  async function openFolder() {
    path = await os.showFolderDialog();
  }

  // function selectSibling(direction: 1 | -1) {
  //   if (!selectedPath) return;

  //   const index = filterFiles(files).findIndex((v) => v.entry == selectedPath);
  //   if (index == -1) return;

  //   selectedPath = files[(files.length + (index + direction)) % files.length].entry;
  // }
</script>

{#if !path}
  <button on:click={openFolder} class="fixed inset-0 flex h-full w-full items-center justify-center">
    <div class="text-2xl font-bold text-zinc-500">Click to choose folder</div>
  </button>
{:else}
  <div class="flex h-screen w-screen">
    <SidePane {path} {openFolder} {unsavedPaths} bind:selectedPath />

    <MainPane {selectedPath} bind:unsavedPaths />
  </div>
{/if}
