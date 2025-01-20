<script>
    let { user, signedIn, session, children, pageControl = $bindable() } = $props();
    import SettingsModal from "./SettingsModal.svelte";
    import { authClient } from "$lib/auth-client";
    import Icon from "@iconify/svelte";
    let openSettingsPage = $state(false);
    let profileImg = user.image || "";
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_missing_attribute -->
<div class="navbar bg-base-100">
    <div class="navbar-start">
        <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
            </div>
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li>
                    <a
                        onclick={() => {
                            pageControl = 0;
                        }}>Challenges</a
                    >
                </li>
                <li>
                    <a
                        onclick={() => {
                            pageControl = 1;
                        }}>Leaderboard</a
                    >
                </li>
                <li>
                    <a
                        onclick={() => {
                            pageControl = 2;
                        }}>Guides</a
                    >
                </li>
                {#if signedIn}
                    <li>
                        <a
                            onclick={() => {
                                authClient.signOut();
                                signedIn = false;
                            }}>Sign out</a
                        >
                    </li>
                {/if}
            </ul>
        </div>
    </div>
    <div class="navbar-center">
        <a class="btn btn-ghost text-xl cursor-default">Decompilin CTF</a>
    </div>
    <div class="navbar-end">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        {#if signedIn}
            <button class="btn btn-circle btn-ghost bottom-4 mt-auto active:ring active:ring-secondary">
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <img class="rounded-full w-10" onclick={() => {
                    openSettingsPage = !openSettingsPage;
                }} src={profileImg}/>
            </button>
        {:else}
            <button
                class="btn btn-ghost"
                onclick={() => {
                    authClient.signIn.social({
                        provider: "github",
                    });
                }}
            >
                <span class="text-black"><Icon icon="mdi:sign-in" width="24" height="24" /></span>
            </button>
        {/if}
    </div>
</div>
<div class="justify-center w-screen h-screen min-h-screen flex overflow-y-auto">
    {@render children()}
</div>
{#if signedIn}
    <SettingsModal bind:open={openSettingsPage} bind:signedIn={signedIn} {user} {session}/>
{/if}