<script>
    let { mobile, children, width, height, style } = $props();
    import { draggable } from "@neodrag/svelte";
    let terminalWindowClass = $state(true);
    let terminalMobileClass = $state(false);
    if (mobile == "true") {
        terminalMobileClass = true;
        terminalWindowClass = false;
    }
    let terminalWindow;
</script>

{#if mobile == "true"}
    <div class:terminalMobileClass style="--width: {width}; --height: {height}; {style}">
        {@render children()}
    </div>
{:else}
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
        style="--width: {width}; --height: {height}; {style}"
    >
        {@render children()}
    </div>
{/if}

<style>
    p {
        font-family: "Ubuntu Mono";
    }
    h1 {
        font-family: "Ubuntu Mono";
    }

    html,
    body {
        all: initial;
        font-family: "Ubuntu Mono";
        color: white;
        margin: 0;
        height: 100%;
        overflow: hidden;
    }

    .terminalWindowClass {
        background-color: rgba(44, 52, 58, 0.753);
        border-radius: 15px;
        border-width: 2px;
        border-style: solid;
        border-color: var(--terminalBorderColor);
        box-shadow: 0px 0px 15px 0px var(--terminalBorderColor);
        width: var(--width);
        height: var(--height);
        text-overflow: ellipsis;
        overflow: auto;
        cursor: move;
        margin: 5px;
        padding: 5px;
        display: block;
    }

    .terminalMobileClass {
        background-color: rgba(44, 52, 58, 0.753);
        border-radius: 15px;
        border-width: 2px;
        border-style: solid;
        border-color: var(--terminalBorderColor);
        width: calc(var(--width) - 24px);
        height: calc(var(--height) - 24px);
        text-overflow: ellipsis;
        overflow: auto;
        cursor: move;
        margin: 5px;
        padding: 5px;
        display: block;
    }
</style>
