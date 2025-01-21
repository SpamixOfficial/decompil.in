<script>
    import Icon from "@iconify/svelte";
    import { fade } from "svelte/transition";
    import { Api } from "$lib/api";
    import { redirect } from "@sveltejs/kit";
    import { goto } from "$app/navigation";

    let { id, title, description, score, files, signedIn, solved, solves, category } = $props();
    let shortenedDesc = $derived(description.length > 20 ? description.slice(0, 20 - 1) + "..." : description);
    let open = $state(false);
    let flagIcon = $state("material-symbols:flag-outline");
    if (solved) {
        flagIcon = "material-symbols:flag-check-outline";
    }
    let flagVal = $state("");
    let wrongFlag = $state(false);
    let rightFlag = $state(false);
</script>

<div class="card card-compact font-mono bg-base-100 w-96 shadow-2xl m-2 border border-base-200">
    <div class="w-full h-11 m-0 pt-4 p-2 flex flex-row justify-between items-center">
        <p class="font-bold text-xl justify-self-center first-letter:capitalize">{category}</p>
        <div
            class="h-10 p-4 bg-base-300 border-4 border-base-200 border-solid rounded-lg flex items-center justify-center"
            class:bg-success={solved}
        >
            <p class="font-mono text-xl font-bold">{score}</p>
        </div>
    </div>
    <div class="divider m-0 w-full"></div>
    <div class="card-body font-mono">
        <h2 class="card-title font-mono font-black">{title}</h2>

        <p class="font-medium text-base">
            {shortenedDesc}
        </p>
        <div class="flex flex-row">
            <p class="font-mono text-sm self-end font-bold">Solves: {solves}</p>
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
        <span class="flex flex-row justify-between">
            <label class="input input-bordered flex items-center gap-2 mt-5 mr-3 w-full">
                <span class="text-neutral">
                    <Icon icon={flagIcon} width="24" height="24" />
                </span>
                <input
                    bind:value={flagVal}
                    type="text"
                    class="grow"
                    placeholder={!signedIn? "You need to login first!" : (solved ? "Already solved!" : "SPX{.....}")}
                    disabled={solved || !signedIn}
                />
            </label>
            <button
                class="btn btn-primary mt-5"
                class:btn-disabled={solved || !signedIn}
                onclick={async () => {
                    let response = await Api.solve(id, flagVal);
                    if (!response) {
                        wrongFlag = true;
                        setTimeout(() => {
                            wrongFlag = false;
                        }, 2000);
                    } else {
                        rightFlag = true;
                        flagIcon = "material-symbols:flag-check-outline";
                        setTimeout(() => {
                            rightFlag = false;
                        }, 2000);
                    }
                }}><Icon icon="material-symbols:send-outline-rounded" width="24" height="24" /></button
            >
        </span>
        <!-- Prompt to write guide  -->
        {#if solved}
            <span class="flex flex-col mt-5">
                <p class="italic font-light text-md text-primary-content/50">
                    Looks like you've already solved this one! Would you like to write a guide to help others?
                </p>
                <button
                    class="btn btn-primary"
                    onclick={() => {
                        window.location.replace(`/ctf?page=3&guideEditor=true&challenge=${id}`);
                    }}>Open guide editor</button
                >
            </span>
        {:else}
            <span class="flex flex-col mt-5">
                <p class="italic font-light text-md text-primary-content/50">
                    Is the challenge a hard time? Take a look at the guides for help!
                </p>
                <button
                    class="btn btn-primary"
                    onclick={() => {
                        window.location.replace(`/ctf?page=3&challenge=${id}`);
                    }}>Open guides</button
                >
            </span>
        {/if}
    </div>
    {#if wrongFlag}
        <div class="toast" transition:fade>
            <div class="alert alert-error">
                <span>Wrong flag!</span>
            </div>
        </div>
    {/if}

    {#if rightFlag}
        <div class="toast" transition:fade>
            <div class="alert alert-success">
                <span>Success! Reload the page to reflect any changes</span>
            </div>
        </div>
    {/if}
</dialog>
