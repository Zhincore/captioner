<script lang="ts">
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
</script>

<div class="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25">
  <Fa icon={faSpinner} spin scale="4x" />
</div>
