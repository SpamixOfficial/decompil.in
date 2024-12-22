<script>
    import aboutPage from "./biopages/about.md?raw";
    import TerminalWindow from "$lib/TerminalWindow.svelte";
    import { onMount } from "svelte";
    import SvelteMarkdown from "svelte-markdown";
    let currentPage = $state(1);
    let pages = {
        1: {title: "", source: ""},
        2: {title: "", source: ""},
        3: {title: "", source: ""},
        4: {title: "", source: ""},
    };
    
    pages[1] = {title: "About", source: aboutPage}
    pages[2] = {title: "Skills", source: "Skills"}
    pages[3] = {title: "Projects", source: "Projects"}
    pages[4] = {title: "CTF", source: "CTF"}
</script>

<TerminalWindow height="50vh" width="30vw">
    {#each Object.entries(pages) as [id, page]}
        {#if currentPage == id}
            <div>
                <SvelteMarkdown source={page.source}/>
            </div>
        {/if}
    {/each}
    <div class="tabBar">
        {#each Object.entries(pages) as [id, page]}
            <button class="tabButton" class:last={Object.values(pages).length == id} onclick={currentPage = id}>{page.title}</button>
        {/each}
    </div>
</TerminalWindow>

<style>
    .tabBar {
        position: absolute;
        bottom: 5px;
        left: 0px;
        right: 0px;
        margin-top: 5px;
        padding-top: 5px;
        border-top-style: solid;
        border-color: var(--terminalBorderColor);
        width: 100%;
    }
    .tabButton {
        all: unset;
        color: white;
        border-right-style: solid;
        text-align: center;
        border-color: var(--terminalBorderColor);
        width: calc(100% / 4 - 5px);
        transition: 0.3s;
    }

    .tabButton:hover {
        background-color: var(--terminalButtonHoverColor);
        box-shadow: 0 0 5px 1px var(--terminalButtonHoverColor);
    }

    .tabButton.last {
        border-style: none;
    }
</style>
