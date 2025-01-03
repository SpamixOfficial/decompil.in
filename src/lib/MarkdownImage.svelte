<script>
    export let href = "";
    export let title = undefined;
    export let text = "";

    let cref =
        window["bota"["split"]("")["reverse"]()["join"]("")](
            "L3NlY3JldC9jdGY="
        );
    let craf = window["bota"["split"]("")["reverse"]()["join"]("")](
        "aHR0cHM6Ly9naWZmbGEucmUvZ2lmZmxhci5wbmc="
    );
</script>

{#if href == craf}
    <a
        href={cref}
        class="thingy"
        data-sveltekit-preload-data="off"
        data-sveltekit-preload-code="off"
        ><img src={href} {title} alt={text} /></a
    >
{:else}
    <img src={href} {title} alt={text} />
{/if}

<style>
    .thingy {
        cursor: unset;
        animation-duration: 300ms;
        animation-iteration-count: infinite;
        animation-name: do-funny;
    }

    .thingy img {
        animation-duration: 1s;
        animation-delay: 2s;
        animation-iteration-count: infinite;
        animation-name: do-funny-2;
    }

    @keyframes do-funny {
        from {
            cursor: nesw-resize;
        }
        to {
            cursor: nwse-resize;
        }
    }

    @keyframes do-funny-2 {
        12.5%,
        37.5% {
            transform: scale(1, 1);
        }
        25% {
            transform: scale(1, 0.7);
        }
        50%,
        75% {
            transform: scale(1, 1);
        }
        62.5% {
            transform: scale(1, 0.7);
        }
    }
</style>
