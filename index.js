require("dotenv").config();
const axios = require("axios").default;

const pretty = {
  "Regular Battle": [0xcceb4a, "<:RegularBattlle:931329264492609557>"],
  "Ranked Battle": [0xf24c15, "<:RankedBattle:931329264417136700>"],
  "League Battle": [0xf12f77, "<:LeagueBattle:931329264450670623>"],
};

const battleUpdate = async () => {
  const request = await axios({
    method: "GET",
    url: "https://splatoon2.ink/data/schedules.json",
    headers: {
      "User-Agent": "Thanks! ducky#8930",
    },
  });
  const { data } = request;
  let embeds = [];
  for (const mode in data) {
    let battle = data[mode];
    let prettyEmbed = pretty[battle[0].game_mode.name];
    let nextBattle =
      battle[1].game_mode.name !== "Regular Battle"
        ? `(${battle[1].rule.name})`
        : "";
    let embed = {
      title: `${prettyEmbed[1]} ${battle[0].rule.name} (${battle[0].game_mode.name})`,
      description: `
      > **Maps:** ${battle[0].stage_a.name} & ${battle[0].stage_b.name}
      > **Next:** ${battle[1].stage_a.name} & ${battle[1].stage_b.name} ${nextBattle}
      > **Started:** <t:${battle[0].start_time}:R>
      > **Ends:** <t:${battle[0].end_time}:R>
      `,
      image: {
        url: `https://app.splatoon2.nintendo.net${battle[0].stage_a.image}`,
      },
      color: prettyEmbed[0],
    };
    embeds.push(embed);
  }
  axios({
    method: "POST",
    url: process.env.webhook,
    data: {
      embeds,
    },
  });
  const now = new Date();
  const endTime = data.regular[0].end_time;
  const diff = endTime - Math.round(now.getTime() / 1000) + 180;
  setTimeout(battleUpdate, diff * 1000);
};

battleUpdate();

const salmon_runUpdate = async () => {
  const req = await axios({
    method: "GET",
    url: "https://splatoon2.ink/data/coop-schedules.json",
    headers: {
      "User-Agent": "Thanks! ducky#8930",
    },
  });
  const { details } = req.data;
  let weapons = [];
  for (const weaponID of details[0].weapons) {
    let weapon = weaponID.weapon;
    weapons.length !== 3
      ? weapons.push(`${weapon.name}, `)
      : weapons.push(weapon.name);
  }
  const embed = {
    title: "Salmon Run",
    color: 0xf24c15,
    description: `
    > **Map:** ${details[0].stage.name}
    > **Next:** ${details[1].stage.name}
    > **Weapons:** ${weapons.join("")}
    > **Started:** <t:${details[0].start_time}:R>
    > **Ends:** <t:${details[0].end_time}:R>
    `,
    image: {
      url: `https://app.splatoon2.nintendo.net${details[0].stage.image}`,
      name: details[0].stage.name,
    },
  };
  axios({
    method: "POST",
    url: process.env.webhook,
    data: {
      embeds: [embed],
    },
  });
  const now = new Date();
  const endTime = details[0].end_time;
  const diff = endTime - Math.round(now.getTime() / 1000) + 180;
  setTimeout(battleUpdate, diff * 1000);
};

salmon_runUpdate();
