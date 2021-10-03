const {
    SlashCommand,
    CommandOptionType,
    ComponentType,
} = require("slash-create");
const { QueryType } = require("discord-player");

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "search",
            description: "search a song from youtube",
            options: [
                {
                    name: "query",
                    type: CommandOptionType.STRING,
                    description: "The song you want to play",
                    required: true,
                },
            ],

            guildIDs: process.env.DISCORD_GUILD_ID
                ? [process.env.DISCORD_GUILD_ID]
                : undefined,
        });
    }

    async run(ctx) {
        try {
            const { client } = require("..");

            await ctx.defer();

            const guild = client.guilds.cache.get(ctx.guildID);
            const channel = guild.channels.cache.get(ctx.channelID);
            const query = ctx.options.query;

            const msg = await ctx.send(`⏱ | Loading your result search ...`);
            const msgLoadingId = msg.id;

            const searchResult = await client.player
                .search(query, {
                    requestedBy: ctx.user,
                    searchEngine: QueryType.AUTO,
                })
                .catch(() => {
                    console.log("he");
                });
            if (!searchResult || !searchResult.tracks.length)
                return void ctx.sendFollowUp({
                    content: "No results were found!",
                });

            const fields = searchResult.tracks.slice(0, 5).map((val, i) => {
                if (val.title.length > 97) {
                    val.title = val.title.substring(0, 94) + "...";
                }

                return {
                    label: `${i + 1}. ${val.title}`,
                    value: `${i + 1}. ${val.title}`,
                };
            });
            await ctx.edit(msgLoadingId, "What song do you want?", {
                components: [
                    {
                        type: ComponentType.ACTION_ROW,
                        components: [
                            {
                                type: ComponentType.SELECT,
                                custom_id: "song_select",
                                placeholder: "Choose a song",
                                options: fields,
                            },
                        ],
                    },
                ],
            });

            ctx.registerComponent("song_select", async (selectCtx) => {
                try {
                    const valueSelect = selectCtx.values[0].split(". ")[1];
                    await ctx.edit(
                        msgLoadingId,
                        "You selected the following song: " + valueSelect
                    );

                    const selectedTrack = searchResult.tracks.filter((val) =>
                        val.title.includes(valueSelect)
                    )[0];

                    const queue = await client.player.createQueue(guild, {
                        metadata: channel,
                    });

                    const member =
                        guild.members.cache.get(ctx.user.id) ??
                        (await guild.members.fetch(ctx.user.id));
                    try {
                        if (!queue.connection)
                            await queue.connect(member.voice.channel);
                    } catch {
                        void client.player.deleteQueue(ctx.guildID);
                        return void ctx.send({
                            content: "Could not join your voice channel!",
                        });
                    }

                    await ctx.send({
                        content: `⏱ | Loading your ${
                            searchResult.playlist ? "playlist" : "track"
                        }...`,
                    });

                    queue.addTrack(selectedTrack);

                    if (!queue.playing) await queue.play();
                    ctx.delete(msgLoadingId);
                } catch (error) {}
            });
        } catch (error) {}
    }
};
