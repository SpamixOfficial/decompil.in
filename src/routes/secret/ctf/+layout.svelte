<script>
    let { children } = $props();
    import "./tailwind.css"
</script>

{@render children()}

<style lang="postcss">
    :global(html, body, h1, p) {
        all: initial;
    }
</style>
