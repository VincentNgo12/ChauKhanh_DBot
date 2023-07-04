module.exports = {
    name: 'back',
    aliases: ['b', 'rewind'],
    description: 'Back to previous song',
    usage: 'back',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ | Mình đâu có hát cài gì đâu.😳`, allowedMentions: { repliedUser: false } });

        if (!queue.history.previousTrack)
            return message.reply({ content: `❌ | Trước đấy mình đâu có hát.😳`, allowedMentions: { repliedUser: false } });

        await queue.history.back();
        return await message.react('💩');
    },

    async slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ | Mình đâu có hát cài gì đâu.😳`, allowedMentions: { repliedUser: false } });

        if (!queue.history.previousTrack)
            return interaction.reply({ content: `❌ | Trước đấy mình đâu có hát.😳`, allowedMentions: { repliedUser: false } });

        await queue.history.back();
        return await interaction.reply("✅ | Oke!!!😋😋😋");
    },
};