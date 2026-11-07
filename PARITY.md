# Richup comparison

Reference: https://richup.io/ and a private room created during UI inspection on 2026-11-07.

Observed directly: centered purple home controls; top-left start and clockwise board; rotated edge tiles; circular country flags; character colors; central dice; private room link and chat; player panel; Classic city names and prices; airports and utility names; settings for maximum players, bots, map, double base rent, vacation cash, auctions, prison rent, mortgages, even building, cash and random order. New York's full rent table was observed as 50/200/600/1400/1700/2000.

Implemented: matching board direction, proportions and purple theme; Classic layout/city prices; country badges; CSS dice and player tokens; property details; configurable observed rules; chat; auctions; bots; appearances; existing multiplayer and three extra maps.

Limits: this is a visual and behavioral reconstruction, not recovered Richup source. Most rent schedules use familiar property-game values and have not been individually checked against Richup. Surprise/Treasure events remain a small independent implementation. Dice, symbols and characters are approximations. Original 3D assets, sounds, all animations, public matchmaking, accounts/store, bonus cards and Richup's full trade interface are not reproduced. Never describe this build as verified one-to-one parity.

REA: official repository is checked out at ../rea-tools, and official rea-agents 6.8.0 ran a successful live browser scenario (ev_5b885606afd6b70491f72e5ea8feae3a3a0fc1e2f9751131d7b118cf014ea3b3). Initial automated room inspection stopped at a cookie control; subsequent direct browser inspection verified room settings, property popup, bot population and starting a game. There is no recovered server implementation.

Verification: ten engine tests cover turn rules, transfers, jail, building, Classic facts, auctions, host settings, chat, bots and appearances. Live API smoke test verifies two separate players share board state and cannot act out of turn. Browser QA covers home, creation, room settings, bots and active board layout.
## Express update and REA coverage

The 80-space Express board and three-country passport are original game additions. The two shuffled six-card decks use independently chosen payouts. The deployed client supports holding and using a prison pardon.

REA 6.8.0 analyzed the public room entry module (ev_dc9ab9f1dd532b3442453351e005bd5e0c6b10162759e94273aae3ff4b9df978). The full GamePageContent module exceeded the five-minute analysis deadline. A focused pass analyzed the pardon display function from characters 682031–682312 in GamePageContent-C6z_3bLa.js (ev_b25f0d57be5ee0d64884e34be6d9366fa13f14de90df3366ce189ced00fb5f61). Public client dispatch code identifies a deck when a player uses a pardon. Neither static result establishes the private server's full card ordering or payouts.

REA exercised hosting, opening the directory and inspecting Mumbai at a 390-pixel viewport (ev_a7485bcec3eabdd5e4b03a3b10495545bb75f86139d2d948fd0f313910114d2c). Live two-player verification covers the 80-space room and server turn enforcement.
