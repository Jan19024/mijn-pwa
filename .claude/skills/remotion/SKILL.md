---
name: remotion
description: Create videos programmatically with Remotion (React-based video framework). Use when the user asks to make, render, or animate a video — "maak een video", "make a video", "render een mp4", "video animatie", "remotion video" — or wants motion graphics, animated titles, data-driven videos, or programmatic video content as .mp4 output.
---

# Remotion video skill

Remotion renders videos from React components: every frame is a React render,
animated via the current frame number. Output is an MP4 (H.264) by default.

## Workflow

1. **Scaffold** a Remotion project from the bundled template (do NOT use
   `npx create-video` — it is interactive and downloads extras):

   ```bash
   cp -r .claude/skills/remotion/template <project-dir>
   cd <project-dir> && npm install
   ```

   Use a directory outside the repo (e.g. the scratchpad) unless the user wants
   the video project committed. `npm install` takes ~1–2 minutes.

2. **Write the composition(s)** in `src/`. Register each one in
   `src/Root.tsx` with `<Composition>` (id, component, durationInFrames, fps,
   width, height). The template ships a working example in `src/HelloVideo.tsx`.

3. **Render**:

   ```bash
   npx remotion render <composition-id> out/video.mp4
   ```

   The template's `remotion.config.ts` auto-detects the pre-installed
   chrome-headless-shell under `/opt/pw-browsers` (Claude Code cloud
   environments), so Remotion does not need to download its own browser. On
   other machines it falls back to Remotion's default browser download.
   Note: the full Chromium binary (`/opt/pw-browsers/chromium`) does NOT work —
   it rejects Remotion's headless mode; only the headless_shell binary does.

4. **Deliver** the MP4 to the user with SendUserFile.

## Animation essentials

- `useCurrentFrame()` — the current frame number; drive all animation from it.
- `useVideoConfig()` — fps, durationInFrames, width, height.
- `interpolate(frame, [0, 30], [0, 1], {extrapolateRight: 'clamp'})` — map
  frame ranges to values (opacity, position, scale…).
- `spring({frame, fps, config: {damping: 12}})` — natural spring motion.
- `<Sequence from={60} durationInFrames={90}>` — time-shift children: inside
  the sequence, `useCurrentFrame()` starts at 0 at frame 60. Compose scenes by
  stacking sequences.
- `<AbsoluteFill>` — a position:absolute full-size container; standard root
  element for scenes and layers.
- Media: `<Img>`, `<Video>`, `<Audio>`, `<OffthreadVideo>` from `remotion`
  (not plain `<img>`/`<video>` — the Remotion variants sync with the timeline).
  Static assets go in `public/` and are referenced with `staticFile('name.png')`.

## Common recipes

- **Fade in**: `opacity: interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'})`
- **Slide up + fade (title)**: combine translateY from `spring()` with opacity interpolate.
- **Scene transitions**: overlap two `<Sequence>`s and cross-fade, or use
  `@remotion/transitions` (`npm i @remotion/transitions`) with
  `<TransitionSeries>` and `fade()`/`slide()`/`wipe()`.
- **Duration maths**: seconds × fps = durationInFrames. 30 fps is the default;
  use 60 fps only when explicitly asked (doubles render time).

## Render options worth knowing

- `--frames=0-59` render a subrange (fast preview of one scene).
- `--scale=0.5` half-resolution test render.
- Still image: `npx remotion still <id> out/frame.png --frame=45`.
- GIF: `npx remotion render <id> out/anim.gif --codec=gif`.
- Transparent video: `--codec=vp8 --image-format=png --pixel-format=yuva420p` (.webm).

## Troubleshooting

- **Browser download fails / no network to Chrome CDN**: the config already
  points at the headless_shell under `/opt/pw-browsers` when present; otherwise
  pass `--browser-executable=<path-to-chrome-headless-shell>`.
- **"Old Headless mode has been removed"**: you pointed Remotion at a full
  Chrome/Chromium binary; use a chrome-headless-shell binary instead.
- **Flicker or missing frames with `<video>`**: use `<OffthreadVideo>`.
- **Slow renders**: lower `--scale`, render subranges while iterating, keep
  compositions at 30 fps, and only render full quality once the content is
  approved.
- **Fonts**: `@remotion/google-fonts` needs network; for offline-safe text use
  system fonts (`font-family: Arial, Helvetica, sans-serif`).
