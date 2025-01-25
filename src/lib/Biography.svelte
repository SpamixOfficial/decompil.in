<script>
    import aboutPage from "./biopages/about.md?raw";
    import projectsPage from "./biopages/projects.md?raw";
    import skillsPage from "./biopages/skills.md?raw";
    import ctfPage from "./biopages/ctf.md?raw";
    import TerminalWindow from "$lib/TerminalWindow.svelte";
    import { scale } from "svelte/transition";
    import SvelteMarkdown from "svelte-markdown";
    import { onMount } from "svelte";
    import MarkdownImage from "./MarkdownImage.svelte";
    let { mobile, mobileVertical, mobileFullSize } = $props();
    let height = $derived.by(calcHeight);
    let width = $derived.by(calcWidth);

    function calcHeight() {
        if (mobile == "true") {
            if (mobileVertical && !mobileFullSize) {
                return 70;
            } else {
                return 95;
            }
        } else {
            return 70;
        }
    }

    function calcWidth() {
        if (mobile == "true") {
            if (mobileVertical || (!mobileVertical && mobileFullSize)) {
                return 100;
            } else if (!mobileVertical && !mobileFullSize) {
                return 70;
            }
            return 70;
        } else {
            return 30;
        }
    }

    /*onMount(() => {
        if (mobile == "true") {
            window.addEventListener("resize", () => {
                if (mobileVertical == true) {
                    height = mobileFullSize ? 95 : 70;
                    width = 100;
                } else {
                    height = 95;
                    width = mobileFullSize ? 100 : 70;
                }
            });
            if (mobileVertical == true) {
                height = mobileFullSize ? 95 : 70;
                width = 100;
            } else {
                height = 95;
                width = mobileFullSize ? 100 : 70;
            }
        }
    });*/

    let currentPage = $state(1);
    let pages = {
        1: { title: "", source: "" },
        2: { title: "", source: "" },
        3: { title: "", source: "" },
        4: { title: "", source: "" },
    };

    pages[1] = { title: "About", source: aboutPage };
    pages[2] = { title: "Skills", source: skillsPage };
    pages[3] = { title: "Projects", source: projectsPage };
    pages[4] = { title: "CTF", source: ctfPage };
</script>

<TerminalWindow height="{height}vh" width="{width}vw" style="display: flex; flex-direction: column; justify-content: space-between" {mobile}>
    {#each Object.entries(pages) as [id, page]}
        {#if currentPage == Number(id)}
            <div id="markdown-container" style="overflow-y: scroll; overflow-x: hidden;" in:scale={{ delay: 250 }} out:scale={{ duration: 200 }}>
                <SvelteMarkdown source={page.source} renderers={{ image: MarkdownImage }} />
            </div>
        {/if}
    {/each}
    {#if mobile != "true"}
        <div class={mobile == "false" ? "tabBar" : "mobileTabBar"}>
            {#each Object.entries(pages) as [id, page]}
                <button
                    class={mobile == "false" ? "tabButton" : "mobileTabButton"}
                    class:last={Object.values(pages).length == Number(id)}
                    onclick={() => (currentPage = Number(id))}>{page.title}</button
                >
            {/each}
        </div>
    {/if}
</TerminalWindow>
{#if mobile == "true"}
    <div class={mobile == "false" ? "tabBar" : "mobileTabBar"}>
        {#each Object.entries(pages) as [id, page]}
            <button
                class={mobile == "false" ? "tabButton" : "mobileTabButton"}
                class:last={Object.values(pages).length == Number(id)}
                onclick={() => {
                    currentPage = Number(id);
                }}>{page.title}</button
            >
        {/each}
    </div>
{/if}

<style>
    :global {
        p,
        h1,
        h2,
        #markdown-container {
            font-family: "Ubuntu Mono";
            color: white;
        }
    }

    .tabBar {
        font-family: "Ubuntu Mono";
        left: 0px;
        right: 0px;
        margin-top: 5px;
        padding-top: 2px;
        padding-bottom: 2px;
        border-top-style: solid;
        border-width: 2px;
        border-color: var(--terminalBorderColor);
        width: 100%;
        margin-bottom: 0;
        margin-top: auto;
        align-self: flex-end;
    }

    .mobileTabBar {
        font-family: "Ubuntu Mono";
        left: 0px;
        right: 0px;
        margin-top: 5px;
        padding-top: 2px;
        padding-bottom: 2px;
        border-top-style: solid;
        border-width: 2px;
        background-color: rgba(44, 52, 58, 0.753);
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

    .mobileTabButton {
        all: unset;
        color: white;
        border-right-style: solid;
        border-width: 2px;
        text-align: center;
        border-color: var(--terminalBorderColor);
        width: calc(100% / 4 - 2px);
        transition: 0.3s;
    }

    .tabButton:active {
        background-color: var(--terminalButtonHoverColor);
        box-shadow: 0 0 5px 1px var(--terminalButtonHoverColor);
    }

    .tabButton:hover {
        background-color: var(--terminalButtonHoverColor);
        box-shadow: 0 0 5px 1px var(--terminalButtonHoverColor);
    }

    .tabButton.last {
        border-style: none;
    }

    .mobileTabButton.last {
        border-style: none;
    }
</style>
