<script>
    import { Api } from "$lib/api";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Icon from "@iconify/svelte";
    import GuideEditor from "./GuideEditor.svelte";

    let { challs, guideId, user, signedIn } = $props();

    let isGuideOnDisplay = $state(false);
    let isGuideTable = $state(false);
    let editorOpen = $state(false);
    let chosenChallenge = $state(0);
    let chosenChallengeTitle = $state("Initial challenge");
    let guides = $state([
        {
            id: 1,
            body: "A body",
            userId: "12345678",
            createdAt: "idk",
        },
    ]);
    let chosenGuide = $state({
        id: 1,
        body: "A body",
        userId: "12345678",
        createdAt: "idk",
    });

    onMount(async () => {
        if (guideId !== null) {
            let response = await Api.getGuide(guideId);
            if (response.success === true) {
                chosenGuide = response.data;
                isGuideOnDisplay = true;
            }
        }
    });
</script>

{#if !isGuideOnDisplay}
    <!-- svelte-ignore a11y_missing_attribute -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    {#if !isGuideTable}
        <div class="hero bg-base-200 min-h-screen" transition:fade>
            <div class="hero-content text-center">
                <div class="max-w-md">
                    <h1 class="text-5xl font-bold">Welcome to the guides!</h1>
                    <p class="py-6">Choose a challenge down below to view the available guides/writeups!</p>
                    <div class="dropdown">
                        <div tabindex="0" role="button" class="btn btn-primary m-1">Choose a challenge</div>
                        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            {#each challs as chall}
                                <li>
                                    <a
                                        onclick={async () => {
                                            isGuideTable = true;
                                            chosenChallenge = chall.id;
                                            chosenChallengeTitle = chall.title;
                                            guides = (await Api.loadAllChallGuides(chosenChallenge)).data;
                                        }}>{chall.title}</a
                                    >
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <!--TODO: Add guide submission-->
        <div class="flex h-12 p-5 mt-2 justify-between items-center">
            <p class="text-2xl font-bold">"{chosenChallengeTitle}" - Guides</p>
            <div class="flex justify-end gap-2">
                <button
                    class="btn btn-primary tooltip tooltip-left"
                    data-tip="Click on me to create a new guide!"
                    onclick={() => {
                        editorOpen = true;
                    }}><Icon icon="mdi:text-box-edit-outline" width="24" height="24" /></button
                >
                <button
                    class="btn btn-primary"
                    onclick={() => {
                        isGuideTable = false;
                    }}><Icon icon="mdi:close" width="24" height="24" /></button
                >
            </div>
        </div>
        <div class="divider mt-0"></div>
        <div
            class="h-1 grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:grid-cols-1 grid-flow-row-dense gap-1 items-start"
        >
            {#each guides as guide}
                <div class="card card-compact font-mono bg-base-100 w-96 shadow-2xl m-2 border border-base-200">
                    <div class="card-body">
                        <h2 class="card-title">SpamixOfficial</h2>
                        <p>{guide.body}</p>
                        <div class="card-actions justify-end">
                            <button class="btn btn-primary">Open guide</button>
                        </div>
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button
                            class="bottom-3 left-3 absolute btn btn-circle btn-ghost mt-auto hover:ring hover:ring-secondary shadow-md"
                        >
                            <img class="rounded-full w-10" src="https://avatars.githubusercontent.com/u/99183771?v=4" />
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
{:else}
    <h1>todo</h1>
{/if}

<GuideEditor bind:open={editorOpen} {signedIn} challengeId={chosenChallenge} />