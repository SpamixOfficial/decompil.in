<script>
    import { Api } from "$lib/api";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Icon from "@iconify/svelte";
    import GuideEditor from "./GuideEditor.svelte";
    import ProfilePage from "./ProfilePage.svelte";
    import { goto } from "$app/navigation";

    let { challs, guideId, user, signedIn, openGuideEditor, challengeId } = $props();

    let isGuideOnDisplay = $state(false);
    let openUserPage = $state(false);
    let isGuideTable = $state(false);
    let editorOpen = $state(false);
    let chosenChallenge = $state(0);
    let chosenChallengeSolved = $state(false);
    let chosenChallengeTitle = $state("Initial challenge");
    let guides = $state([
        {
            id: 1,
            body: "A body",
            userId: "12345678",
            createdAt: "2025-01-16T19:44:29.000Z",
        },
    ]);
    let chosenGuide = $state({
        id: 1,
        body: "A body",
        userId: "12345678",
        createdAt: "2025-01-16T19:44:29.000Z",
    });
    let chosenGuideUser = $state({
        id: "lulz",
        name: "SpamixOfficial",
        image: "https://avatars.githubusercontent.com/u/99183771?v=4",
        score: 999,
        githubUrl: "https://github.com/spamixofficial",
    });

    /**
     * @param {string} id
     */
    async function loadUserProfile(id) {
        chosenGuideUser = (await Api.getUser(id)) || {
            id: "lulz",
            name: "SpamixOfficial",
            image: "https://avatars.githubusercontent.com/u/99183771?v=4",
            score: 999,
            githubUrl: "https://github.com/spamixofficial",
        };
    }

    onMount(async () => {
        if (challengeId !== null) {
            let challengeReq = await Api.getChallenge(challengeId);
            if (challengeReq.success) {
                chosenChallengeSolved = challengeReq.data.solved;
                // openGuideEditor can only work if a real guide-page is opened and if user has solved
                if (chosenChallengeSolved) { editorOpen = openGuideEditor };
                isGuideTable = true;
                chosenChallenge = challengeId;
                chosenChallengeTitle = challengeReq.data.title;
                guides = (await Api.loadAllChallGuides(chosenChallenge)).data;
            }
        }
        if (guideId !== null && challengeId !== null) { // guideId needs challengeId to display correctly
            let response = await Api.getGuide(guideId);
            if (response.success === true) {
                chosenGuide = response.data;
                isGuideOnDisplay = true;
            }
        }
    });
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if !isGuideTable}
    <div class="hero bg-base-100 min-h-lvh overflow-auto" transition:fade>
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
                                        chosenChallengeSolved = chall.solved;
                                        goto(`/ctf?page=3&challenge=${chosenChallenge}`);
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
    <div class="flex h-12 p-5 mt-2 justify-between items-center">
        <p class="text-2xl font-bold">"{chosenChallengeTitle}" - Guides</p>
        <div class="flex justify-end gap-2">
            <button
                class="btn sm:btn-md btn-sm btn-primary tooltip sm:tooltip-left tooltip-bottom"
                data-tip={chosenChallengeSolved ? "Click on me to create a new guide!" : "Solve the challenge first"}
                class:tooltip-open={!chosenChallengeSolved}
                class:btn-disabled={!chosenChallengeSolved}
                onclick={() => {
                    editorOpen = true;
                }}><Icon icon="mdi:text-box-edit-outline" width="24" height="24" /></button
            >
            <button
                class="btn sm:btn-md btn-sm btn-primary"
                onclick={() => {
                    isGuideTable = false;
                    goto("/ctf");
                }}><Icon icon="mdi:close" width="24" height="24" /></button
            >
        </div>
    </div>
    <div class="divider mt-0"></div>
    <div
        class="h-1 grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:grid-cols-1 grid-flow-row-dense gap-1 items-start"
    >
        <!--Spaghetti down below, but it works doesn't it?-->
        {#each guides as guide}
            <div class="card card-compact font-mono bg-base-100 w-96 shadow-2xl m-2 border border-base-200">
                <div class="card-body">
                    <h2 class="card-title text-md mb-0">{new Date(guide.createdAt).toDateString()}</h2>
                    <div class="divider m-0"></div>
                    <p>{guide.body.length > 40 ? guide.body.slice(0, 40 - 1) + "..." : guide.body}</p>
                    <div class="card-actions justify-end">
                        <button
                            class="btn btn-primary"
                            onclick={async () => {
                                await loadUserProfile(guide.userId);
                                chosenGuide = guide;
                                isGuideOnDisplay = true;
                            }}>Open guide</button
                        >
                    </div>
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button
                        class="bottom-3 left-3 absolute btn btn-circle btn-ghost mt-auto hover:ring hover:ring-secondary shadow-md"
                        onclick={async () => {
                            await loadUserProfile(guide.userId);
                            openUserPage = true;
                        }}
                    >
                        <img class="rounded-full w-10" src="https://avatars.githubusercontent.com/u/99183771?v=4" />
                    </button>
                </div>
            </div>
        {/each}
    </div>
{/if}

<GuideEditor bind:open={editorOpen} {signedIn} challengeId={chosenChallenge} />

<dialog class="modal" class:modal-open={isGuideOnDisplay}>
    <div class="modal-box">
        <form method="dialog">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onclick={() => {
                    isGuideOnDisplay = false;
                }}>✕</button
            >
        </form>
        <div class="flex justify-start items-center">
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <!-- svelte-ignore a11y_missing_attribute -->
            <button
                class="m-0 mr-2 btn btn-circle btn-ghost mt-auto hover:ring hover:ring-secondary shadow-md"
                onclick={async () => {
                    await loadUserProfile(chosenGuideUser.id);
                    openUserPage = true;
                }}
            >
                <img class="rounded-full w-10" src="https://avatars.githubusercontent.com/u/99183771?v=4" />
            </button>
            <h3 class="text-xl font-bold">Guide by {chosenGuideUser.name}</h3>
        </div>
        <div class="divider m-0"></div>
        <p class="py-4">{chosenGuide.body}</p>
        <div class="flex justify-between items-center">
            <div
                class="h-5 p-3 bg-base-300 border-4 border-base-200 border-solid rounded-lg flex items-center justify-start"
            >
                <p class="font-mono text-md">Created at: {new Date(chosenGuide.createdAt).toDateString()}</p>
            </div>
        </div>
    </div>
</dialog>

{#key chosenGuideUser.id}
    <ProfilePage id={chosenGuideUser.id} bind:open={openUserPage} />
{/key}
