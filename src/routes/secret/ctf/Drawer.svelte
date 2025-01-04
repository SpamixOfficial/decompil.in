<script>
    import { SiGithub } from "@icons-pack/svelte-simple-icons";
    let { children, pageControl } = $props();
    import { authClient } from "$lib/auth-client";
</script>

<div class="drawer drawer-open font-mono font-black">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-center">
        {@render children()}
    </div>
    <div class="drawer-side">
        <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="flex justify-normal menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <!-- svelte-ignore a11y_missing_attribute -->
            <li class="duration-300 rounded-lg hover:duration-300 hover:shadow-secondary/50 hover:shadow-lg">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <a
                    onclick={() => {
                        $pageControl = 0;
                    }}>Challenges</a
                >
            </li>
            <!-- svelte-ignore a11y_missing_attribute -->
            <li class="top-0 duration-300 rounded-lg hover:duration-300 hover:shadow-secondary/50 hover:shadow-lg">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <a
                    onclick={() => {
                        $pageControl = 1;
                    }}>Leaderboard</a
                >
            </li>
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
                        <SiGithub />
                    </span>
                    <span class="text-github-black duration-300 group-hover:duration-300 group-hover:text-white">Sign in with Github</span>
                </a>
            </li>
        </ul>
    </div>
</div>
