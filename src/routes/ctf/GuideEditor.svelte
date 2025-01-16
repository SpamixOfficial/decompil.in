<script>
    import { Api } from "$lib/api";

    let { open = $bindable(), signedIn, challengeId } = $props();
    let thanks = $state(false);
    let submitError = $state(false);
    let content = $state("");
</script>

<dialog class:modal-open={open} class="modal">
    <div class="modal-box">
        <form method="dialog">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onclick={() => {
                    open = false;
                }}>✕</button
            >
        </form>
        <h3 class="text-lg font-bold">Welcome to the guide writer!</h3>
        <div class="divider m-0"></div>
        <div class="flex flex-col gap-2 min-w-full font-normal">
            <p>
                What is a guide? Well, in this context it is like a helpful tip for beginners or people who are stuck at
                a challenge
            </p>
            <p>
                When writing your guide try to make it as helpful as possible while still preserving the challenge, eg.
                <b>not revealing the solution</b> since a part of the fun is figuring things out yourself :-)
            </p>

            <p class="mt-5 mb-5 font-bold text-sm">
                It is recommended that you edit this outside of this "editor", as this "editor" kind of sucks right now!
                Just paste your text in the box when you're done :-)
            </p>

            <textarea
                class="textarea textarea-bordered w"
                bind:value={content}
                placeholder="Write the guide of your dreams!"
            ></textarea>
            <div class="flex flex-row gap-2">
                <p class="italic font-light text-sm text-primary-content/50">
                    On submission the guide will be reviewed by a human to make sure it is appropriate and correct
                    before it can be published.
                </p>
                <button
                    class="btn btn-primary self-end"
                    class:btn-disabled={content.length <= 0 || !signedIn}
                    onclick={async () => {
                        let result = await Api.createGuide(challengeId, content);
                        if (result) {
                            open = false;
                            thanks = true;
                        } else {
                            submitError = true;
                        }
                    }}>Submit</button
                >
            </div>
            {#if !signedIn}
                <p class="font-bold text-sm text-primary-content">You must sign in to use this feature</p>
            {/if}
        </div>
    </div>
</dialog>

<dialog class="modal" class:modal-open={thanks}>
    <div class="modal-box">
        <form method="dialog">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onclick={() => {
                    thanks = false;
                }}>✕</button
            >
        </form>
        <h3 class="text-lg font-bold">Thanks for your submission</h3>
        <p class="font-normal">The guide will be reviewed shortly</p>
    </div>
</dialog>

<dialog class="modal" class:modal-open={submitError}>
    <div class="modal-box">
        <form method="dialog">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onclick={() => {
                    submitError = false;
                }}>✕</button
            >
        </form>
        <h3 class="text-lg font-bold">Something went wrong!!</h3>
        <p class="font-normal">Please contact the adminstrator with necessary debug info</p>
    </div>
</dialog>
