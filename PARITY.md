# Richup comparison

Reference: https://richup.io/ and a private room created during UI inspection on 2026-11-07.

Observed directly: centered purple home controls; top-left start and clockwise board; rotated edge tiles; circular country flags; character colors; central dice; private room link and chat; player panel; Classic city names and prices; airports and utility names; settings for maximum players, bots, map, double base rent, vacation cash, auctions, prison rent, mortgages, even building, cash and random order. New York's full rent table was observed as 50/200/600/1400/1700/2000.

Implemented: matching board direction, proportions and purple theme; Classic layout/city prices; country badges; CSS dice and player tokens; property details; configurable observed rules; chat; auctions; bots; appearances; existing multiplayer and three extra maps.

Limits: this is a visual and behavioral reconstruction, not recovered Richup source. Most rent schedules use familiar property-game values and have not been individually checked against Richup. Surprise/Treasure events remain a small independent implementation. Dice, symbols and characters are approximations. Original 3D assets, sounds, all animations, public matchmaking, accounts/store, bonus cards and Richup's full trade interface are not reproduced. Never describe this build as verified one-to-one parity.

REA: official repository is checked out at ../rea-tools, and official rea-agents 6.8.0 ran a successful live browser scenario (ev_5b885606afd6b70491f72e5ea8feae3a3a0fc1e2f9751131d7b118cf014ea3b3). Initial automated room inspection stopped at a cookie control; subsequent direct browser inspection verified room settings, property popup, bot population and starting a game. There is no recovered server implementation.

Verification: ten engine tests cover turn rules, transfers, jail, building, Classic facts, auctions, host settings, chat, bots and appearances. Live API smoke test verifies two separate players share board state and cannot act out of turn. Browser QA covers home, creation, room settings, bots and active board layout.
