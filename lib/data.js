const colors = {
  color: [
    ['red'],
    ['pink'],
    ['purple'],
    ['blue'],
    ['lblue'],
    ['teal'],
    ['green'],
    ['gold'],
    ['yellow'],
    ['orange'],
    ['black'],
    ['lewd'],
    ['grey'],
  ],
  statusColor: [
    ['brat'],
    ['meek'],
    ['def'],
    ['sub'],
  ],
  specialColor: [
    ['wraith', '象牙幽灵'],
    ['lustful', '炫彩悉尼'],
    ['rainbow', '炫彩'],
  ],
};
const npcList = {
  love: {
    '': '',
    Avery: '艾弗里的',
    Eden: '伊甸的',
    Kylar: '凯拉尔的',
    Robin: '罗宾的',
    Whitney: '惠特尼的',
    Alex: '艾利克斯的',
    Sydney: '悉尼的',
    'Black Wolf': '黑狼的',
    'Great Hawk': '巨鹰的',
    Bailey: '贝利的',
    Briar: '布莱尔的',
    Charlie: '查里的',
    Darryl: '达里尔的',
    Doren: '多伦的',
    Gwylan: '格威岚的',
    Harper: '哈珀的',
    Jordan: '约旦的',
    Landry: '兰德里的',
    Leighton: '礼顿的',
    Mason: '梅森的',
    Morgan: '摩根的',
    River: '瑞沃的',
    Sam: '萨姆的',
    Sirris: '西里斯的',
    Winter: '温特的',
    Niki: '尼奇的',
    Quinn: '奎恩的',
    Remy: '雷米的',
    Wren: '伦恩的',
    'Ivory Wraith': '象牙怨灵的',
    Zephyr: '泽菲尔的',
  },
  lust: {
    '': '',
    Avery: '艾弗里的',
    Eden: '伊甸的',
    Kylar: '凯拉尔的',
    Mason: '梅森的',
    Robin: '罗宾的',
    Whitney: '惠特尼的',
    Alex: '艾利克斯的',
    Sydney: '悉尼的',
    'Black Wolf': '黑狼的',
    'Great Hawk': '巨鹰的',
  },
  dom: {
    '': '',
    Whitney: '惠特尼的',
    Eden: '伊甸的',
    Alex: '艾利克斯的',
    'Great Hawk': '巨鹰的',
  },
};

