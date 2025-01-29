<script>
    import Icon from "@iconify/svelte";
    import { authClient } from "$lib/auth-client";

    let { open = $bindable() } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_missing_attribute -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<dialog class="modal" class:modal-open={open}>
    <div class="modal-box">
        <form method="dialog">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onclick={() => {
                    open = false;
                }}>✕</button
            >
        </form>
        <p class="font-bold text-xl bold">Login methods</p>
        <div class="divider mt-0 mb-0"></div>
        <div>
            <button
                class="btn bg-base-100 border-none shadow-none w-full mt-3 duration-300 bottom-4 inset-x-0 rounded-lg hover:duration-300 hover:bg-black hover:shadow-lg group"
            >
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
                    <span class="text-github-black duration-300 group-hover:duration-300 group-hover:text-white text-lg"
                        >Sign in with Github</span
                    >
                </a>
            </button>
            <button
                class="btn bg-base-100 border-none shadow-none w-full mt-3 duration-300 bottom-4 inset-x-0 rounded-lg hover:duration-300 hover:bg-blurple hover:shadow-lg group"
            >
                <a
                    class="flex items-center space-x-2"
                    onclick={() => {
                        authClient.signIn.social({
                            provider: "discord",
                        });
                    }}
                >
                    <span class="text-github-black duration-300 group-hover:duration-300 group-hover:text-white">
                        <Icon icon="simple-icons:discord" width="24" height="24" />
                    </span>
                    <span class="text-github-black duration-300 group-hover:duration-300 group-hover:text-white text-lg"
                        >Sign in with Discord</span
                    >
                </a>
            </button>
            <button
                class="btn bg-base-100 border-none shadow-none w-full mt-3 duration-300 bottom-4 inset-x-0 rounded-lg hover:duration-300 hover:bg-slurple hover:shadow-lg group"
            >
                <a
                    class="flex items-center space-x-2"
                    onclick={() => {
                        authClient.signIn.oauth2({
                            providerId: "slack",
                            callbackURL: "/ctf"
                        });
                    }}
                >
                    <span class="text-github-black duration-300 group-hover:duration-300 group-hover:text-white">
                        <Icon icon="simple-icons:slack" width="24" height="24" />
                    </span>
                    <span class="text-github-black duration-300 group-hover:duration-300 group-hover:text-white text-lg"
                        >Sign in with Slack</span
                    >
                </a>
            </button>
        </div>
    </div>
</dialog>
