import {Client, Store} from "devland.js";
import {EventEmitter} from "events";

module.exports = class InviteLogger extends EventEmitter {
    /**
     * @param {Client} client
     */
    constructor(client) {
        super()
        this.setMaxListeners(0)
        Object.defineProperty(this, 'client', { value: client })
        this.cache = {
            invites: {},
            vanity: {}
        }
        this.client.on('ready', () => {
            if(this.client.options.guildsLifeTime > 0) {
                this.client.guilds.forEach(guild => {
                    guild.fetchInvite().then(invites => {
                        invites.forEach(invite => {
                            let _a = this.cache.invites[guild.id] ? this.cache.invites[guild.id] : new Store()
                            _a.set(invite.code, invite.uses)
                            this.cache.invites[guild.id] = _a
                        })
                    }).catch(()=>{})
                    if(guild.features.includes("VANITY_URL")) {
                        guild.fetchVanity().then(vanity => {
                            let _a = this.cache.vanity[guild.id] ? this.cache.vanity[guild.id] : new Store()
                            _a.set(vanity.code, vanity.uses)
                            this.cache.vanity[guild.id] = _a
                        }).catch(()=>{})
                    }
                })
            } else {
                this.client.fetchGuilds().then(guilds => {
                    guilds.forEach(guild => {
                        guild.fetchInvite().then(invites => {
                            invites.forEach(invite => {
                                let _a = this.cache.invites[guild.id] ? this.cache.invites[guild.id] : new Store()
                                _a.set(invite.code, invite.uses)
                                this.cache.invites[guild.id] = _a
                            })
                        }).catch(()=>{})
                        if(guild.features.includes("VANITY_URL")) {
                            guild.fetchVanity().then(vanity => {
                                let _a = this.cache.vanity[guild.id] ? this.cache.vanity[guild.id] : new Store()
                                _a.set(vanity.code, vanity.uses)
                                this.cache.vanity[guild.id] = _a
                            }).catch(()=>{})
                        }
                    })
                })
            }
        })
        this.client.on('guildAdded', guild => {
            guild.fetchInvite().then(invites => {
                invites.forEach(invite => {
                    let _a = this.cache.invites[guild.id] ? this.cache.invites[guild.id] : new Store()
                    _a.set(invite.code, invite.uses)
                    this.cache.invites[guild.id] = _a
                })
            }).catch(()=>{})
            if(guild.features.includes("VANITY_URL")) {
                guild.fetchVanity().then(vanity => {
                    let _a = this.cache.vanity[guild.id] ? this.cache.vanity[guild.id] : new Store()
                    _a.set(vanity.code, vanity.uses)
                    this.cache.vanity[guild.id] = _a
                }).catch(()=>{})
            }
        })
        this.client.on('inviteCreate', invite => {
            const {guild} = invite
            if(!guild) return
            let _a = this.cache.invites[guild.id] ? this.cache.invites[guild.id] : new Store()
            _a.set(invite.code, invite.uses)
            this.cache.invites[guild.id] = _a
        })
        this.client.on('inviteDelete', invite => {
            const {guild} = invite
            if(!guild) return
            let _a = this.cache.invites[guild.id] ? this.cache.invites[guild.id] : new Store()
            _a.delete(invite.code)
            this.cache.invites[guild.id] = _a
        })
        this.client.on('guildRemoved', guild => {
            delete this.cache.invites[guild.id]
            delete this.cache.vanity[guild.id]
        })
        this.client.on('memberJoin', async(member) => {
            const {guild} = member
            if(!guild) return;
            let currentInvites = await guild.fetchInvite().catch(()=>{})
            if(!currentInvites) {
                return this.emit('unknowInvite', member)
            }
            let cache_invites = this.cache.invites[guild.id]
            let cache_vanity = this.cache.vanity[guild.id]
            if(!cache_invites && !cache_vanity) {
                return this.emit('unknowInvite', member)
            }
            let invite_used = currentInvites.find(invite => cache_invites.has(invite.code) && cache_invites.get(invite.code) < invite.uses)
            if(invite_used){
                currentInvites.forEach(invite => {
                    let _a = this.cache.invites[guild.id] ? this.cache.invites[guild.id] : new Store()
                    _a.set(invite.code, invite.uses)
                    this.cache.invites[guild.id] = _a
                })
                return this.emit('knowInvite', member, invite_used)
            } else {
                if(guild.features.includes("VANITY_URL")){
                    guild.fetchVanity().then(vanity => {
                        if(cache_vanity.has(vanity.code) && cache_vanity.get(vanity.code) < vanity.uses){
                            this.cache.vanity[guild.id].set(vanity.code, vanity.uses)
                            return this.emit('vanityInvite', member, vanity)
                        } else {
                            this.cache.vanity[guild.id].set(vanity.code, vanity.uses)
                            return this.emit('unknowInvite', member)
                        }
                    }).catch(()=>{
                        return this.emit('unknowInvite', member)
                    })
                } else {
                    return this.emit('unknowInvite', member)
                }
            }
        })
    }
}