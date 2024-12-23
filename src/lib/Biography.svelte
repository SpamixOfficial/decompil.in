<script>
    import aboutPage from "./biopages/about.md?raw";
    import projectsPage from "./biopages/projects.md?raw";
    import skillsPage from "./biopages/skills.md?raw";
    import ctfPage from "./biopages/ctf.md?raw";
    import TerminalWindow from "$lib/TerminalWindow.svelte";
    import { scale, fade } from "svelte/transition";
    import SvelteMarkdown from "svelte-markdown";
    let currentPage = $state(1);
    let pages = {
        1: {title: "", source: ""},
        2: {title: "", source: ""},
        3: {title: "", source: ""},
        4: {title: "", source: ""},
    };
    
    pages[1] = {title: "About", source: aboutPage}
    pages[2] = {title: "Skills", source: skillsPage}
    pages[3] = {title: "Projects", source: projectsPage}
    pages[4] = {title: "CTF", source: ctfPage}
</script>

<TerminalWindow height="80vh" width="30vw" >
    {#each Object.entries(pages) as [id, page]}
        {#if currentPage == id}
            <div in:scale={{ delay: 250 }} out:scale={{ duration: 200 }}>
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
        bottom: 5px;
        left: 0px;
        right: 0px;
        margin-top: 5px;
        padding-top: 2px;
        padding-bottom: 2px;
        border-top-style: solid;
        border-width: 2px;
        border-color: var(--terminalBorderColor);
        width: 100%;
        position: fixed;
        bottom: 0;
    }

    .tabButton {
        all: unset;
        color: white;
        border-right-style: solid;
        border-width: 2px;
        text-align: center;
        border-color: var(--terminalBorderColor);
        width: calc(100% / 4 - 2px);
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
