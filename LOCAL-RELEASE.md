# Local UI release — 7 November 2026

The board now uses the available desktop width beside a bounded sidebar. All city labels, flags, prices, and corner symbols remain upright. Readable mode supports zoom and scrolling. Fit board fits both available width and height; phones show a compact flag overview. Turn actions remain accessible above the board. Find my pawn centers the player's tile.

Local startup requires only Node.js 22 or newer. Rooms persist in `.local/rooms.json` through server restarts. The Wi-Fi launch option prints local network addresses. Saved player credentials and rooms are excluded from the source ZIP.

Verified with the installed official REA CLI 6.8.0:

- Public Richup page observation: `ev_b0b7974f9b8008ce9a64bb0169e040df68a5e1f2780b7078fa880fab24ad550d`.
- Desktop readable layout at 1440 × 1000: `ev_f8b3289225e1eedbe4df32441f900980d2f2a93c3fe1d13e8cca77f522b265b3`.
- Phone layout at 390 × 844, including fit, zoom, pawn navigation, directory and deed: `ev_aae2f807f9db19dee8b662e674b37b9db487d35c941d50a2f06b3b96755c8c12`.
- Final desktop fit with all four board edges visible and upright: `ev_7fcda13bd0b3ba34ac0e6097ab1ba3bff4bade70f14e462d9a7e1131368338de`.

All 13 game-engine tests passed. A two-player HTTP smoke check passed for the 80-space map, shared state, private player tokens, and turn enforcement. Room state, player cash, and revision were verified after restarting the local server.

The existing Sites account returned project-not-found and no owned sites. This release is local and has not been published to the previous URL. It does not establish full one-to-one Richup parity. See PARITY.md for the research scope and remaining differences.
