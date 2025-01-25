<script>
    let { children } = $props();
</script>

<div data-sveltekit-reload>
    {@render children()}
</div>

<style lang="postcss">
    /*p {
        font-family: "Ubuntu Mono";
    }
    h1 {
        font-family: "Ubuntu Mono";
    }*/

    :global(body, html) {
        margin: 0;
        height: 100%;
        overflow: auto;
    }

    /*:global(body)::before {
        filter: blur(50);
    }

    :global(body) {
        //background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 100% 100%;
        //animation: gradient 15s ease infinite;
        height: 100vh;
        transition: all 1000ms linear;
    }*/
</style>
