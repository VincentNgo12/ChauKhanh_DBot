module.exports = {
    name: 'pause',
    aliases: [],
    description: 'Pause current song',
    usage: 'pause',
    voiceChannel: true,
    options: [],

    execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ | Mình đâu có hát bài gì đâu.😳`, allowedMentions: { repliedUser: false } });

        const success = queue.node.pause();
        return success ? message.react('⏸️') : message.reply({ content: `❌ | Hình như có gì đó sai sai!`, allowedMentions: { repliedUser: false } });
    },

    slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ | Mình đâu có hát cài gì đâu.😳`, allowedMentions: { repliedUser: false } });

        const success = queue.node.pause();
        return success ? interaction.reply("⏸️ | Music paused.") : interaction.reply({ content: `❌ | Hình như có gì đó sai sai!`, allowedMentions: { repliedUser: false } });
    },
};