const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/nobita-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/nobita-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/nobita-ping - Check bot latency
/nobita-catfact - Get a cat fact
/nobita-joke - Tells a joke
/nobita-fact - Tells a fact
/nobita-coinflip - Flips a coin
/nobita-rolldice - Rolls a die`
  });
});

app.command("/nobita-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/nobita-fact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
    await respond({ text: `Fact:\n${response.data.text}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a fact." });
  }
});

app.command('/nobita-coinflip', async ({ command, ack, respond }) => {
  await ack();

  try {
    const outcomes = [
      { side: 'Heads'},
      { side: 'Tails'}
    ];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];

    await respond({
      response_type: 'in_channel',
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `I flipped a coin... \n\n*Result:* *${result.side}*!`
          }
        }
      ]
    });
  } catch (error) {
    console.error('Error executing coinflip:', error);
    await respond({ text: '❌ Failed to flip the coin. Try again!' });
  }
});

app.command('/nobita-rolldice', async ({ command, ack, respond }) => {
  await ack();

  try {
    const roll = Math.floor(Math.random() * 6) + 1;

    await respond({
      response_type: 'in_channel',
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `🎲I rolled a die... \n\n*Result:* *${roll}*`
          }
        }
      ]
    });
  } catch (error) {
    console.error('Error executing dice roll:', error);
    await respond({ text: '❌ Failed to roll the die. Try again!' });
  }
});

app.command("/nobita-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();