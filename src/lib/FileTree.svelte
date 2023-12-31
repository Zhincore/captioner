<script lang="ts">
  import { faAsterisk, faCaretDown, faCaretLeft, faFolder, faImage } from "@fortawesome/free-solid-svg-icons";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import LoadingOverlay from "./LoadingOverlay.svelte";
  import { appEvents } from "./events";
  import { loadFiles, type FileEntry } from "./files";

  export let path = "";
  export let level = 0;
  export let selectedPath: string | null = null;
  export let unsavedPaths: string[] = [];
  let classes = "";
  export { classes as class };

  let items: Record<string, HTMLButtonElement> = {};
  let openFolders: string[] = [];
  let files: FileEntry[] = [];
  let error = "";
  let loading = true;

  function getClickHandler(file: FileEntry) {
    // Folder handler
    if (file.isDirectory) {
      return () => {
        const index = openFolders.indexOf(file.path);
        if (index == -1) openFolders = [...openFolders, file.path];
        else openFolders = [...openFolders.slice(0, index), ...openFolders.slice(index + 1)];
      };
    }
    // Image handler
    return () => (selectedPath = file.path == selectedPath ? null : file.path);
  }

  function selectSibling(direction: 1 | -1) {
    if (!selectedPath || !selectedPath.startsWith(path)) return;

    const index = files.findIndex((v) => v.path == selectedPath);
    if (index == -1) return;

    selectedPath = files[(files.length + (index + direction)) % files.length].path;
  }

  onMount(() => {
    const onNext = () => selectSibling(1);
    const onPrev = () => selectSibling(-1);
    appEvents.on("nextFile", onNext);
    appEvents.on("prevFile", onPrev);

    return () => {
      appEvents.off("nextFile", onNext);
      appEvents.off("prevFile", onPrev);
    };
  });

  $: if (path) {
    error = "";

    if (level) {
      loading = true;
      openFolders = [];
      loadFiles(path)
        .then((result) => (files = result))
        .catch((err) => (error = err.toString()))
        .finally(() => (loading = false));
    } else {
      loading = false;
      openFolders = [path];
      files = [
        {
          ext: "",
          isDirectory: true,
          name: path.split("/").slice(-1)[0],
          path,
        },
      ];
    }
  }
</script>

<ul
  class={"relative h-full border-zinc-600 " + classes}
  class:overflow-auto={!level}
  class:ml-4={level}
  class:border-l={level}
>
  {#if loading}<LoadingOverlay />{/if}

  {#each files as file (file.path)}
    {@const isOpen = openFolders.includes(file.path)}
    <li>
      <button
        bind:this={items[file.path]}
        class={[
          "relative -ml-px flex w-full items-center whitespace-nowrap border-l border-transparent bg-opacity-50 px-4 py-1 transition hover:bg-zinc-800",
          unsavedPaths.some((v) => v.startsWith(file.path)) ? "!border-modified text-modified" : "",
          selectedPath?.startsWith(file.path) ? "!border-accent !text-accent" : "",
        ].join(" ")}
        on:click={getClickHandler(file)}
      >
        {#if unsavedPaths.includes(file.path)}
          <Fa icon={faAsterisk} class="absolute left-2 top-0 text-modified" />
        {/if}

        <Fa icon={file.isDirectory ? faFolder : faImage} class="mr-2 inline-block" />
        <span>{file.name}</span>

        {#if file.isDirectory}
          <Fa icon={isOpen ? faCaretDown : faCaretLeft} class="ml-auto inline-block" />
        {/if}
      </button>

      {#if file.isDirectory && isOpen}
        <svelte:self {unsavedPaths} path={file.path} bind:selectedPath level={level + 1} />
      {/if}
    </li>
  {/each}
</ul>
