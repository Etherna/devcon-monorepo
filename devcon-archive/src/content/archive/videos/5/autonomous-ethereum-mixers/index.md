---
edition: 5
title: "Autonomous Ethereum mixers"
description: "I demonstrate how to build a profitable, self-sustaining Ethereum mixer. I use zkSNARKs as the core mixer mechanism [1], and invest the shielded money pool into a risk-free DeFi application to earn interest [2].  The mixer complies with Vitalik's interface proposal [3].
The general privacy setup is similar to ZCash: a \"shielded\" pool, which contains all the ETH deposited by people who desire anonymity, and \"notes\" that can be withdrawn without revealing any connection to the deposit transaction. Importantly, this provides K-anonymity for K → ∞, unlike ring signatures or MimbleWimble, providing K-anonymity for K < 15 (ring signature size in Monero, block size in MimbleWimble) and thus prone to several attacks [4, 5].
The pool of ETH deposited into the mixer and awaiting withdrawal is supplied into the Uniswap WETH converter (~4%/year ROI). Unfortunately, that revenue cannot be supplied to the users, since the exact amount would give away precisely when the deposit was made. On the other hand, it can be used to subsidize infrastructure and \"keepers\" that made the withdrawal transactions for clients – a known problem for all previous mixer designs.
[1] https://github.com/barryWhiteHat/miximus
[2] https://zumzoom.github.io/analytics/uniswap/roi.html ETH-WETH pair
[3] https://hackmd.io/@HWeNw8hNRimMm2m2GH56Cw/rJj9hEJTN?type=view
[4] https://ipfs.io/ipfs/QmWYTeggKeL8xBitA8uQWAaNDWfFrUHXAxBXkvmnisdDw7
[5] https://eprint.iacr.org/2019/455.pdf"
youtubeUrl: "https://www.youtube.com/embed/qNGskbgOY-E"
ipfsHash: "QmUdsXy8F4AhKckGm6h2ub3Xwqj7WFgtuSws2PPfrBBcdJ"
ethernaIndex: "https://etherna.io/embed/63449c28c42a10b8427094f0"
ethernaPermalink: "https://etherna.io/embed/e43687ddfd9af03292d176deab700a1a5a3c38cae64be6508d857787e7cd16dd"
duration: 388
expertise: "intermediate"
type: "Breakout"
track: "Developer Infrastructure"
keywords: ['technical']
tags: ['Developer Infrastructure']
speakers: ['Ivan Bogatyi']
---
