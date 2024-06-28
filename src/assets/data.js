const colors = {
  color: [
    'red',
    'pink',
    'purple',
    'blue',
    'lblue',
    'teal',
    'green',
    'gold',
    'yellow',
    'orange',
    'black',
    'lewd',
    'grey',
  ],
  statusColor: [
    'brat',
    'meek',
    'def',
    'sub',
  ],
  specialColor: [
    ['wraith', '象牙幽灵'],
    ['lustful', '炫彩悉尼'],
    ['rainbow', '炫彩'],
  ],
};

const hollows = {
  generate: [],
  person: [],
  npc: [],
};
for (let i = 1; i <= 6; i += 1) {
  hollows.generate.push(`generate${i}`);
  hollows.person.push(`person${i}`);
}
// Object.keys(npcList.love).forEach((npc) => {
//   if (npc !== '') hollows.npc.push(`npc "${npc}"`);
// });

export {
  colors, hollows,
};
