<script lang="ts">
  import { faCaretDown, faCaretLeft, faFolder, faImage } from "@fortawesome/free-solid-svg-icons";
  import type { FileEntry } from "@tauri-apps/api/fs";
  import Fa from "svelte-fa";

  const allowedExtensions = ["png", "jpg", "jpeg", "webp"];

  export let files: FileEntry[];
  export let level = 0;
  export let selectedPath: string | null = null;
  let classes = "";
  export { classes as class };

  let openFolders: string[] = [];

  function getClickHandler(file: FileEntry) {
    // Folder handler
    if (file.children) {
      return () => {
        const index = openFolders.indexOf(file.path);
        if (index == -1) openFolders = [...openFolders, file.path];
        else openFolders = [...openFolders.slice(0, index), ...openFolders.slice(index + 1)];
      };
    }
    // Image handler
    return () => (selectedPath = file.path == selectedPath ? null : file.path);
  }

  $: filtered = files
    .filter((file) => file.children || allowedExtensions.includes(file.name.split(".").slice(-1)[0]))
    .sort((a, b) => {
      const folders = +!!b.children - +!!a.children;
      if (folders) return folders;
      return a.name.localeCompare(b.name);
    });
</script>

<ul class={"h-full border-zinc-600 " + classes} class:overflow-auto={!level} class:ml-4={level} class:border-l={level}>
  {#each filtered as file (file.path)}
    {@const isOpen = openFolders.includes(file.path)}
    <li>
      <button
        class={"flex w-full items-center whitespace-nowrap bg-opacity-50 px-2 py-1 hover:bg-zinc-800" +
          (selectedPath?.startsWith(file.path) ? " -ml-px border-l border-accent text-accent" : "")}
        on:click={getClickHandler(file)}
      >
        <Fa icon={file.children ? faFolder : faImage} class="mr-2 inline-block" />
        <span>{file.name}</span>

        {#if file.children}
          <Fa icon={openFolders.includes(file.path) ? faCaretDown : faCaretLeft} class="ml-auto inline-block" />
        {/if}
      </button>

      {#if file.children && isOpen}
        <svelte:self files={file.children} bind:selectedPath level={level + 1} />
      {/if}
    </li>
  {/each}
</ul>
