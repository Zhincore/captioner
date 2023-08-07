<script lang="ts">
  import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
  import type { FileEntry } from "@tauri-apps/api/fs";
  import Fa from "svelte-fa";
  import FileTree from "./FileTree.svelte";
  import Scaler from "./Scaler.svelte";

  export let folder = "";
  export let files: FileEntry[];
  export let openFolder: () => void;
  export let selectedPath: string | null = null;

  let ref: HTMLElement;
  let width = 0;
</script>

<side
  bind:this={ref}
  class="relative flex h-full w-1/3 flex-col bg-black bg-opacity-25"
  style:width={width ? width + "px" : ""}
>
  <header class="flex w-full items-center border-b-2 border-zinc-900 ">
    <button class="px-4 py-2 hover:bg-zinc-800 " on:click={openFolder}>
      <Fa icon={faFolderOpen} class="mr-3 inline-block" />

      <span class="max-w-full whitespace-nowrap">{folder.split("/").slice(-1)[0]}</span>
    </button>
  </header>

  <FileTree {files} bind:selectedPath class="mr-2" />

  <Scaler bind:size={width} reference={ref} direction="right" />
</side>
