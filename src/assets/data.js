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

// _ = 默认数据
const POSITIVE = ['green', 'red'];
const statics = {
  pc: {
    stress: {
      value: [6, 12, 24],
    },
    tiredness: {
      value: [6, 12, 24],
    },
    arousal: {
      value: [600, 1200, 6000],
    },
    trauma: {
      value: [6, 12, 24],
    },
    control: {
      colors: POSITIVE,
      value: [10, 20, 50],
    },
    pain: {
      value: [3, 8, 25],
    },
    awareness: {
      colors: ['lblue', 'blue'],
      value: [6, 12, 24],
    },
    innocence: {
      colors: ['blue', 'blue'],
      variant: 'awareness',
      value: [6, 12, 24],
    },
    purity: {
      colors: POSITIVE,
      value: [10, 12, 60],
    },
    corruption: {
      colors: ['pink', 'teal'],
      value: [1, 3, 6],
    },
  },
  npc: {
    love: {
      colors: POSITIVE,
      value: [1, 5, 10],
      npcs: [
        'Avery',
        'Eden',
        'Kylar',
        'Robin',
        'Whitney',
        'Alex',
        'Sydney',
        'Black Wolf',
        'Great Hawk',
        'Bailey',
        'Briar',
        'Charlie',
        'Darryl',
        'Doren',
        'Gwylan',
        'Harper',
        'Jordan',
        'Landry',
        'Leighton',
        'Mason',
        'Morgan',
        'River',
        'Sam',
        'Sirris',
        'Winter',
        'Niki',
        'Quinn',
        'Remy',
        'Wren',
        'Ivory Wraith',
        'Zephyr',
      ],
    },
    lust: {
      colors: ['lewd', 'teal'],
      value: [1, 5, 30],
      npcs: [
        'Avery',
        'Eden',
        'Kylar',
        'Mason',
        'Robin',
        'Whitney',
        'Alex',
        'Sydney',
        'Black Wolf',
        'Great Hawk',
      ],
    },
    dom: {
      colors: ['purple', 'lblue'],
      value: [1, 5, 10],
      npcs: [
        'Whitney',
        'Eden',
        'Alex',
        'Great Hawk',
      ],
    },
    rtrauma: {
      npc: 'Robin',
      value: [1, 5, 10],
      valueType: 'trauma',
    },
    rdom: {
      colors: ['purple', 'lblue'],
      npc: 'Robin',
      value: [1, 5, 10],
      valueType: 'dom',
    },
    ksuspicion: {
      npc: 'Kylar',
      valueType: 'rage',
      value: [2, 10, 30],
    },
    spurity: {
      colors: ['teal', 'purple'],
      npc: 'Sydney',
      valueType: 'purity',
      value: [2, 5, 20],
    },
    scorruption: {
      colors: ['teal', 'purple'],
      variant: 'spurity',
      npc: 'Sydney',
      valueType: 'purity',
      value: [2, 5, 20],
    },
    slust: {
      colors: ['lewd', 'teal'],
      npc: 'Sydney',
      valueType: 'lust',
      value: [1, 3, 10],
    },
    arage: {
      npc: 'Avery',
      valueType: 'rage',
      value: [5, 10, 20],
    },
    endear: {
      colors: ['teal', 'pink'],
    },
    obsession: {
      colors: ['red', 'blue'],
      decorate(input) {
        input.code = input.code.replace('gg', 'g').replace('gg', 'g').replace('ll', 'l').replace('ll', 'l');
        return Object.values(input);
      },
    },
    stockholm: {
      colors: ['blue', 'lblue'],
    },
  },
  skill: {
    _: {
      colors: POSITIVE,
      value: [3, 6, 18],
      limit: [3, 1],
    },
    science: {
      valueMacro: 'scienceskill',
    },
    maths: {
      valueMacro: 'mathsskill',
    },
    english: {
      valueMacro: 'englishskill',
    },
    history: {
      valueMacro: 'historyskill',
    },
    swimming: {
      value: false,
    },
    athletics: {},
    tending: {},
    housekeeping: {},
    danceskill: {},
    net: {
      value: false,
      limit: [1, 0],
    },
    baton: {
      value: false,
      limit: [3, 0],
    },
    whip: {
      value: false,
      limit: [3, 0],
    },
  },
  sex: {
    _: {
      limit: [1, 0],
      colors: POSITIVE,
    },
    handskill: {},
    oralskill: {},
    thighskill: {},
    bottomskill: {},
    vaginalskill: {},
    penileskill: {},
    analskill: {},
    feetskill: {},
    chestskill: {},
  },
  orphan: {
    hope: {
      colors: ['teal', 'pink'],
      value: [1, 3, 10],
    },
    reb: {
      colors: ['def', 'blue'],
      value: [1, 3, 10],
    },
  },
  school: {
    delinquency: {
      value: [1, 6, 24],
      valueMacro: 'detention',
    },
    cool: {
      colors: POSITIVE,
      value: [1, 15, 40],
      valueMacro: 'status',
    },
  },
  farmland: {
    chaos: {
      colors: POSITIVE,
    },
    aggro: {},
    farm: {
      colors: POSITIVE,
    },
    daring: {
      colors: POSITIVE,
    },
    obey: {
      colors: ['pink', 'red'],
    },
  },
  others: {
    grace: {
      colors: POSITIVE,
    },
    hallucinogens: {
      colors: ['lewd'],
      limit: [3, 0],
    },
    alcohol: {
      colors: ['purple'],
      limit: [3, 0],
    },
    drugged: {
      colors: ['pink'],
      limit: [3, 0],
    },
    bodywriting: {
      colors: ['purple'],
      limit: [3, 0],
    },
    respect: {
      colors: POSITIVE,
    },
    suspicion: {},
    trust: {
      colors: POSITIVE,
    },
    attention: {
      colors: ['lewd', 'lewd'],
    },
    oxygen: {
      colors: ['teal', 'blue'],
      limit: [1, 1],
    },
    lewdity: {
      colors: ['lewd', 'lewd'],
    },
    saltiness: {
      colors: POSITIVE,
    },
    shame: {},
    impatience: {},
    interest: {
      colors: POSITIVE,
    },
    knowledge: {
      colors: POSITIVE,
      limit: [1, 0],
    },
    hunger: {},
    acceptance: {
      colors: POSITIVE,
      limit: [1, 0],
    },
    tanned: {
      colors: POSITIVE,
      limit: [3, 0],
    },
  },
};
const lewdColors = [
  'teal',
  'lblue',
  'blue',
  'purple',
  'pink',
  'red',
];
const tags = {
  trans: {
    NAME: '转化',
    wolfgirl: {
      name: '狼',
      color: 'blue',
    },
    cat: {
      name: '猫',
      color: 'blue',
    },
    cow: {
      name: '奶牛',
      color: 'blue',
    },
    harpy: {
      name: '哈比',
      color: 'gold',
    },
    fox: {
      name: '狐狸',
      color: 'orange',
    },
    angel: {
      name: '天使',
      color: 'gold',
    },
    fallenangel: {
      name: '堕天使',
      color: 'black',
    },
    demon: {
      name: '恶魔',
      color: 'red',
    },
  },
  // traits: {
  //   NAME: '特质',
  //   _: {
  //     color: 'lewd',
  //   },
  //   orgasmTrait: {
  //     name: ['享乐主义', '高潮上瘾'],
  //   },
  //   chokeTrait: {
  //     name: '窒息上瘾',
  //   },
  //   ejacTrait: {
  //     name: ['粘液专家', '储精罐'],
  //   },
  //   molestTrait: {
  //     name: ['优雅', '消遣玩物'],
  //   },
  //   repeTrait: {
  //     name: ['幸存者', '性玩具'],
  //   },
  //   bestialityTrait: {
  //     name: ['驯兽师', '母狗'],
  //   },
  //   voreTrait: {
  //     name: ['探险者', '美味可口'],
  //   },
  //   milkTrait: {
  //     name: ['牛奶发烧友', '牛奶瘾君子'],
  //   },
  // },
  others: {
    NAME: '其他',
    crime: {
      name: '犯罪',
      color: 'red',
    },
    defianttext: {
      name: '反抗',
      color: 'def',
    },
    submissivetext: {
      name: '顺从',
      color: 'sub',
    },
    dangerousText: {
      name: '危险的',
      color: 'red',
    },
  },
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
  colors,  statics, lewdColors, tags, hollows,
};
