<script>
    import TerminalWindow from "./TerminalWindow.svelte";
    let currentPage = $state(0);
</script>
<TerminalWindow height="50vh" width="30vw">
    <div>
        <p>Welcome to decompil.in, the homepage of SpamixOfficial.</p>
        <p>Who am I?</p>
    </div>
    <div class="tabBar">
        <button class="tabButton">About</button>
        <button class="tabButton">Skills</button>
        <button class="tabButton">Projects</button>
        <button class="tabButton last">CTF</button>
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
        width: 100%
    }
    .tabButton {
        all: unset;
        color: white;
        border-right-style: solid;
        text-align: center;
        border-color: var(--terminalBorderColor);
        width: calc(100% / 4 - 10px);
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