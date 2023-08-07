<script lang="ts">
  import { faGripHorizontal, faGripVertical } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  type Direction = "top" | "right" | "bottom" | "left";

  export let size: number;
  export let container: HTMLElement = document.body;
  export let reference: HTMLElement;
  export let direction: Direction;
  let classes = "";
  export { classes as class };

  $: verticalDesign = direction == "left" || direction == "right";
  $: verticalSliding = !verticalDesign;

  let dragging = false;

  function onMouseMove(ev: MouseEvent) {
    if (!dragging) return;

    switch (direction) {
      case "top":
        size = container.clientHeight - ev.clientY;
        break;
      case "right":
        size = ev.pageX - reference.clientLeft;
        break;
      case "bottom":
        size = ev.pageY - reference.clientTop;
        break;
      case "left":
        size = ev.pageY - reference.clientTop;
        break;
    }
  }
</script>

<svelte:window on:mouseup={() => (dragging = false)} on:mousemove={onMouseMove} />

<div
  role="presentation"
  on:mousedown|preventDefault={() => (dragging = true)}
  class={[
    "absolute z-40 flex transform items-center justify-center opacity-50",
    {
      top: "bottom-full",
      right: "left-full",
      bottom: "top-full",
      left: "right-full",
    }[direction],
    [
      // Horizontal
      "left-0 h-2 w-full cursor-row-resize",
      // Vertical
      "top-0 h-full w-2 cursor-col-resize flex-col",
    ][+verticalDesign],
    classes,
  ].join(" ")}
>
  <Fa icon={verticalDesign ? faGripVertical : faGripHorizontal} scale="1" />
</div>
