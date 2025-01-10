<script>
    import Icon from "@iconify/svelte";
    import ProfilePage from "./ProfilePage.svelte";
    let { leaderboard } = $props();
    let currentUserId = $state("");
    let openUserPage = $state(false);
</script>

<div class="overflow-auto">
    <table class="table">
        <thead>
            <tr>
                <th class="text-lg">Name</th>
                <th class="text-lg">Score</th>
                <th class="text-lg">Rank</th>
            </tr>
        </thead>
        <tbody>
            {#each leaderboard.entries() as [i, user]}
                <tr>
                    <th>
                        <div class="flex items-center gap-3">
                            <button
                                class="btn btn-circle btn-ghost bottom-4 mt-auto ring-offset-2 ring-offset-slate-400 hover:ring-2 hover:ring-secondary"
                                onclick={() => {
                                    currentUserId = user.id;
                                    openUserPage = true;
                                }}
                            >
                                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                                <img class="rounded-full w-12" src={user.image} alt="avatar" />
                            </button>
                            <div>
                                <div class="font-bold text-lg">{user.name}</div>
                                <!-- svelte-ignore a11y_missing_attribute -->
                                {#if (user.githubUrl || "").length !== 0}
                                    <div class="flex gap-2 text-sm opacity-50">
                                        <Icon icon="simple-icons:github" width="20" height="20" />
                                        <a class="link" href={user.githubUrl}> {user.githubUrl || ""}</a>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </th>
                    <td>
                        <h1 class="font-mono font-bold text-2xl">{user.score}</h1>
                    </td>
                    <td>
                        <h1 class="font-mono font-bold text-2xl">{i + 1}</h1>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
{#key currentUserId}
    <ProfilePage id={currentUserId} bind:open={openUserPage}/>
{/key}