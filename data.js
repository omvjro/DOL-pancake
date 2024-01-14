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
    Whitney: '惠特尼的',
    Eden: '伊甸的',
    Alex: '艾利克斯的',
    'Great Hawk': '巨鹰的',
  },
};
const statics = {
  pc: {
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
      positive: true,
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
      positive: true,
      value: [10, 12, 60],
    },
    corruption: {
      name: '堕落',
      colors: ['pink', 'teal'],
      value: [1, 3, 6],
    },
  },
  npc: {
    love: {
      name: '好感',
      positive: true,
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
      limit: [3, 0],
    },
  },
  skill: {
    science: {
      name: '科学',
      valueMacro: 'scienceskill',
      value: [3, 6, 18],
    },
    maths: {
      name: '数学',
      valueMacro: 'mathsskill',
      value: [3, 6, 18],
    },
    english: {
      name: '语文',
      valueMacro: 'englishskill',
      value: [3, 6, 18],
    },
    history: {
      name: '历史',
      valueMacro: 'historyskill',
      value: [3, 6, 18],
    },
    swimming: {
      name: '游泳',
    },
    athletics: {
      name: '运动',
      value: [3, 6, 18],
    },
    tending: {
      name: '护理',
      value: [3, 6, 18],
    },
    housekeeping: {
      name: '家务',
      value: [3, 6, 18],
    },
    danceskill: {
      name: '舞蹈',
      value: [3, 6, 18],
    },
  },
  others: {
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
    delinquency: {
      name: '违规行为',
      value: [1, 6, 24],
      valueMacro: 'detention',
    },
    cool: {
      name: '声望',
      positive: true,
      value: [1, 15, 40],
      valueMacro: 'status',
    },
    attention: {
      name: '关注度',
      colors: ['lewd', 'lewd'],
    },
    respect: {
      name: '尊敬',
      positive: true,
    },
    suspicion: {
      name: '怀疑',
    },
    // oxygen: {
    //   name: '氧气',
    //   colors: ['blue', 'blue'],
    //   limit: [1, 1],
    // },
    chaos: {
      name: '混乱',
      positive: true,
    },
    aggro: {
      name: '雷米的渗透',
    },
    trust: {
      name: '信任',
      positive: true,
    },
    lewdity: {
      name: '淫秽',
      colors: ['lewd', 'lewd'],
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
const tagColors = {
  1: 'teal',
  2: 'lblue',
  3: 'blue',
  4: 'purple',
  5: 'pink',
  6: 'red',
  crime: 'red',
  defianttext: 'def',
  submissivetext: 'sub',
  wolfgirl: 'blue',
  cat: 'blue',
  cow: 'blue',
  harpy: 'gold',
  fox: 'orange',
  angel: 'gold',
  fallenangel: 'black',
  demon: 'red',
};

export {
  colors, npcList, statics, diffiColors, tagColors,
};
