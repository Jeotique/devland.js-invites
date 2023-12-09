# @devland.js/invites
## How to use ?
`npm install devland.js@latest`\
`npm install @devland.js/invites`

### Setup : 
````js
const {Client} = require('devland.js')
const InviteLogger = require('@devland.js/invites')

const client = new Client({
    intents: ["GUILDS", "GUILDS_MEMBERS", "GUILD_INVITES"],
    token: "my_token",
    enableAllCaches: true
})
client.logger = new InviteLogger(client)
client.connect()
client.on('ready', () => {
    console.log(`${client.user.tag} connected`)
})
client.logger.on('unknowInvite', (member) => {
    console.log(`${member.user.username} joined ${member.guild.name} but I don't know how`)
})
client.logger.on('knowInvite', (member, invite) => {
    console.log(`${member.user.username} joined ${member.guild.name} with ${invite.code} by ${invite.inviter?.username}`)
})
client.logger.on('vanityInvite', (member, vanity) => {
    console.log(`${member.user.username} joined ${member.guild.name} with vanity url ${vanity.code}`)
})
````