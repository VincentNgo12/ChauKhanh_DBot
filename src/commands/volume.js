module.exports = {
    name: 'volume',
    aliases: ['v'],
    description: `Điều chỉnh âm lượng ca hát của mình.😘`,
    usage: 'v <0-100>',
    voiceChannel: true,
    options: [
        {
            name: "volume",
            description: "Âm lượng",
            type: 4,
            required: true,
            min_value: 1
        }
    ],

    async execute(client, message, args) {
        const maxVolume = client.config.maxVolume;
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ | Mình đâu có hát .`, allowedMentions: { repliedUser: false } });


        await message.react('👍');
        const vol = parseInt(args[0], 10);

        if (!vol)
            return message.reply({ content: `Current volume: **${queue.node.volume}** 🔊\n**To change the volume, with \`1\` to \`${maxVolume}\` Type a number between.**`, allowedMentions: { repliedUser: false } });

        if (queue.volume === vol)
            return message.reply({ content: `❌ | The volume you want to change is already the current volume.`, allowedMentions: { repliedUser: false } });

        if (vol < 0 || vol > maxVolume)
            return message.reply({ content: `❌ | **Type a number from \`1\` to \`${maxVolume}\` to change the volume .**`, allowedMentions: { repliedUser: false } });


        const success = queue.node.setVolume(vol);
        const replymsg = success ? `🔊 **${vol}**/**${maxVolume}**%` : `❌ | Something went wrong.`;
        return message.reply({ content: replymsg, allowedMentions: { repliedUser: false } });
    },

    async slashExecute(client, interaction) {
        const maxVolume = client.config.maxVolume;
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ | There is no music currently playing.`, allowedMentions: { repliedUser: false } });

        const vol = parseInt(interaction.options.getInteger("volume"), 10);

        if (!vol)
            return interaction.reply({ content: `Current volume: **${queue.node.volume}** 🔊\n**To change the volume, with \`1\` to \`${maxVolume}\` Type a number between.**`, allowedMentions: { repliedUser: false } });

        if (queue.volume === vol)
            return interaction.reply({ content: `❌ | The volume you want to change is already the current volume.`, allowedMentions: { repliedUser: false } });

        if (vol < 0 || vol > maxVolume)
            return interaction.reply({ content: `❌ | **Type a number from \`1\` to \`${maxVolume}\` to change the volume .**`, allowedMentions: { repliedUser: false } });


        const success = queue.node.setVolume(vol);
        const replymsg = success ? `🔊 **${vol}**/**${maxVolume}**%` : `❌ | Something went wrong.`;
        return interaction.reply({ content: replymsg, allowedMentions: { repliedUser: false } });
    },
};