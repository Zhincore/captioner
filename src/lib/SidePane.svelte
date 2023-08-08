<script lang="ts">
  import { faFolderOpen, faSave } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import FileTree from "./FileTree.svelte";
  import Scaler from "./Scaler.svelte";

  export let path = "";
  export let openFolder: () => void;
  export let selectedPath: string | null = null;
  export let unsavedPaths: string[] = [];

  let ref: HTMLElement;
  let width = 0;
</script>

<side
  bind:this={ref}
  class="relative flex h-full w-2/5 flex-col bg-black bg-opacity-25"
  style:width={width ? width + "px" : ""}
>
  <header class="flex w-full items-center whitespace-nowrap border-b-2 border-zinc-900">
    <button class="w-full px-4 py-2 hover:bg-zinc-800" on:click={openFolder}>
      <Fa icon={faFolderOpen} class="mr-3 inline-block" />

      Change folder
    </button>

    <button class="w-full px-4 py-2 hover:bg-zinc-800" class:invisible={!unsavedPaths.length} on:click={openFolder}>
      <Fa icon={faSave} class="mr-3 inline-block" />

      Save {unsavedPaths.length} files
    </button>
  </header>

  <FileTree {path} {unsavedPaths} bind:selectedPath class="mr-2" />

  <Scaler bind:size={width} reference={ref} direction="right" />
</side>
