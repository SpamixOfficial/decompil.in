<script>
    import { fade } from "svelte/transition";
    let { pageControl = $bindable() } = $props();
</script>

<div class="hero bg-base-200 min-h-screen" transition:fade>
    <div class="hero-content text-center">
        <div class="max-w-md">
            <h1 class="text-5xl font-bold">Hello there!</h1>
            <p class="py-6 font-normal">
                So, what is this? This is a so called CTF archive where I host challenges which you can solve and get a
                cool leaderboard position that you can flex off to all your real friends :3
            </p>
            <p class="font-normal">
                However before doing any challenges you need to log in using github in the bottom left corner on desktop or in
                the top right on mobile!
            </p>
            <p class="py-6 font-normal">
                Never done any CTF challenges before? Then check out the 101/starter challenges on this page, <a
                    class="link"
                    href="https://pwn.college">pwn.college</a
                >, <a class="link" href="https://crackmes.one">crackmes.one</a> and if you're swedish you can check out
                <a class="link" href="https://sakerhetssm.se">Säkerhets-SM</a> aswell!
            </p>
            <p class="py-6 font-bold">Now go get 'em masterhaxxor!!</p>
            <button class="btn btn-primary" onclick={() => {
                pageControl = 1;
            }}>Go to the challenges</button>
        </div>
    </div>
</div>
