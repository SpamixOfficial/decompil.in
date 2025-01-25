<script>
    import { tweened } from "svelte/motion";
    import { fetchData } from "$lib/spotify";
    import { scale, fade } from "svelte/transition";
    import { color, rgb, interpolate } from "d3";
    import { onMount } from "svelte";
    import { prominent } from "color.js";
    import TerminalWindow from "$lib/TerminalWindow.svelte";
    import Biography from "$lib/Biography.svelte";
    let pageIsLoaded = $state(false);
    let bkgGradient = $state(true);
    let spotHelpPage = $state(false);
    let showSpot = $state(false);
    let spotImgSrc = $state("");
    let spotArtist = $state("");
    let spotTitle = $state("");
    let spotAlbum = $state("");

    // background changing setup
    let defaultColors = [
        rgb(40, 20, 20),
        rgb(40, 10, 10),
        rgb(20, 0, 0),
        rgb(15, 0, 0),
    ];
    let defaultTerminalBorderColor = color("#b92226");
    let defaultTerminalButtonHoverColor = color("#b922261e");
    let defaultTextColor = color("#ffffff");
    let colorMap = {
        gradientColors: defaultColors,
        textColor: defaultTextColor,
        terminalBorderColor: defaultTerminalBorderColor,
        terminalButtonHoverColor: defaultTerminalButtonHoverColor,
    };
    const textColor = tweened(defaultTextColor, { interpolate });
    const terminalBorderColor = tweened(defaultTerminalBorderColor, {
        interpolate,
    });
    const terminalButtonHoverColor = tweened(defaultTerminalButtonHoverColor, {
        interpolate,
    });
    const colors = tweened(defaultColors, { interpolate });
    $effect(() => {
        document.body.style.setProperty(
            "--bkgGrad",
            `linear-gradient(-45deg, ${$colors.join(", ")})`
        );
        document.body.style.setProperty("--textColor", $textColor);
        document.body.style.setProperty(
            "--terminalBorderColor",
            $terminalBorderColor
        );
        document.body.style.setProperty(
            "--terminalButtonHoverColor",
            $terminalButtonHoverColor
        );
    });

    async function updateColorMap(img) {
        let color_data = await prominent(img, { amount: 4 });
        let lightness = 0;
        color_data.forEach(function (e, _) {
            lightness += 0.2126 * e[0] + 0.7152 * e[1] + 0.0722 * e[2];
        });
        lightness = lightness / color_data.length / 255;

        colorMap.gradientColors = [];

        let border_color = [0, 0, 0];

        // Get the most vibrant color
        // We don't actually want to sort this thing, so we return 0 every time
        color_data.sort((a, b) => {
            let amax = Math.max.apply(Math, a);
            let amin = Math.min.apply(Math, a);
            let bmax = Math.max.apply(Math, b);
            let bmin = Math.min.apply(Math, b);
            let avib = ((amax + amin) * (amax + amin)) / amax;
            let bvib = ((bmax + bmin) * (bmin + bmax)) / bmax;
            if (avib > bvib) {
                border_color = a;
                return 0;
            } else if (bvib > avib) {
                border_color = b;
                return 0;
            } else {
                return 0;
            }
        });

        // Depending on the lightness we will either sort by darkness or lightness!
        color_data.sort((a, b) => {
            let alightness = 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
            let blightness = 0.2126 * b[0] + 0.7152 * b[1] + 0.0722 * b[2];
            if (lightness > 0.5) {
                if (alightness > blightness) {
                    return 1;
                } else if (blightness > alightness) {
                    return -1;
                } else {
                    return 0;
                }
            } else {
                if (alightness < blightness) {
                    return 1;
                } else if (blightness < alightness) {
                    return -1;
                } else {
                    return 0;
                }
            }
        });
        color_data.forEach((a) => {
            colorMap.gradientColors.push(rgb(a[0], a[1], a[2]));
        });

        colorMap.textColor = rgb(
            Math.floor(Math.max(1 - lightness + 3, 255) * 255),
            Math.floor(Math.max(1 - lightness + 3, 255) * 255),
            Math.floor(Math.max(1 - lightness + 3, 255) * 255)
        );

        if (
            (0.2126 * border_color[0] +
                0.7152 * border_color[1] +
                0.0722 * border_color[2]) /
                255 <
            0.5
        ) {
            border_color.forEach((x, i) => {
                border_color[i] = x * 2;
            });
        }

        colorMap.terminalBorderColor = rgb(
            border_color[0],
            border_color[1],
            border_color[2]
        );
        colorMap.terminalButtonHoverColor = colorMap.terminalBorderColor;
        colorMap.terminalButtonHoverColor.opacity = 0.3;
    }

    function setBkg() {
        $colors = colorMap.gradientColors;
        $textColor = colorMap.textColor;
        $terminalBorderColor = colorMap.terminalBorderColor;
        $terminalButtonHoverColor = colorMap.terminalButtonHoverColor;
    }

    onMount(() => {
        async function spotifyChore() {
            let spot_data = await fetchData();
            if (!spot_data.is_playing) {
                showSpot = false;
                $colors = defaultColors;
                $textColor = defaultTextColor;
                $terminalBorderColor = defaultTerminalBorderColor;
                $terminalButtonHoverColor = defaultTerminalButtonHoverColor;
            } else {
                showSpot = true;
                spotImgSrc = spot_data.image_url;
                spotTitle = spot_data.title;
                spotArtist = "";
                spot_data.artists.entries().forEach((element) => {
                    const [index, e] = element;
                    spotArtist = spotArtist.concat(
                        `<a style="color: inherit" href=${e.url}>${index > 0 ? ", " : ""}${e.name}</a>`
                    );
                });
                //setBkg(await extractColors(spot_data.image_url));
                await updateColorMap(spot_data.image_url);
                setBkg();
            }
        }

        const interval = setInterval(spotifyChore, 3000);
        spotifyChore();

        pageIsLoaded = true;

        return () => clearInterval(interval);
    });
</script>

<!--Hotfix because the page glitches before style is properly loaded-->
{#if pageIsLoaded}

    <div class:bkgGradient></div>

    <div style="display: flex;">
        <div transition:scale alt="I'm draggable!">
            <Biography mobile=false/>
        </div>

        {#if showSpot}
            <div transition:scale style="display: inline-block;" alt="Me too!">
                <TerminalWindow width="20vw" mobile=false>
                    <img
                        transition:fade
                        draggable="false"
                        src={spotImgSrc}
                        alt="Spotify Cover Art"
                    />
                    <p>{@html spotArtist}</p>
                    <p>{spotTitle}</p>
                    <hr class="spotHr" />
                    <i><p>Spamix's current playing track</p></i>
                </TerminalWindow>
            </div>
        {/if}
    </div>
{/if}

<svelte:head>
    <title>Decompilin</title>
    <link
        href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<style>
    :global(body) {
        background-color: black;
        --bkgGrad: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    }

    @keyframes gradientAnim {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    .bkgGradient {
        background: var(--bkgGrad);
        background-color: black;
        position: fixed;
        inset: 1rem;
        filter: blur(100px);
        z-index: -1;
        animation: gradientAnim 10s ease infinite;
        pointer-events: none;
    }

    :global(p) {
        color: var(--textColor);
    }
    :global(h1) {
        color: var(--textColor);
    }
    :global(a) {
        color: inherit;
    }
    .spotHr {
        border-width: 2px;
        border-style: solid;
        border-color: var(--terminalBorderColor);
        border-radius: 15px;
    }
    img {
        grid-area: 1 / 1;
        width: 20vw;
        border-radius: 15px;
        border-width: 2px;
    }
</style>
