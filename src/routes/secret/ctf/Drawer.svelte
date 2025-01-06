<script>
    import Icon from "@iconify/svelte";
    import SettingsModal from "./SettingsModal.svelte";
    let { children, user, session, pageControl = $bindable(), signedIn } = $props();
    import { authClient } from "$lib/auth-client";
    let openSettingsPage = $state(false);
    let profileImg = user.image || "";
</script>

<div class="drawer drawer-open font-mono font-black">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content items-center justify-center overflow-auto">
        {@render children()}
    </div>
    <div class="drawer-side border-r-2 border-base-300">
        <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="flex justify-normal menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <!-- svelte-ignore a11y_missing_attribute -->
            <li class="rounded-lg m-1">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <a
                    onclick={() => {
                        pageControl = 0;
                    }}>Challenges</a
                >
            </li>
            <!-- svelte-ignore a11y_missing_attribute -->
            <li class="top-0 rounded-lg m-1">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <a
                    onclick={() => {
                        pageControl = 1;
                    }}>Leaderboard</a
                >
            </li>
            {#if !signedIn}
                <!-- svelte-ignore a11y_missing_attribute -->
                <li
                    class="mt-auto duration-300 bottom-4 inset-x-0 rounded-lg hover:duration-300 hover:bg-black hover:shadow-lg group"
                >
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <a
                        class="flex items-center space-x-2"
                        onclick={() => {
                            authClient.signIn.social({
                                provider: "github",
                            });
                        }}
                    >
                        <span class="text-github-black duration-300 group-hover:duration-300 group-hover:text-white">
                            <Icon icon="simple-icons:github" width="24" height="24" />
                        </span>
                        <span class="text-github-black duration-300 group-hover:duration-300 group-hover:text-white"
                            >Sign in with Github</span
                        >
                    </a>
                </li>
            {:else}
                <!-- svelte-ignore a11y_missing_attribute -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button class="btn btn-circle btn-ghost bottom-4 mt-auto hover:ring hover:ring-secondary">
                        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                        <img class="rounded-full w-10" onclick={() => {
                            openSettingsPage = !openSettingsPage;
                        }} src={profileImg}/>
                    </button>
            {/if}
        </ul>
    </div>
</div>

<SettingsModal bind:open={openSettingsPage} {user} {session}/>