<script>
    let { title, description } = $props();

    let open = $state(false);
</script>

<div class="card font-mono bg-base-100 w-96 shadow-2xl m-5 border border-base-200">
    <div class="card-body font-mono">
        <h2 class="card-title font-mono">{title}</h2>
        <p class="font-mono">{description}</p>
        <div class="card-actions justify-end font-mono">
            <button class="btn btn-primary" onclick={open = true}>Open challenge</button>
        </div>
    </div>
</div>

<dialog class="modal font-mono" class:modal-open={open}>
    <div class="modal-box font-mono">
        <h3 class="text-lg font-bold">Hello!</h3>
        <p class="py-4 font-mono">Press ESC key or click the button below to close</p>
        <div class="modal-action font-mono">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn btn-primary" onclick={open = false}>Close</button>
            </form>
        </div>
    </div>
</dialog>
