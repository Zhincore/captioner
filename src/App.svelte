<script lang="ts">
  import { open } from "@tauri-apps/api/dialog";
  import { convertFileSrc } from "@tauri-apps/api/tauri";
  import { readDir, type FileEntry } from "@tauri-apps/api/fs";
  import SidePane from "./lib/SidePane.svelte";
  import MainPane from "./lib/MainPane.svelte";
  import Fa from "svelte-fa";
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";
  import LoadingOverlay from "./lib/LoadingOverlay.svelte";
  import { tick } from "svelte";

  let folder: string | null = import.meta.hot?.data.folder ?? null;
  let files: FileEntry[] = [];
  let selectedPath: string | null = null;
  let loading = true;
  let error = "";

  // Save state before hot reload
  $: if (import.meta.hot && folder) import.meta.hot.data.folder = folder;

  async function openFolder() {
    folder = (await open({
      multiple: false,
      directory: true,
      recursive: true,
    })) as string;
  }

  $: if (folder) {
    error = "";
    loading = true;
    readDir(folder, { recursive: true })
      .then((result) => {
        files = result;
      })
      .catch((err) => (error = err.toString()))
      .finally(() => (loading = false));
  }
</script>

{#if !folder}
  <button on:click={openFolder} class="absolute inset-0 block">
    <div class="text-2xl font-bold text-zinc-500">Click to choose folder</div>
    {#if error}<div>{error}</div>{/if}
  </button>
{:else}
  {#if loading}
    <LoadingOverlay />
  {/if}
  {#if error}<div>{error}</div>{/if}

  <div class="flex h-screen w-screen">
    <SidePane {folder} {files} {openFolder} bind:selectedPath />

    <MainPane {selectedPath} />
  </div>
{/if}
