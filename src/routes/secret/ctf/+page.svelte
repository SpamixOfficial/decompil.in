<script>
    import CtfCard from "./CtfCard.svelte";
    import { fly } from "svelte/transition";
    import { authClient } from "$lib/auth-client";
    import { onMount } from "svelte";
    import Drawer from "./Drawer.svelte";
    import TopNav from "./TopNav.svelte";
    import Loading from "./Loading.svelte";
    import { Api } from "$lib/api";
    import Mainpage from "./Mainpage.svelte";
    let currentPage = $state(0);
    let pageLoaded = $state(false);
    let mobileVertical = $state(false);
    let user = $state({});
    let session = $state({});
    let signedIn = $state(false);

    // Some prefill items which go poof when data is loaded
    // Mainly here to not make typescript checker go mad
    let challs = $state([
        {
            title: "Loading challenges!",
            description: "This card should go poof soon",
            score: 999,
            files: [],
        },
    ]);

    let leaderboard = $state([
        {
            id: "superior",
            image: "https://avatars.githubusercontent.com/u/1024025?v=4",
            name: "The GOAT",
            githubUrl: "https://github.com/torvalds",
            score: 2147483647,
        },
    ]);

    onMount(async () => {
        mobileVertical = window.innerWidth < 768;
        window.addEventListener("resize", () => {
            mobileVertical = window.innerWidth < 768;
        });
        const sessionResponse = await authClient.getSession();
        leaderboard = await Api.getLeaderboard();
        signedIn = sessionResponse.data !== undefined && sessionResponse.data !== null;
        if (sessionResponse.data !== undefined && sessionResponse.data !== null) {
            user = sessionResponse.data.user;
            session = sessionResponse.data.session;
        }

        const challResponse = await Api.loadAllChalls();
        if (challResponse.success) {
            challs = challResponse.data;
        } else {
            challs = [
                {
                    title: "Something went wrong!",
                    description: challResponse.error || "Woah there wasn't even an error message (that's bad)",
                    score: 400,
                    files: [],
                },
            ];
        }
        pageLoaded = true;
    });
</script>

{#if !pageLoaded}
    <Loading />
{:else if !mobileVertical}
    <Drawer bind:pageControl={currentPage} {signedIn} {user} {session}>
        <Mainpage {leaderboard} {currentPage} {challs}/>
    </Drawer>
{:else}
    <TopNav bind:pageControl={currentPage} {signedIn} {user} {session}>
        {#if currentPage == 0}
            <div
                transition:fly={{ x: -200 }}
                class="h-1 grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 md:grid-cols-1 grid-flow-row-dense gap-1 items-start"
            >
                {#each challs as chall}
                    <CtfCard
                        files={chall.files}
                        score={chall.score}
                        title={chall.title}
                        description={chall.description}
                    />
                {/each}
            </div>
        {:else}
            <div transition:fly={{ x: 200 }}>
                <h1>i</h1>
            </div>
        {/if}
    </TopNav>
{/if}
