<script>
    import CtfCard from "./CtfCard.svelte";
    import { authClient } from "$lib/auth-client";
    import { onMount } from "svelte";
    import Drawer from "./Drawer.svelte";

    let currentPage = $state(0);

    let user;
    let session;
    let signedIn = $state(false);

    let challs = [
        {
            title: "Oh my",
            description:
                "A masterhacker has figured out how to access our secret page, but we haven't! Can you find it?",
        },
    ];

    onMount(async () => {
        const sessionResponse = await authClient.getSession();
        signedIn = sessionResponse.data !== undefined;
        console.log(signedIn, sessionResponse.data.session !== undefined, sessionResponse.data);
        if (signedIn) {
            user = sessionResponse.data.user;
            session = sessionResponse.data.session;
        };
    });
</script>
<Drawer pageControl=currentPage>
    {#each challs as chall}
        <CtfCard title={chall.title} description={chall.description} />
    {/each}
    <!--{#if !signedIn}
        <button
            class="btn btn-primary"
            onclick={() => {
                authClient.signIn.social({
                    provider: "github",
                });
            }}>Sign in</button
        >
    {:else}
        <button
            class="btn btn-primary"
            onclick={() => {
                authClient.signOut();
            }}>Sign out</button
        >
    {/if}-->
</Drawer>