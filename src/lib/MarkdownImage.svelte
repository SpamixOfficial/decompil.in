<script>
    export let href = "";
    export let title = undefined;
    export let text = "";

    let cref =
        window["bota"["split"]("")["reverse"]()["join"]("")](
            "L3NlY3JldC9jdGY="
        );
</script>

{#if href == "https://giffla.re/gifflar.png"}
    <a href={cref} style="cursor: unset;"
        ><img src={href} {title} alt={text} /></a
    >
{:else}
    <img src={href} {title} alt={text} />
{/if}
