<script>
    import CtfCard from "./CtfCard.svelte";
    import { authClient } from "$lib/auth-client";
    import { onMount } from "svelte";

    let session = null;
    let signedIn = false;

    let challs = [
        {
            title: "Oh my",
            description:
                "A masterhacker has figured out how to access our secret page, but we haven't! Can you find it?",
        },
    ];

    /*onMount(async () => {
        session = await authClient.getSession();
        signedIn = !session;
    });*/
</script>

{#each challs as chall}
    <CtfCard title={chall.title} description={chall.description} />
{/each}
<!--{#if !signedIn}-->
<button
    class="btn btn-primary"
    onclick={() => {
        authClient.signIn.social({
            provider: "github",
        });
    }}>Sign in</button
>
<!--{:else}-->
<button class="btn btn-primary" onclick={authClient.signOut}>Sign out</button>
<!--{/if}-->