// _ = 默认数据
const POSITIVE = ['green', 'red'];
const statics = {
  pc: {
    NAME: 'PC',
    stress: {
      name: '压力',
      value: [6, 12, 24],
    },
    tiredness: {
      name: '疲劳',
      value: [6, 12, 24],
    },
    arousal: {
      name: '性奋',
      value: [600, 1200, 6000],
    },
    trauma: {
      name: '创伤',
      value: [6, 12, 24],
    },
    control: {
      name: '自控',
      colors: POSITIVE,
      value: [10, 20, 50],
    },
    pain: {
      name: '疼痛',
      value: [3, 8, 25],
    },
    awareness: {
      name: '意识',
      colors: ['lblue', 'blue'],
      value: [6, 12, 24],
    },
    innocence: {
      name: '纯真',
      colors: ['blue', 'blue'],
      variant: 'awareness',
      value: [6, 12, 24],
    },
    purity: {
      name: '纯洁',
      colors: POSITIVE,
      value: [10, 12, 60],
    },
    corruption: {
      name: '堕落',
      colors: ['pink', 'teal'],
      value: [1, 3, 6],
    },
  },
  npc: {
    NAME: 'NPC',
    love: {
      name: '好感',
      colors: POSITIVE,
      value: [1, 5, 10],
    },
    lust: {
      name: '性欲',
      colors: ['lewd', 'teal'],
      value: [1, 5, 30],
    },
    dom: {
      name: '支配',
      colors: ['purple', 'lblue'],
      value: [1, 5, 10],
    },
    rtrauma: {
      name: '罗宾的创伤',
      npc: 'Robin',
      value: [1, 5, 10],
      valueType: 'trauma',
    },
    rdom: {
      name: '罗宾的自信',
      colors: ['purple', 'lblue'],
      npc: 'Robin',
      value: [1, 5, 10],
      valueType: 'dom',
    },
    ksuspicion: {
      name: '嫉妒',
      npc: 'Kylar',
      valueType: 'rage',
      value: [2, 10, 30],
    },
    spurity: {
      name: '悉尼的纯洁',
      colors: ['teal', 'purple'],
      npc: 'Sydney',
      valueType: 'purity',
      value: [2, 5, 20],
    },
    scorruption: {
      name: '悉尼的堕落',
      colors: ['teal', 'purple'],
      variant: 'spurity',
      npc: 'Sydney',
      valueType: 'purity',
      value: [2, 5, 20],
    },
    slust: {
      name: '悉尼的性欲',
      colors: ['lewd', 'teal'],
      npc: 'Sydney',
      valueType: 'lust',
      value: [1, 3, 10],
    },
    arage: {
      name: '愤怒',
      npc: 'Avery',
      valueType: 'rage',
      value: [5, 10, 20],
    },
    endear: {
      name: '亲密',
      colors: ['teal', 'pink'],
    },
    obsession: {
      name: '痴迷',
      colors: ['red', 'blue'],
      decorate(input) {
        input.code = input.code.replace('gg', 'g').replace('gg', 'g').replace('ll', 'l').replace('ll', 'l');
        return Object.values(input);
      },
    },
    stockholm: {
      name: '斯德哥尔摩综合征',
      colors: ['blue', 'lblue'],
    },
  },
  skill: {
    NAME: 'PC技能',
    _: {
      colors: POSITIVE,
      value: [3, 6, 18],
      limit: [3, 1],
    },
    science: {
      name: '科学',
      valueMacro: 'scienceskill',
    },
    maths: {
      name: '数学',
      valueMacro: 'mathsskill',
    },
    english: {
      name: '语文',
      valueMacro: 'englishskill',
    },
    history: {
      name: '历史',
      valueMacro: 'historyskill',
    },
    swimming: {
      name: '游泳',
      value: false,
    },
    athletics: {
      name: '运动',
    },
    tending: {
      name: '动植物护理',
    },
    housekeeping: {
      name: '家务',
    },
    danceskill: {
      name: '舞蹈',
    },
    net: {
      name: '网捕技巧',
      value: false,
      limit: [1, 0],
    },
    baton: {
      name: '短棍技巧',
      value: false,
      limit: [3, 0],
    },
    whip: {
      name: '鞭子技巧',
      value: false,
      limit: [3, 0],
    },
  },
  sex: {
    NAME: '性技能',
    _: {
      limit: [1, 0],
      colors: POSITIVE,
    },
    handskill: {
      name: '手部技巧',
    },
    oralskill: {
      name: '口部技巧',
    },
    thighskill: {
      name: '腿部技巧',
    },
    bottomskill: {
      name: '臀部技巧',
    },
    vaginalskill: {
      name: '小穴技巧',
    },
    penileskill: {
      name: '阴茎技巧',
    },
    analskill: {
      name: '后穴技巧',
    },
    feetskill: {
      name: '足部技巧',
    },
    chestskill: {
      name: '胸部技巧',
    },
  },
  orphan: {
    NAME: '孤儿院',
    hope: {
      name: '希望',
      colors: ['teal', 'pink'],
      value: [1, 3, 10],
    },
    reb: {
      name: '叛逆',
      colors: ['def', 'blue'],
      value: [1, 3, 10],
    },
  },
  school: {
    NAME: '学校',
    delinquency: {
      name: '违规行为',
      value: [1, 6, 24],
      valueMacro: 'detention',
    },
    cool: {
      name: '声望',
      colors: POSITIVE,
      value: [1, 15, 40],
      valueMacro: 'status',
    },
  },
  farm: {
    NAME: '农场',
    chaos: {
      name: '混乱',
      colors: POSITIVE,
    },
    aggro: {
      name: '雷米的渗透',
    },
    farm: {
      name: '农场产量',
      colors: POSITIVE,
    },
    daring: {
      name: '胆量',
      colors: POSITIVE,
    },
    obey: {
      name: '顺从',
      colors: ['pink', 'red'],
    },
  },
  others: {
    NAME: '其他',
    grace: {
      name: '恩典',
      colors: POSITIVE,
    },
    hallucinogens: {
      name: '致幻',
      colors: ['lewd'],
      limit: [3, 0],
    },
    alcohol: {
      name: '醉酒',
      colors: ['purple'],
      limit: [3, 0],
    },
    drugged: {
      name: '春药',
      colors: ['pink'],
      limit: [3, 0],
    },
    bodywriting: {
      name: '身体涂鸦',
      colors: ['purple'],
      limit: [3, 0],
    },
    respect: {
      name: '尊敬',
      colors: POSITIVE,
    },
    suspicion: {
      name: '怀疑',
    },
    trust: {
      name: '信任',
      colors: POSITIVE,
    },
    attention: {
      name: '关注度',
      colors: ['lewd', 'lewd'],
    },
    oxygen: {
      name: '氧气',
      colors: ['teal', 'blue'],
      limit: [1, 1],
    },
    lewdity: {
      name: '淫秽',
      colors: ['lewd', 'lewd'],
    },
    saltiness: {
      name: '含盐量',
      colors: POSITIVE,
    },
    shame: {
      name: '羞耻',
    },
    impatience: {
      name: '不耐烦',
    },
    interest: {
      name: '兴趣',
      colors: POSITIVE,
    },
    knowledge: {
      name: '知识',
      colors: POSITIVE,
      limit: [1, 0],
    },
    hunger: {
      name: '饥饿',
    },
    acceptance: {
      name: '接受',
      colors: POSITIVE,
      limit: [1, 0],
    },
    tanned: {
      name: '日晒',
      colors: POSITIVE,
      limit: [3, 0],
    },
  },
};
const diffiColors = {
  very_easy: 'green',
  easy: 'teal',
  medium: 'lblue',
  challenging: 'blue',
  hard: 'purple',
  very_hard: 'pink',
  impossible: 'red',
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
Object.keys(npcList.love).forEach((npc) => {
  if (npc !== '') hollows.npc.push(`npc "${npc}"`);
});

export {
  colors, npcList, statics, diffiColors, lewdColors, tags, hollows,
};
