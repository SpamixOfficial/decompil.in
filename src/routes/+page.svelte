<script>
    import Desktop from "./Desktop.svelte";
    import { browser } from "$app/environment";
    import Mobile from "./Mobile.svelte";

    let phone = $state(false);

    if (browser) {
        window.addEventListener("resize", () => {
            phone = window.innerWidth < 750 || window.innerHeight < 600;
        });

        phone = window.innerWidth < 750 || window.innerHeight < 600;
    }
</script>
{#if !phone}
    <Desktop />
{:else}
    <Mobile />
{/if}