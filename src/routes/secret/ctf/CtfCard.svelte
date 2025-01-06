<script>
    import Icon from "@iconify/svelte";

    let { title, description, score, files } = $props();
    let shortenedDesc = $derived(description.length > 20 ? description.slice(0, 20 - 1) + "..." : description);
    let open = $state(false);
    let flagIcon = $state("material-symbols:flag-outline");
</script>

<div class="card card-compact font-mono bg-base-100 w-96 shadow-2xl m-2 border border-base-200">
    <div class="card-body font-mono">
        <h2 class="card-title font-mono font-black">{title}</h2>
        <div
            class="h-10 top-4 right-4 absolute p-4 bg-base-300 border-4 border-base-200 border-solid rounded-lg flex items-center justify-center"
        >
            <p class="font-mono text-xl">{score}</p>
        </div>
        <p class="font-medium text-base">
            {shortenedDesc}
        </p>
        <div class="card-actions justify-end font-mono">
            <button
                class="btn btn-primary"
                onclick={() => {
                    open = true;
                }}>Open challenge</button
            >
        </div>
    </div>
</div>

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
        <h3 class="text-xl font-bold">{title}</h3>
        <p class="py-4 font-medium text-pretty">{description}</p>
        <!-- Files Dropdown -->
        {#if files.length !== 0}
            <div class="collapse collapse-arrow border-base-300 bg-base-200 border">
                <input type="checkbox" />
                <div class="collapse-title text-base font-medium">Files, click to open</div>
                <div class="collapse-content">
                    {#each files as file}
                        <span class="flex items-center space-x-2">
                            <span class="text-neutral">
                                <Icon icon="material-symbols:attach-file-rounded" width="24" height="24" />
                            </span>
                            <a href={file.url}>{file.url}</a>
                        </span>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Flag submit -->
        <label class="input input-bordered flex items-center gap-2 mt-5">
            <span class="text-neutral">
                <Icon icon={flagIcon} width="24" height="24" />
            </span>
            <input type="text" class="grow" placeholder="SPX{'{'}.....{'}'}" />
        </label>
    </div>
</dialog>
