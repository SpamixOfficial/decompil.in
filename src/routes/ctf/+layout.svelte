<script>
    let { children } = $props();
    import "./tailwind.css"
</script>

<svelte:head>
    <title>Decompil.CTF</title>
</svelte:head>

{@render children()}

<style lang="postcss">
    :global(html, body) {
        overflow: auto;
    }
</style>
