<script>
    /**
     * Very much like the SettingsModal, but meant to not allow editing
     */

    import Icon from "@iconify/svelte";
    import { Api } from "$lib/api";
    import { onMount } from "svelte";
    let { id, open = $bindable() } = $props();
    let user = $state({
        name: "Lost user",
        score: 404,
        image: "https://i.imgflip.com/2/1lj6ra.jpg",
        githubUrl: "https://github.com/errornointernet",
    });
    let userRank = $state(0);
    let githubUrl = $derived(user.githubUrl || "")
    let avatarUrl = $derived(user.image || "")

    onMount(async () => {
        if (!id) {
            return;
        }
        user = (await Api.getUser(id)) || {
            name: "Lost user",
            score: 404,
            image: "https://i.imgflip.com/2/1lj6ra.jpg",
            githubUrl: "https://github.com/errornointernet",
        };

        userRank = await Api.getUserRank(id);
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
                <div class="flex flex-col items-start md:min-w-full sm:min-w-auto font-normal">
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
            <div class="divider mb-0 font-normal">Socials</div>
            <!--Social link input fields-->
            <ul class="min-w-full font-normal">
                <li>
                    <label class="flex items-center gap-2 mt-5 mr-2">
                        <span class="text-neutral">
                            <Icon icon="simple-icons:github" width="24" height="24" />
                        </span>
                        <a href={githubUrl} class="link">{githubUrl}</a>
                    </label>
                </li>
            </ul>
        </div>
    </div>
</dialog>
