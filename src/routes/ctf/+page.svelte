<script>
    import { authClient } from "$lib/auth-client";
    import { onMount } from "svelte";
    import Drawer from "./Drawer.svelte";
    import TopNav from "./TopNav.svelte";
    import Loading from "./Loading.svelte";
    import { Api } from "$lib/api";
    import Mainpage from "./Mainpage.svelte";

    let { data } = $props();
    
    let currentPage = $state(0);
    let pageLoaded = $state(false);
    let mobileVertical = $state(false);
    let user = $state({});
    let session = $state({});
    let signedIn = $state(false);
    let error = $state(false);
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
        currentPage = Number(data.page);
        mobileVertical = window.innerWidth < 750;
        window.addEventListener("resize", () => {
            mobileVertical = window.innerWidth < 750;
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
            error = true;
            // We don't want to load the page if no data can be loaded - better to display funny error!
            return;
        }

        // if the user is signed in we don't have to introduce them again
        // However if a set page is passed we don't want to change it
        if (signedIn && data.page === null) {
            currentPage = 1;
        }

        pageLoaded = true;
    });
</script>

{#if !pageLoaded}
    <Loading bind:error={error}/>
{:else if !mobileVertical}
    <Drawer bind:pageControl={currentPage} {signedIn} {user} {session}>
        <Mainpage {leaderboard} {user} bind:currentPage {challs} {signedIn} guideId={data.guideId} openGuideEditor={data.openGuideEditor} challengeId={data.challengeId}/>
    </Drawer>
{:else}
    <TopNav bind:pageControl={currentPage} {signedIn} {user} {session}>
        <Mainpage {leaderboard} {user} bind:currentPage {challs} {signedIn} guideId={data.guideId} openGuideEditor={data.openGuideEditor} challengeId={data.challengeId}/>
    </TopNav>
{/if}
