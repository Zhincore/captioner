<script lang="ts">
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";
  import { fade } from "svelte/transition";
  import Fa from "svelte-fa";
</script>

<div
  transition:fade={{ duration: 250 }}
  class="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25"
>
  <Fa icon={faSpinner} spin scale="4x" />
</div>
