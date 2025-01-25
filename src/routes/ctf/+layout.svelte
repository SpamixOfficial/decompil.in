<script>
    let { children } = $props();
    import "./tailwind.css"
</script>

{@render children()}

<style lang="postcss">
    :global(html, body) {
        overflow: auto;
    }
</style>
