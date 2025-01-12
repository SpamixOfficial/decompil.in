<script>
    import { Api } from "$lib/api";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Icon from "@iconify/svelte";

    let { challs, guideId } = $props();

    let isGuideOnDisplay = $state(false);
    let isGuideTable = $state(true);
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
            <p class="text-2xl font-bold">{chosenChallengeTitle}</p>
            <button class="btn btn-primary tooltip tooltip-left" data-tip="Click on me to create a new guide!"
                ><Icon icon="mdi:text-box-edit-outline" width="24" height="24" /></button
            >
        </div>
        <div class="divider mt-0"></div>
        {#each guides as guide}
            <div class="card bg-base-100 w-96 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">Hehe</h2>
                    <p>{guide.createdAt}</p>
                    <div class="card-actions justify-end">
                        <button class="btn btn-primary">Buy Now</button>
                    </div>
                </div>
            </div>
        {/each}
    {/if}
{:else}
    <h1>todo</h1>
{/if}
