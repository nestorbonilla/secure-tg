# Secure Telegram Notification System Overview

This monorepo contains three interconnected projects: `tg-bot`, `tg-scone`, and `website`. Each component is a vital piece in the machinery that powers our secure, personalized Telegram notification system.

## tg-bot

`tg-bot` is a Telegram bot designed to handle user subscriptions. Upon a user's subscription, the bot generates and sends a URL. This URL directs the user to our website, where they can secure their Telegram information. The bot operates continuously, listening for and responding to user interactions.

## tg-scone

`tg-scone` is a secure iExec application in our tech stack. Given the Telegram bot token, recipient address, and a message, it spins up a Docker container. This container then accesses the dataset tied to the recipient's address and dispatches a custom-crafted message as a personalized notification. It's important to note that due to pending SCONE registration approval, this application's production testing is currently on hold.

## website

`website` is a web application developed using ViteJS. It serves as the interface for users to interact with our system. Here, users can secure their Telegram information by creating a dataset that includes their Telegram ID and Telegram username. The website also provides functionality for users to grant our application access to this dataset. With this access, the application can send personalized notifications to the user.

Collectively, `tg-bot`, `tg-scone`, and `website` form the core of the notification system, each playing a specific role to ensure the secure delivery of personalized notifications.