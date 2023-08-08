<script lang="ts">
  import { os } from "@neutralinojs/lib";
  import MainPane from "./lib/MainPane.svelte";
  import SidePane from "./lib/SidePane.svelte";
  import { appEvents } from "./lib/events";

  let path: string | null = import.meta.hot?.data.folder ?? null;
  let selectedPath: string | null = null;
  let unsavedPaths: string[];

  // Save state before hot reload
  $: if (import.meta.hot && path) import.meta.hot.data.folder = path;

  async function openFolder() {
    path = await os.showFolderDialog();
  }

  async function onKeyDown(ev: KeyboardEvent) {
    let acted = true;
    switch (ev.key) {
      case "ArrowUp":
        appEvents.emit("prevFile");
        break;
      case "ArrowDown":
        appEvents.emit("nextFile");
        break;
      default:
        acted = false;
    }
    if (acted) ev.preventDefault();
  }
  async function onKeyDownCapture(ev: KeyboardEvent) {
    if (ev.ctrlKey && ev.key == "s") {
      appEvents.emit("saveFile");
      ev.preventDefault();
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} on:keydown|capture={onKeyDownCapture} />

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
