<script>
    import Desktop from "./Desktop.svelte";
    import { browser } from "$app/environment";
    import Mobile from "./Mobile.svelte";

    let phone = $state(false);

    if (browser) {
        window.addEventListener("resize", () => {
            phone = window.innerWidth < 768 || window.innerHeight < 812;
        });

        phone = window.innerWidth < 768 || window.innerHeight < 812;
    }
</script>

{#if !phone}
    <Desktop />
{:else}
    <Mobile />
{/if}