<script>
    import { fly } from "svelte/transition";
    import CtfCard from "./CtfCard.svelte";
    import Leaderboard from "./Leaderboard.svelte";
    import Guides from "./Guides.svelte";
    let { currentPage, challs, leaderboard, guideId, user, signedIn } = $props();
    let transitionDuration = 200;
</script>

{#if currentPage == 0}
    <div
        in:fly={{ x: -200, delay: transitionDuration, duration: transitionDuration }}
        out:fly={{ x: -200, duration: transitionDuration }}
        class="h-1 grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:grid-cols-1 grid-flow-row-dense gap-1 items-start"
    >
        {#each challs as chall}
            <CtfCard
                id={chall.id}
                files={chall.files}
                score={chall.score}
                title={chall.title}
                description={chall.description}
                solved={chall.solved}
            />
        {/each}
    </div>
{:else if currentPage == 1}
    <div
        in:fly={{ x: 200, delay: transitionDuration, duration: transitionDuration }}
        out:fly={{ x: 200, duration: transitionDuration }}
    >
        <Leaderboard {leaderboard} />
    </div>
{:else}
    <div
        in:fly={{ x: 200, delay: transitionDuration, duration: transitionDuration }}
        out:fly={{ x: 200, duration: transitionDuration }}
    >
        <Guides {challs} {user} {guideId} {signedIn}/>
    </div>
{/if}
