<script>
    import Icon from "@iconify/svelte";
    let { user, session, open = $bindable() } = $props();
    let avatarUrl = user.image || "";
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
        <div class="flex flex-row items-center space-x-2">
            <div class="avatar {avatarUrl.length == 0 ? "placeholder" : ""}">
                <div class="w-24 rounded-full {avatarUrl.length == 0 ? "bg-neutral text-neutral-content" : ""}">
                    <!-- svelte-ignore a11y_missing_attribute -->
                    {#if avatarUrl.length == 0}
                        <span>{user.name.substring(0, 1)}</span>
                    {:else}
                        <img src={avatarUrl} />
                    {/if}
                </div>
            </div>
            <div class="flex flex-col place-content-start">
                <label class="input input-bordered flex items-center gap-2 mt-5">
                    <span class="text-neutral">
                        <Icon icon="simple-icons:github" width="24" height="24" />
                    </span>
                    <input type="text" class="grow" placeholder="https://github.com/spamix...." />
                </label>
            </div>
        </div>
    </div>
</dialog>
