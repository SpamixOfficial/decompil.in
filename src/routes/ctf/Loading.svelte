<script>
    import Icon from "@iconify/svelte";
    let { error = $bindable() } = $props();
</script>

{#if !error}
    <div class="justify-center items-center w-screen h-screen flex">
        <span class="loading loading-infinity w-20"></span>
    </div>
{:else}
    <div class="justify-center items-center w-screen h-screen flex">
        <div role="alert" class="alert alert-error w-96">
            <div class="flex flex-col">
                <div class="flex flex-row justify-center">
                    <Icon icon="material-symbols:error" width="24" height="24" />
                    <span>Failed to load data from backend!!</span>
                </div>
                <div class="divider divider-neutral"></div>
                <span>Please contact me on discord if this error doesn't go away</span>
                <span>Discord: <b>sapmix</b></span>
            </div>
        </div>
    </div>
{/if}
