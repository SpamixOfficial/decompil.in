<script>
    let { children } = $props();
</script>

{@render children()}

<style lang="scss">
    :global(p) {
        font-family: "Ubuntu Mono";
    }
    :global(h1) {
        font-family: "Ubuntu Mono";
    }

    :global(html, body) {
        font-family: "Ubuntu Mono";
        color: white;
        margin: 0;
        height: 100%;
        overflow: hidden;
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
