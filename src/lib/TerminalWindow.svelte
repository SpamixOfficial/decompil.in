<script>
    let { children, width, height } = $props();
    import { draggable } from "@neodrag/svelte";
    let terminalWindowClass = $state(true);
    let terminalWindow;
</script>

<div
    use:draggable={{
        bounds: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
        },
        gpuAcceleration: true,
    }}
    class:terminalWindowClass
    bind:this={terminalWindow}
    style="--width: {width}; --height: {height}"
>
    {@render children()}
</div>

<style>
    .terminalWindowClass {
        background-color: rgba(44, 52, 58, 0.753);
        border-radius: 15px;
        border-width: 2px;
        border-style: solid;
        border-color: var(--terminalBorderColor);
        width: var(--width);
        height: var(--height);
        text-overflow: ellipsis;
        overflow: auto;
        cursor: move;
        margin: 5px;
        padding: 5px;
        display: inline-block;
    }
</style>
