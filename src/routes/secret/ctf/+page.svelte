<script>

    import CtfCard from "./CtfCard.svelte";

    let challs = [
        {
            title: "Oh my",
            description:
                "A masterhacker has figured out how to access our secret page, but we haven't! Can you find it?",
        },
    ];
</script>

{#each challs as chall}
    <CtfCard title={chall.title} description={chall.description} />
{/each}
