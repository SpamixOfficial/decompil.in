<script>
    import CtfCard from "./CtfCard.svelte";
    import { authClient } from "$lib/auth-client";
    import { onMount } from "svelte";
    import Drawer from "./Drawer.svelte";
    import { Api } from "$lib/api";
    let currentPage = $state(0);

    let user = $state({});
    let session =  $state({});
    let signedIn = $state(false);

    let challs = $state([
        {
            title: "Loading challenges!",
            description: "This card should dissapear soon",
            score: 999,
            files: []
        },
    ]);

    onMount(async () => {
        const sessionResponse = await authClient.getSession();
        signedIn = sessionResponse.data !== undefined && sessionResponse.data !== null;
        if (sessionResponse.data !== undefined && sessionResponse.data !== null) {
            user = sessionResponse.data.user;
            session = sessionResponse.data.session;
        }

        const challResponse = await Api.loadAllChalls();
        if (challResponse.success) {
            challs = challResponse.data;
            console.log(challs);
        } else {
            challs = [
                {
                    title: "Something went wrong!",
                    description: challResponse.error || "Woah there wasn't even an error message (that's bad)",
                    score: 400,
                    files: []
                },
            ];
        }
    });
</script>

<Drawer pageControl="currentPage" {signedIn}>
    {#each challs as chall}
        <CtfCard files={chall.files} score={chall.score} title={chall.title} description={chall.description} />
    {/each}
</Drawer>
