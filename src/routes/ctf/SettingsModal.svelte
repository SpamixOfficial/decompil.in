<script>
    import Icon from "@iconify/svelte";
    import { Api } from "$lib/api";
    import { onMount } from "svelte";
    import { authClient } from "$lib/auth-client";
    let { user, session, open = $bindable(), signedIn = $bindable() } = $props();

    let githubUrl = $state("");
    let updateError = $state(false);
    let avatarUrl = user.image || "";
    let userRank = $state(0);

    onMount(async () => {
        githubUrl = user.githubUrl || "";
        userRank = await Api.getUserRank(user.id);
    });
</script>

<dialog class="modal font-mono" class:modal-open={open}>
    <div class="modal-box font-mono">
        <form method="dialog">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onclick={() => {
                    open = false;
                }}>✕</button
            >
        </form>
        <div class="flex flex-col items-start space-x-2">
            <div class="flex flex-row items-start gap-4">
                <div class="avatar {avatarUrl.length == 0 ? 'placeholder' : ''}">
                    <div
                        class="ring-base-300 ring-4 w-24 rounded-full {avatarUrl.length == 0
                            ? 'bg-neutral text-neutral-content'
                            : ''}"
                    >
                        <!-- svelte-ignore a11y_missing_attribute -->
                        {#if avatarUrl.length == 0}
                            <span>{user.name.substring(0, 1)}</span>
                        {:else}
                            <img src={avatarUrl} />
                        {/if}
                    </div>
                </div>
                <div class="divider divider-horizontal m-0 opacity-0"></div>
                <div class="flex flex-col items-start md:min-w-full sm:min-w-auto">
                    <h1 class="font-mono font-bold text-xl">{user.name}</h1>
                    <div class="divider m-0">Stats</div>
                    <div
                        class="h-5 p-3 bg-base-300 border-4 border-base-200 border-solid rounded-lg flex items-center justify-center"
                    >
                        <p class="font-mono text-lg">Score: {user.score}</p>
                    </div>
                    <div
                        class="mt-3 h-5 p-3 bg-base-300 border-4 border-base-200 border-solid rounded-lg flex items-center justify-center"
                    >
                        <p class="font-mono text-lg">Rank: {userRank}</p>
                    </div>
                </div>
            </div>
            <div class="divider mb-0">Socials</div>
            <!--Social link input fields-->
            <ul class="min-w-full">
                <li>
                    <label class="input input-bordered flex items-center gap-2 mt-5 mr-2">
                        <span class="text-neutral">
                            <Icon icon="simple-icons:github" width="24" height="24" />
                        </span>
                        <input
                            type="text"
                            class="grow"
                            bind:value={githubUrl}
                            placeholder="https://github.com/spamix...."
                        />
                    </label>
                </li>
            </ul>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <div class="min-w-full flex flex-row gap-2 justify-between">
                <button
                    class="btn btn-secondary hover:btn-error text-error-content mt-2"
                    onclick={() => {
                        authClient.signOut();
                        signedIn = false;
                        window.location.replace("/ctf")
                    }}
                >
                    Sign out
                </button>
                <button
                    class="btn btn-square {githubUrl == (user.githubUrl || '')
                        ? 'btn-disabled'
                        : 'btn-primary'} {updateError ? 'btn-error' : ''} mt-2 mr-2"
                    onclick={async () => {
                        let result = await Api.updateUserSocials(githubUrl, user.id, session);
                        updateError = result.status != 200;
                    }}
                >
                    <Icon icon="material-symbols:save-outline" width="24" height="24" />
                </button>
            </div>
        </div>
    </div>
</dialog>
