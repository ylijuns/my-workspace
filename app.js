// 初始化与本地存储
const getLocalData = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};
const setLocalData = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

const updateProfileUI = () => {
  const cachedName = localStorage.getItem('admin_profile_name') || '同工';
  const cachedAvatar = localStorage.getItem('admin_profile_avatar') || 'https://img.icons8.com/color/512/user-male-circle.png';

  const sidebarName = document.getElementById('lbl-sidebar-name');
  const sidebarAvatar = document.getElementById('lbl-sidebar-avatar');

  if (sidebarName) sidebarName.textContent = cachedName;
  if (sidebarAvatar) {
    sidebarAvatar.style.backgroundImage = `url('${cachedAvatar}')`;
  }
};

// -------------------------------------------------------------
// 1. 路由与主题切换
// -------------------------------------------------------------
const setupNavigation = () => {
  const menuItems = document.querySelectorAll('.menu-item');
  const pages = document.querySelectorAll('.page');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const mobileTitle = document.getElementById('lbl-mobile-title');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      
      // 切换高亮
      menuItems.forEach(m => m.classList.remove('active'));
      item.classList.add('active');

      // 切换页面
      pages.forEach(p => p.classList.remove('active'));
      document.getElementById(`page-${target}`).classList.add('active');

      // 切换全局主题色变量
      document.body.setAttribute('data-theme', target);
      
      // 更新移动端顶栏标题
      if (mobileTitle) {
        const text = item.querySelector('span').textContent;
        mobileTitle.textContent = text;
      }

      // 移动端下自动关闭侧边栏抽屉
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      
      // 保存当前路由
      localStorage.setItem('activeModule', target);
      // 数据联动重载
      if (target === 'hymns') initHymns();
      if (target === 'books') initBooks();
      if (target === 'news') initNewsArbitrageBlog();
      if (target === 'admin') initAdmin();
    });
  });

  // 移动端汉堡菜单控制
  const burgerBtn = document.getElementById('btn-mobile-menu');
  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => {
      if (sidebar) sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      if (sidebar) sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }

  // 恢复上次访问的模块
  const activeModule = localStorage.getItem('activeModule') || 'inspiration';
  const targetNav = document.getElementById(`nav-${activeModule}`);
  if (targetNav) targetNav.click();
};

// -------------------------------------------------------------
// 2. 每日灵感模块
// -------------------------------------------------------------
const initInspiration = () => {
  const defaultList = [
    { id: '1', category: '创意', content: '做一个记录灵感的App，把所有好的想法集中管理', createdAt: '今天 10:15', isPinned: false },
    { id: '2', category: '生活', content: '周末尝试做一次露营，远离城市喧嚣', createdAt: '昨天 20:30', isPinned: true },
    { id: '3', category: '工作', content: '会议前先发议程，让大家提前准备更高效', createdAt: '7月25日 14:20', isPinned: false }
  ];

  let list = getLocalData('inspirations', defaultList);
  let activeFilter = 'all';

  const render = () => {
    const container = document.getElementById('list-inspiration');
    const countLabel = document.getElementById('cnt-inspiration');
    container.innerHTML = '';

    // 过滤与置顶排序
    const filtered = list.filter(item => activeFilter === 'all' || item.category === activeFilter);
    const sorted = [...filtered].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    countLabel.textContent = `${sorted.length} 条`;

    sorted.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'list-item';
      itemEl.innerHTML = `
        <div class="list-item-header">
          <div class="list-item-tags">
            <span class="list-item-tag">${item.category}</span>
          </div>
          <div class="list-item-actions">
            <button class="btn-pill btn-pin" data-id="${item.id}">
              ${item.isPinned ? '📌 已置顶' : '置顶'}
            </button>
            <button class="btn-pill btn-edit" data-id="${item.id}">编辑</button>
            <button class="btn-pill btn-delete" data-id="${item.id}">删除</button>
          </div>
        </div>
        <div class="list-item-body">${item.content}</div>
        <div class="list-item-footer">${item.createdAt}</div>
      `;
      container.appendChild(itemEl);
    });
  };

  const addInspiration = (text) => {
    if (!text.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      category: ['创意', '生活', '工作', '学习'][Math.floor(Math.random() * 4)],
      content: text,
      createdAt: '今天 ' + new Date().toTimeString().slice(0, 5),
      isPinned: false
    };
    list.unshift(newItem);
    setLocalData('inspirations', list);
    render();
  };

  // 事件监听
  document.getElementById('btn-inspiration-submit').addEventListener('click', () => {
    const input = document.getElementById('inp-inspiration');
    addInspiration(input.value);
    input.value = '';
  });

  document.getElementById('inp-inspiration').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const input = document.getElementById('inp-inspiration');
      addInspiration(input.value);
      input.value = '';
    }
  });

  document.getElementById('fab-inspiration').addEventListener('click', () => {
    const text = prompt('请输入你的新灵感：');
    if (text) addInspiration(text);
  });

  // 分类 Tabs
  document.getElementById('tabs-inspiration').addEventListener('click', (e) => {
    if (e.target.classList.contains('pill-tab')) {
      document.querySelectorAll('#tabs-inspiration .pill-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      activeFilter = e.target.getAttribute('data-filter');
      render();
    }
  });

  // 操作组 (事件委托)
  document.getElementById('list-inspiration').addEventListener('click', (e) => {
    const target = e.target;
    const id = target.getAttribute('data-id');
    if (!id) return;

    if (target.classList.contains('btn-pin')) {
      list = list.map(item => item.id === id ? { ...item, isPinned: !item.isPinned } : item);
    } else if (target.classList.contains('btn-edit')) {
      const item = list.find(item => item.id === id);
      const newText = prompt('编辑你的灵感：', item.content);
      if (newText) {
        list = list.map(item => item.id === id ? { ...item, content: newText } : item);
      }
    } else if (target.classList.contains('btn-delete')) {
      if (confirm('确定要删除这条灵感吗？')) {
        list = list.filter(item => item.id !== id);
      }
    }
    setLocalData('inspirations', list);
    render();
  });

  render();
};

// -------------------------------------------------------------
// 3. 英语口语练习模块
// -------------------------------------------------------------
const initEnglish = () => {
  const langData = {
    en: {
      quote: "It does not matter how slowly you go as long as you do not stop.",
      quoteCn: "前进的速度不重要，只要不停下来。",
      phrases: [
        { text: 'Nice to meet you.', cn: '很高兴认识你。' },
        { text: 'How are you doing?', cn: '你最近怎么样？' },
        { text: 'I love learning languages.', cn: '我喜欢学习外语。' },
        { text: 'Where is the nearest station?', cn: '最近的车站在哪里？' },
        { text: 'Could you help me, please?', cn: '请问能帮个忙吗？' },
        { text: 'What time is it?', cn: '现在几点了？' }
      ],
      speechLang: 'en-US'
    },
    es: {
      quote: "El éxito no es el final, el fracaso no es fatal: es el valor para continuar lo que cuenta.",
      quoteCn: "成功不是终点，失败也不是末日：持续前进的勇气才是最重要的。",
      phrases: [
        { text: '¡Hola! ¿Cómo estás?', cn: '你好！你怎么样？' },
        { text: 'Buenos días, que tengas un buen día.', cn: '早上好，祝你有美好的一天。' },
        { text: 'El éxito requiere un esfuerzo constante.', cn: '成功需要持续的努力。' },
        { text: 'Muchas gracias por tu ayuda hoy.', cn: '非常感谢你今天的帮助。' },
        { text: '¿Dónde está el baño, por favor?', cn: '请问洗手间在哪里？' },
        { text: 'Mucho gusto en conocerte.', cn: '很高兴认识你。' }
      ],
      speechLang: 'es-ES'
    },
    ja: {
      quote: "夢なき者に理想なし、理想なき者に計画なし、計画なき者に実行なし。",
      quoteCn: "无梦者无理想，无理想者无计划，无计划者无执行。",
      phrases: [
        { text: 'こんにちは、お元気ですか？', cn: '你好，你身体好吗？' },
        { text: 'おはようございます、今日も頑張りましょう。', cn: '早上好，今天也一起加油吧。' },
        { text: '成功するには、絶え間ない努力が必要です。', cn: '成功需要不断的努力。' },
        { text: '今日は手伝ってくれて本当にありがとう。', cn: '今天谢谢你的帮忙。' },
        { text: '駅はどちらですか？', cn: '车站是在哪个方向？' },
        { text: 'お会いできて嬉しいです。', cn: '很高兴见到你。' }
      ],
      speechLang: 'ja-JP'
    },
    fr: {
      quote: "Petit à petit, l'oiseau fait son nid.",
      quoteCn: "不积跬步，无以至千里。（直译：一点一点，小鸟筑成巢穴。）",
      phrases: [
        { text: 'Bonjour ! Comment allez-vous ?', cn: '你好！你最近怎么样？' },
        { text: 'Bonne journée, profitez bien de votre journée.', cn: '早上好，祝你有美好的一天。' },
        { text: 'Le succès exige des efforts constants.', cn: '成功需要不断的努力。' },
        { text: 'Merci beaucoup pour votre aide aujourd\'hui.', cn: '非常感谢你今天的帮助。' },
        { text: 'Où se trouve la gare la plus proche ?', cn: '最近的火车站在哪里？' },
        { text: 'Enchanté de vous rencontrer.', cn: '很高兴认识你。' }
      ],
      speechLang: 'fr-FR'
    }
  };

  let currentLang = 'en';

  const renderSpeechModule = () => {
    const data = JSON.parse(JSON.stringify(langData[currentLang]));
    const customSpeech = getLocalData('custom_speech_phrases', []);
    const matchingCustom = customSpeech.filter(s => s.lang === currentLang);
    data.phrases = data.phrases.concat(matchingCustom);
    
    // 更新每日金句
    const quoteText = document.getElementById('lbl-daily-quote-text');
    const quoteTrans = document.getElementById('lbl-daily-quote-translation');
    if (quoteText && quoteTrans) {
      quoteText.textContent = data.quote;
      quoteTrans.textContent = data.quoteCn;
    }

    // 重新渲染口语卡片列表
    const container = document.getElementById('list-english-phrases');
    if (container) {
      container.innerHTML = '';
      data.phrases.forEach(p => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.style.cursor = 'pointer';
        item.style.flexDirection = 'row';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.innerHTML = `
          <div>
            <div style="font-weight:700; color:#2F80ED; font-size:14px;">${p.text}</div>
            <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${p.cn}</div>
          </div>
          <span style="font-size:18px;" class="speak-btn">🔊</span>
        `;
        
        // TTS 播放
        const speak = () => {
          const speech = new SpeechSynthesisUtterance(p.text);
          speech.lang = data.speechLang;
          window.speechSynthesis.speak(speech);
        };
        
        item.addEventListener('click', speak);
        container.appendChild(item);
      });
    }
  };

  // 绑定金句朗读发音
  const readBtn = document.getElementById('btn-english-read');
  if (readBtn) {
    readBtn.addEventListener('click', (e) => {
      const data = langData[currentLang];
      const speech = new SpeechSynthesisUtterance(data.quote);
      speech.lang = data.speechLang;
      window.speechSynthesis.speak(speech);
      
      const origText = e.target.textContent;
      e.target.textContent = '🔊 正在发音中...';
      setTimeout(() => {
        e.target.textContent = origText;
      }, 1500);
    });
  }

  // 绑定 Tabs 点击切换
  const tabs = document.getElementById('english-lang-tabs');
  if (tabs) {
    tabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('pill-tab')) {
        document.querySelectorAll('#english-lang-tabs .pill-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentLang = e.target.getAttribute('data-lang');
        renderSpeechModule();
      }
    });
  }

  // 初次渲染
  renderSpeechModule();
};

// -------------------------------------------------------------
// 4. 每日减脂饮食模块
// -------------------------------------------------------------
const initDiet = () => {
  const defaultBreakfast = ['燕麦牛奶 + 蓝莓', '水煮蛋 × 1'];
  const defaultLunch = ['鸡胸肉沙拉', '杂粮饭 半碗'];
  const defaultDinner = ['清蒸鱼 + 西兰花', '紫薯 × 1'];
  
  let meals = getLocalData('diet_meals', {
    breakfast: defaultBreakfast,
    lunch: defaultLunch,
    dinner: defaultDinner
  });

  const recipes = [
    { title: '鸡胸肉蔬菜沙拉', desc: '鸡胸肉150g + 生菜 + 圣女果 + 橄榄油柠檬汁', cal: 280 },
    { title: '燕麦能量碗', desc: '燕麦 + 蓝莓 + 杏仁 + 希腊酸奶', cal: 320 },
    { title: '番茄豆腐汤', desc: '番茄 + 嫩豆腐 + 鸡蛋 + 香葱，低脂高蛋白', cal: 180 }
  ];

  const updateCalories = () => {
    let total = 0;
    ['breakfast', 'lunch', 'dinner'].forEach(meal => {
      meals[meal].forEach(item => {
        // 使用正则提取括号中的卡路里
        const match = item.match(/(?:(\d+)千卡|(\d+)大卡)/);
        if (match) {
          total += parseInt(match[1] || match[2]);
        } else {
          total += 150; // 默认每项算 150 千卡
        }
      });
    });

    total = Math.min(total, 1500);
    const caloriesVal = document.getElementById('diet-calories-val');
    if (caloriesVal) caloriesVal.textContent = total;
    
    // 更新 SVG 圆环进度
    const circle = document.getElementById('diet-circle');
    if (circle) {
      const circumference = 251.2;
      const offset = circumference - (total / 1500) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    // 更新宏量营养元素文本
    const prot = Math.round(total * 0.05);
    const carb = Math.round(total * 0.09);
    const fat = Math.round(total * 0.03);
    const macroText = document.getElementById('diet-macronutrients');
    if (macroText) {
      macroText.innerHTML = `
        剩余: ${1500 - total} 千卡<br>
        蛋白质: ${prot}g · 碳水: ${carb}g · 脂肪: ${fat}g
      `;
    }
  };

  const renderMeals = () => {
    ['breakfast', 'lunch', 'dinner'].forEach(meal => {
      const container = document.getElementById(`list-diet-${meal}`);
      if (!container) return;
      container.innerHTML = '';
      meals[meal].forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.style.display = 'flex';
        itemEl.style.justifyContent = 'space-between';
        itemEl.style.padding = '4px 0';
        itemEl.innerHTML = `
          <span>• ${item}</span>
          <span style="color:var(--text-secondary); cursor:pointer;" class="del-diet-btn" data-meal="${meal}" data-item="${item}">×</span>
        `;
        container.appendChild(itemEl);
      });
    });
  };

  const addMealItem = (meal, itemName) => {
    if (!itemName) return;
    meals[meal].push(itemName);
    setLocalData('diet_meals', meals);
    renderMeals();
    updateCalories();
  };

  // 添加按钮事件
  document.querySelectorAll('.btn-add-diet').forEach(btn => {
    btn.addEventListener('click', () => {
      const meal = btn.getAttribute('data-meal');
      const item = prompt('输入你吃的东西：');
      if (item) addMealItem(meal, item);
    });
  });

  const fabDiet = document.getElementById('fab-diet-add');
  if (fabDiet) {
    fabDiet.addEventListener('click', () => {
      const meal = prompt('请选择餐别 (早餐/午餐/晚餐)：');
      let key = '';
      if (meal === '早餐') key = 'breakfast';
      else if (meal === '午餐') key = 'lunch';
      else if (meal === '晚餐') key = 'dinner';
      else return alert('请输入正确的餐别');

      const item = prompt('输入食物名称：');
      if (item) addMealItem(key, item);
    });
  }

  // 删除饮食项
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('del-diet-btn')) {
      const meal = e.target.getAttribute('data-meal');
      const item = e.target.getAttribute('data-item');
      meals[meal] = meals[meal].filter(i => i !== item);
      setLocalData('diet_meals', meals);
      renderMeals();
      updateCalories();
    }
  });

  // 渲染推荐食谱
  const recipesContainer = document.getElementById('list-diet-recipes');
  if (recipesContainer) {
    recipesContainer.innerHTML = '';
    recipes.forEach(r => {
      const el = document.createElement('div');
      el.className = 'list-item';
      el.style.cursor = 'pointer';
      el.innerHTML = `
        <div style="font-weight:700; color:#27AE60;">${r.title}</div>
        <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${r.desc}</div>
        <div style="margin-top:6px;"><span class="list-item-tag">🔥 ${r.cal} 千卡</span></div>
      `;
      el.addEventListener('click', () => {
        const meal = prompt('加入哪一餐？(早餐/午餐/晚餐)：');
        let key = '';
        if (meal === '早餐') key = 'breakfast';
        else if (meal === '午餐') key = 'lunch';
        else if (meal === '晚餐') key = 'dinner';
        if (key) addMealItem(key, `${r.title} (${r.cal}千卡)`);
      });
      recipesContainer.appendChild(el);
    });
  }

  // -------------------------------------------------------------
  // Cal AI 食物热量与病理风险评估逻辑
  // -------------------------------------------------------------
  let hasDiabetes = getLocalData('diet_health_diabetes', false);
  let hasCholesterol = getLocalData('diet_health_cholesterol', false);
  let currentFoodResult = null;

  const diabetesChk = document.getElementById('chk-health-diabetes');
  const cholesterolChk = document.getElementById('chk-health-cholesterol');

  if (diabetesChk) {
    diabetesChk.checked = hasDiabetes;
    diabetesChk.addEventListener('change', (e) => {
      hasDiabetes = e.target.checked;
      setLocalData('diet_health_diabetes', hasDiabetes);
      if (currentFoodResult) runHealthCheck(currentFoodResult);
    });
  }

  if (cholesterolChk) {
    cholesterolChk.checked = hasCholesterol;
    cholesterolChk.addEventListener('change', (e) => {
      hasCholesterol = e.target.checked;
      setLocalData('diet_health_cholesterol', hasCholesterol);
      if (currentFoodResult) runHealthCheck(currentFoodResult);
    });
  }

  // 食物高保真本地规则库
  const foodDatabase = {
    hamburger: {
      name: "双层芝士汉堡",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
      cal: 620,
      carb: 48,
      prot: 28,
      fat: 32,
      warningText: "🍔 汉堡包含有高精制面粉，且芝士与双层牛肉饼富含饱和脂肪和胆固醇。"
    },
    fish: {
      name: "清蒸鳕鱼配糙米饭",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=300&q=80",
      cal: 310,
      carb: 35,
      prot: 25,
      fat: 5,
      warningText: "🐟 鳕鱼属于极为健康的优质低脂蛋白，糙米饭则是典型的高纤维低 GI 慢碳水，推荐食用！"
    },
    sweetpotato: {
      name: "拔丝地瓜",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=300&q=80",
      cal: 450,
      carb: 92,
      prot: 2,
      fat: 8,
      warningText: "🍠 拔丝地瓜裹着大量精制白糖浆，且地瓜淀粉本身糊化度极高，属于超高升糖指数（GI）食物。"
    }
  };

  // 三高病理筛查警告分析器
  const runHealthCheck = (food) => {
    const warningBox = document.getElementById('cal-ai-warning-box');
    if (!warningBox || !food) return;
    warningBox.innerHTML = '';

    let hasWarning = false;

    // 1. 糖尿病 / 高血糖警报
    if (hasDiabetes) {
      const isHighGI = food.name.includes('地瓜') || food.name.includes('糖') || 
                       food.name.includes('米饭') || food.name.includes('可乐') || 
                       food.name.includes('面包') || food.name.includes('面条') || 
                       food.name.includes('蛋糕') || food.name.includes('汉堡') ||
                       food.carb > 45;
      
      if (isHighGI) {
        hasWarning = true;
        const card = document.createElement('div');
        card.className = 'warning-card warning-blink-red';
        card.innerHTML = `
          <div style="font-weight: 700; display:flex; align-items:center; gap:6px;">⚠️ 血糖红色预警 (高升糖膳食)</div>
          <div style="font-size: 11px; margin-top: 6px; color: var(--text-primary); line-height: 1.5;">
            该食物在糖尿病/高血糖状态下，容易导致血糖迅速攀升。
            ${food.warningText ? '<br>分析: ' + food.warningText : ''}
            <br><strong>💡 平替推荐:</strong> 建议换成荞麦面、全麦燕麦或糙米饭，并优先搭配膳食纤维延缓糖分吸收。
          </div>
        `;
        warningBox.appendChild(card);
      }
    }

    // 2. 高胆固醇 / 高血脂警报
    if (hasCholesterol) {
      const isHighFat = food.name.includes('汉堡') || food.name.includes('红烧肉') || 
                        food.name.includes('肥牛') || food.name.includes('肥肉') || 
                        food.name.includes('炸') || food.name.includes('油') ||
                        food.fat > 20;

      if (isHighFat) {
        hasWarning = true;
        const card = document.createElement('div');
        card.className = 'warning-card warning-blink-yellow';
        card.innerHTML = `
          <div style="font-weight: 700; display:flex; align-items:center; gap:6px;">⚠️ 胆固醇黄色预警 (高饱和脂肪)</div>
          <div style="font-size: 11px; margin-top: 6px; color: var(--text-primary); line-height: 1.5;">
            该食物所含饱和脂肪与胆固醇较高，易加重血管负担，不利于胆固醇控制。
            ${food.warningText && !hasDiabetes ? '<br>分析: ' + food.warningText : ''}
            <br><strong>💡 平替推荐:</strong> 建议将红肉/油炸食品换成去皮鸡胸肉、水煮虾或清蒸鳕鱼等优质海鲜蛋白。
          </div>
        `;
        warningBox.appendChild(card);
      }
    }

    // 3. 指标安全推荐（当勾选了画像，但食物十分健康时）
    if ((hasDiabetes || hasCholesterol) && !hasWarning) {
      const card = document.createElement('div');
      card.className = 'warning-card warning-blink-green';
      card.innerHTML = `
        <div style="font-weight: 700; display:flex; align-items:center; gap:6px;">✨ 三高绿灯推荐膳食</div>
        <div style="font-size: 11px; margin-top: 6px; color: var(--text-primary); line-height: 1.5;">
          ${food.name} 属于低升糖、低脂肪、高蛋白的健康膳食。符合糖尿病与高胆固醇膳食管理指标，建议放心食用。
        </div>
      `;
      warningBox.appendChild(card);
    }
  };

  // 简易文本食物 AI 识别
  const parseFoodText = (text) => {
    const query = text.trim().toLowerCase();
    if (!query) return null;

    let name = text;
    let cal = 260;
    let carb = 30;
    let prot = 15;
    let fat = 10;
    let warningText = "本地 AI 估算数据";

    if (query.includes('汉堡') || query.includes('hamburger')) {
      return foodDatabase.hamburger;
    } else if (query.includes('鱼') || query.includes('鳕鱼') || query.includes('cod')) {
      return foodDatabase.fish;
    } else if (query.includes('地瓜') || query.includes('红薯') || query.includes('拔丝')) {
      return foodDatabase.sweetpotato;
    } else if (query.includes('红烧肉') || query.includes('猪肉') || query.includes('肥肉')) {
      name = "经典红烧肉";
      cal = 580;
      carb = 15;
      prot = 18;
      fat = 52;
      warningText = "🥩 红烧肉富含饱和脂肪和胆固醇，且调味中含有大量高升糖的冰糖。";
    } else if (query.includes('可乐') || query.includes('汽水') || query.includes('饮料')) {
      name = "可乐 (一听)";
      cal = 140;
      carb = 35;
      prot = 0;
      fat = 0;
      warningText = "🥤 饮料中富含精制果糖与游离糖，会迅速拉高血糖水平，糖尿病患者禁忌。";
    } else if (query.includes('燕麦') || query.includes('麦片') || query.includes('粗粮')) {
      name = "全麦燕麦片";
      cal = 220;
      carb = 38;
      prot = 8;
      fat = 3;
      warningText = "🌾 燕麦含有丰富的 β-葡聚糖水溶性膳食纤维，可大大延缓碳水吸收，低 GI 极其推荐。";
    }

    return { name, cal, carb, prot, fat, warningText };
  };

  // 统一展现 AI 识别结果的扫描流
  const showScanResult = (foodObj) => {
    const uploadPlaceholder = document.getElementById('cal-ai-upload-placeholder');
    const scanActive = document.getElementById('cal-ai-scan-active');
    const foodImg = document.getElementById('img-cal-ai-food');
    const resultPanel = document.getElementById('cal-ai-result-panel');

    if (!uploadPlaceholder || !scanActive || !resultPanel) return;

    // 显示扫描特效
    uploadPlaceholder.style.display = 'none';
    scanActive.style.display = 'flex';
    resultPanel.style.display = 'none';

    // 绑定大图
    if (foodImg && foodObj.image) {
      foodImg.style.backgroundImage = `url('${foodObj.image}')`;
    } else if (foodImg) {
      foodImg.style.backgroundImage = 'linear-gradient(135deg, #FF9F43 0%, #FF5252 100%)';
    }

    // 1.5 秒后展示 AI 分析数据
    setTimeout(() => {
      scanActive.style.display = 'none';
      uploadPlaceholder.style.display = 'block';
      resultPanel.style.display = 'block';

      currentFoodResult = foodObj;

      // 填充基础营养数据
      const resName = document.getElementById('lbl-result-food-name');
      const resFacts = document.getElementById('lbl-result-nutrition-facts');
      if (resName) resName.textContent = `识别结果: ${foodObj.name}`;
      if (resFacts) {
        resFacts.innerHTML = `
          估算热量: <strong>${foodObj.cal}</strong> 千卡 <br>
          碳水: ${foodObj.carb}g | 蛋白质: ${foodObj.prot}g | 脂肪: ${foodObj.fat}g
        `;
      }

      // 执行三高病理预警
      runHealthCheck(foodObj);
    }, 1500);
  };

  // 绑定相机/相册上传
  const scannerBox = document.getElementById('cal-ai-scanner-box');
  const fileInput = document.getElementById('file-cal-ai-upload');
  if (scannerBox && fileInput) {
    scannerBox.addEventListener('click', (e) => {
      if (e.target !== fileInput) {
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          showScanResult({
            name: "已上传食物",
            image: event.target.result,
            cal: 480,
            carb: 52,
            prot: 20,
            fat: 18,
            warningText: "自传食物估算值"
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 绑定文本分析
  const textBtn = document.getElementById('btn-cal-ai-text-identify');
  const textInput = document.getElementById('txt-cal-ai-food-input');
  if (textBtn && textInput) {
    textBtn.addEventListener('click', () => {
      const parsed = parseFoodText(textInput.value);
      if (parsed) {
        showScanResult(parsed);
      } else {
        alert('请输入具体的食物名称（支持汉堡、鳕鱼、地瓜、可乐、红烧肉、燕麦等匹配演示）');
      }
    });
  }

  // 绑定快捷演示按钮
  document.querySelectorAll('.btn-preset-food').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-food');
      const food = foodDatabase[key];
      if (food) {
        showScanResult(food);
      }
    });
  });

  // 绑定一键计入卡路里大盘
  const logMealBtn = document.getElementById('btn-cal-ai-log-meal');
  if (logMealBtn) {
    logMealBtn.addEventListener('click', () => {
      if (currentFoodResult) {
        const meal = prompt('计入哪一餐？(早餐/午餐/晚餐)：');
        let key = '';
        if (meal === '早餐') key = 'breakfast';
        else if (meal === '午餐') key = 'lunch';
        else if (meal === '晚餐') key = 'dinner';
        
        if (key) {
          addMealItem(key, `${currentFoodResult.name} (${currentFoodResult.cal}千卡)`);
          alert(`已成功将 [${currentFoodResult.name}] 的 ${currentFoodResult.cal} 千卡记入${meal}！`);
          
          const resultPanel = document.getElementById('cal-ai-result-panel');
          if (resultPanel) resultPanel.style.display = 'none';
          currentFoodResult = null;
        }
      }
    });
  }

  renderMeals();
  updateCalories();
};
const initWorkout = () => {
  // 运动日历打卡状态
  let checkedDays = getLocalData('workout_checks', [1, 3, 5, 7, 10, 12, 15, 18, 22, 25, 27]);

  const renderCalendar = () => {
    const grid = document.getElementById('grid-workout-calendar');
    if (!grid) return;
    grid.innerHTML = '';
    
    // 渲染周标题
    const daysName = ['日', '一', '二', '三', '四', '五', '六'];
    daysName.forEach(name => {
      const el = document.createElement('div');
      el.className = 'calendar-header-day';
      el.textContent = name;
      grid.appendChild(el);
    });

    // 2026年7月：1号是周三。填充前面的空白
    for (let i = 0; i < 3; i++) {
      grid.appendChild(document.createElement('div'));
    }

    // 填充7月份天数 1-31
    for (let d = 1; d <= 31; d++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      cell.textContent = d;

      if (checkedDays.includes(d)) {
        cell.classList.add('checked');
      }
      if (d === 29) {
        cell.classList.add('today');
      }

      cell.addEventListener('click', () => {
        if (checkedDays.includes(d)) {
          checkedDays = checkedDays.filter(day => day !== d);
        } else {
          checkedDays.push(d);
        }
        setLocalData('workout_checks', checkedDays);
        renderCalendar();
      });

      grid.appendChild(cell);
    }

    const lblDays = document.getElementById('lbl-workout-days');
    if (lblDays) lblDays.textContent = `已打卡 ${checkedDays.length} 天`;
  };

  // 运动计时器
  let timerInterval = null;
  let timeRemaining = 30 * 60; // 30 mins in secs
  const timerCircle = document.getElementById('timer-circle');
  const timerVal = document.getElementById('timer-val');
  const timerStatus = document.getElementById('timer-status');
  const startBtn = document.getElementById('btn-timer-start');

  const updateTimerCircle = () => {
    if (!timerCircle || !timerVal) return;
    const total = 30 * 60;
    const progress = timeRemaining / total;
    const circumference = 251.2;
    timerCircle.style.strokeDashoffset = circumference - progress * circumference;

    const mins = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const secs = (timeRemaining % 60).toString().padStart(2, '0');
    timerVal.textContent = `${mins}:${secs}`;
  };

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (timerInterval) {
        // 暂停
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.textContent = '开始锻炼';
        if (timerStatus) timerStatus.textContent = '已暂停';
      } else {
        // 开始
        if (timerStatus) timerStatus.textContent = '坚持就是胜利';
        startBtn.textContent = '暂停锻炼';
        timerInterval = setInterval(() => {
          if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerCircle();
          } else {
            clearInterval(timerInterval);
            timerInterval = null;
            startBtn.textContent = '完成！';
            alert('恭喜你完成了 30 分钟的锻炼！已自动在日历打卡。');
            if (!checkedDays.includes(29)) {
              checkedDays.push(29);
              setLocalData('workout_checks', checkedDays);
              renderCalendar();
            }
          }
        }, 1000);
      }
    });
  }

  const resetBtn = document.getElementById('btn-timer-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      timerInterval = null;
      timeRemaining = 30 * 60;
      if (startBtn) startBtn.textContent = '开始锻炼';
      if (timerStatus) timerStatus.textContent = '倒计时';
      updateTimerCircle();
    });
  }

  // --- 计步器逻辑 ---
  let stepCount = getLocalData('workout_step_count', 0);
  let isPedometerActive = false;
  let lastStepTime = 0;
  const stepThreshold = 11.6; // 合加速度判定阈值 (9.8 是重力静态值，轻晃超过11.6判定走了一步)

  const stepCountVal = document.getElementById('lbl-step-count');
  const pedometerStatus = document.getElementById('lbl-pedometer-status');
  const pedometerToggleBtn = document.getElementById('btn-pedometer-toggle');
  const simulateBtn = document.getElementById('btn-pedometer-simulate');

  if (stepCountVal) {
    stepCountVal.textContent = stepCount.toLocaleString();
    stepCountVal.style.transition = 'transform 0.15s ease';
  }

  const updateSteps = (newSteps) => {
    stepCount = newSteps;
    setLocalData('workout_step_count', stepCount);
    if (stepCountVal) {
      stepCountVal.textContent = stepCount.toLocaleString();
    }
  };

  const handleDeviceMotion = (event) => {
    if (!isPedometerActive) return;
    const acc = event.accelerationIncludingGravity;
    if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

    // 计算合加速度
    const totalAcc = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
    const currentTime = Date.now();

    if (totalAcc > stepThreshold && (currentTime - lastStepTime) > 350) {
      lastStepTime = currentTime;
      updateSteps(stepCount + 1);
      
      // 绿点微动效闪烁
      if (pedometerStatus) {
        pedometerStatus.style.transform = 'scale(1.2)';
        setTimeout(() => pedometerStatus.style.transform = 'scale(1.0)', 120);
      }
    }
  };

  const startTracking = () => {
    isPedometerActive = true;
    window.addEventListener('devicemotion', handleDeviceMotion);
    if (pedometerToggleBtn) pedometerToggleBtn.textContent = '⏸ 暂停计步';
    if (pedometerStatus) {
      pedometerStatus.textContent = '计步中...';
      pedometerStatus.style.background = '#E3F9E5';
      pedometerStatus.style.color = '#1F8722';
    }
  };

  const stopTracking = () => {
    isPedometerActive = false;
    window.removeEventListener('devicemotion', handleDeviceMotion);
    if (pedometerToggleBtn) pedometerToggleBtn.textContent = '🚶 开启计步';
    if (pedometerStatus) {
      pedometerStatus.textContent = '已暂停';
      pedometerStatus.style.background = '#e0e0e0';
      pedometerStatus.style.color = '#666';
    }
  };

  if (pedometerToggleBtn) {
    pedometerToggleBtn.addEventListener('click', async () => {
      if (isPedometerActive) {
        stopTracking();
      } else {
        // 处理 iOS 浏览器陀螺仪运动授权
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
          try {
            const permission = await DeviceMotionEvent.requestPermission();
            if (permission === 'granted') {
              startTracking();
            } else {
              alert('未获得运动传感器授权，可以使用右侧模拟按钮。');
            }
          } catch (e) {
            console.warn('陀螺仪请求权限被拒：', e);
            startTracking();
          }
        } else {
          startTracking();
        }
      }
    });
  }

  if (simulateBtn) {
    simulateBtn.addEventListener('click', () => {
      updateSteps(stepCount + 100);
      if (stepCountVal) {
        stepCountVal.style.transform = 'scale(1.15)';
        setTimeout(() => stepCountVal.style.transform = 'scale(1.0)', 120);
      }
    });
  }

  // 视频列表与过滤
  const videos = [
    { title: '15min无跑跳有氧燃脂操', info: '15分钟 · 王心凌金曲', cat: 'aerobic' },
    { title: '20分钟女团力量燃脂舞', info: '20分钟 · 8首连跳', cat: 'strength' },
    { title: '10分钟全身拉伸放松', info: '10分钟 · 舒缓白噪音', cat: 'stretch' }
  ];

  const renderVideos = (category = 'aerobic') => {
    const list = document.getElementById('list-workout-videos');
    if (!list) return;
    list.innerHTML = '';
    videos.filter(v => v.cat === category).forEach(v => {
      const el = document.createElement('div');
      el.style.cssText = 'background:#f9f9f9; border-radius:var(--radius-md); padding:20px 12px; text-align:center; cursor:pointer;';
      el.innerHTML = `
        <span style="font-size:24px;">▶</span>
        <div style="font-size:12px; font-weight:700; margin-top:6px;">${v.title}</div>
        <div style="font-size:10px; color:var(--text-secondary);">${v.info}</div>
      `;
      el.addEventListener('click', () => {
        alert(`正在播放: ${v.title}`);
      });
      list.appendChild(el);
    });
  };

  document.querySelectorAll('#page-workout .pill-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('#page-workout .pill-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      renderVideos(e.target.getAttribute('data-category'));
    });
  });

  renderCalendar();
  updateTimerCircle();
  renderVideos('aerobic');
};

const initNewsArbitrageBlog = () => {
  // 离线备用高保真新闻数据
  const newsList = [
    { id: '1', cat: '科技', source: '36氪', title: 'AI 编程助手再升级，可独立完成 80% 代码', desc: '最新一代 AI 编程工具具备更强的自主决策能力，让开发者效率大幅提升。', time: '2小时前', content: '【36氪最新消息】在最新一轮的全球开发者效率评估中，多款主流 AI 编程助手宣布完成了颠覆性升级。\n\n新版助手不再局限于智能补全或单行纠错，而是能够真正理解大型项目的多层代码依赖。通过接入本地 AST 语法分析树与测试执行引擎，AI 助手在接收到简短的人类指令后，可以自主生成方案设计、编写对应文件、自动编译并执行单元测试进行 Debug 闭环。数据表明，其在独立完成常规业务需求方面的比重已跃升至 80% 以上，极大地解放了工程人员的日常重复性劳动。' },
    { id: '2', cat: '财经', source: '华尔街见闻', title: '全球股市震荡，关注下半年资产配置机会', desc: '美联储加息预期放缓，多国股市出现反弹迹象，投资者需保持理性。', time: '4小时前', content: '【华尔街见闻特稿】随着美联储公布了最新的联邦基金利率决议，市场对“高利率维持更久”的预期显著降温，促使国债收益率快速跳水，全球各大股市迎来了久违的反弹震荡。\n\n然而，资深金融分析师警告，由于全球通胀粘性依然坚固，加上主要经济体供应链重塑成本高企，下半年股市结构性分化可能继续加剧。对于普通个人投资者而言，紧跟宏观政策窗口、向高红利资产（如公用事业、蓝筹龙头）及黄金避险板块分散配置，是控制回撤的首要法宝。' },
    { id: '3', cat: '生活', source: '生活日报', title: '健康生活方式调查：90后更注重养生', desc: '最新调查显示，年轻人对健康饮食、规律作息、运动健身的关注度持续上升。', time: '今天 09:00', content: '【生活日报社会调查】现在的“养生”话语权，已经逐步从老年群体转移到了 90 后乃至 00 后的年轻一代身上。\n\n根据对一万名青年人生活作息习惯的跟踪统计，超过八成的青年人拥有保温杯、食补理疗、中药茶饮等保健意识。而在面临工作时长压力、职场内卷的挑战下，诸如“睡前泡脚”、“八杯水打卡”以及“轻度力量拉伸”等微习惯，正成为他们构筑心理安全感防线的重要支柱，年轻人的健康焦虑正切实转变为日常的健康自律行为。' },
    { id: '4', cat: '娱乐', source: '娱乐周刊', title: '暑期档票房破百亿，国漫崛起引人注目', desc: '今年暑期档国产动画电影表现亮眼，多部作品口碑票房双丰收。', time: '昨天 18:30', content: '【娱乐周刊独家盘点】今年暑期档电影市场格外火热。截至本周末，总票房数据已昂首跨过百亿门槛。\n\n这其中，以中国古典神话为蓝本进行现代叙事重构的多部国产动画大片（国漫），取得了前所未有的票房硕果。影片不仅凭借高超的 3D 渲染画面震撼全场，更在角色成长弧光、人性的复杂多义性上深度打磨，赢得了大批非合家欢性质的成人主力消费人群，再次向产业证明了国漫市场的深邃生命力和商业潜力。' }
  ];

  // 赚钱信息差数据 (已从侧栏关闭，备用)
  const arbitrageList = [
    { id: '1', cat: '副业', source: '经验谈', title: '小红书博主：普通人月入过万的真实路径', desc: '拆解素人博主从 0 到 1 的运营流程，包括定位、内容、变现关键节点。', time: '3小时前' },
    { id: '2', cat: '兼职', source: '兼职网', title: '线上家教平台推荐，时薪 100-300 元', desc: '整理了 5 个口碑较好的在线教育平台，适合大学生和职场人。', time: '今天 11:00' },
    { id: '3', cat: '投资', source: '研报', title: '可转债打新入门：低风险套利策略', desc: '详细介绍可转债打新流程、注意事项，以及如何提高中签率。', time: '昨天 21:00' },
    { id: '4', cat: '创业', source: '商界', title: '社区团购的下一个机会在哪里？', desc: '分析社区团购市场现状，挖掘潜在的下沉市场机会。', time: '7月26日 16:00' }
  ];

  // 博客精选数据
  const defaultBlogs = [
    { id: '1', cat: 'life', author: '@林小溪', title: '一个人住第三年，我学会了这些事', desc: '从一开始的孤独感，到现在的自在。分享独居生活的实用技巧。', time: '今天 14:00', content: '在搬进这个单身公寓的第三个年头里，我逐渐从最开始的手足无措和半夜孤独感，过渡到了一种极度自洽的生活状态。\n\n独居让我学会的几件大事：\n1. 学会了做一手好菜：为自己做饭是一场极佳的精神治愈过程，食材的香气可以填满空间。\n2. 建立了属于自己的每日固定流程（Daily Routine）：比如晨起的第一杯水和夜间的拉伸，它们让你的生活在无人约束时依然井井有条。\n3. 学会了和孤独握手言和：当你真正享受自己独处的时光时，你会发现世界突然变得格外安静和干净。' },
    { id: '2', cat: 'work', author: '@职场阿May', title: '从 P6 到 P8，我的阿里五年', desc: '技术人如何规划职业路径，保持核心竞争力。', time: '昨天 20:00', content: '回望在阿里度过的这五年，真是一场脱胎换骨的旅行。从当年刚刚入职、战战兢兢的 P6 螺丝钉，到如今独当一面负责核心业务架构的 P8 架构师，其中的辛酸与收获难以言表。\n\n这里给广大技术研发的几点诚恳建议：\n1. 别只埋头写代码：代码只是工具，要时刻抬起头看清你负责的业务的“商业价值”在哪里。\n2. 结构化思维与向上管理：向上管理的本质是预期对齐与主动分忧，汇报时先讲结论，再陈述证据。\n3. 保持自驱性：拥抱变化是常态，技术迭代快如潮水，唯有时刻保持强烈的好奇心和对底层的钻研热情，才不会在 35 岁时遭遇被动。' },
    { id: '3', cat: 'emo', author: '@情感树洞', title: '30岁之后才明白的 5 个道理', desc: '关于爱情、婚姻、友情，慢慢来比较快。', time: '7月26日', content: '三十岁是一道分水岭。这并不是说你的身体会瞬间变差，而是你的心智会在这段时间迎来一次重构。\n\n以下是我在三十岁之后，在经历过波折与和解后领悟到的道理：\n1. 慢慢来，真的比较快：无论是关系的确立，还是事业的进阶，揠苗助长只会带来满目疮痍。\n2. 朋友不再追求数量：精简交友圈，人生中能有两三个可以在深夜毫无顾忌打电话痛哭的挚友，就已是莫大的福分。\n3. 婚姻的本质是战战兢兢：爱情是绚丽的烟花，但漫长的生活需要双方拥有共同的价值观与生活节奏，像战友一样并肩作战对抗风雨。' },
    { id: '4', cat: 'grow', author: '@小满', title: '我用一年时间，从月薪5k到副业月入2万', desc: '复盘这一年做对的事与踩过的坑。', time: '7月24日', content: '许多人觉得月薪 5k 是职场低谷，但事实上，这正是你“野蛮生长”成本最低、时间最充裕的黄金窗口期。\n\n这一年我是这样通过副业突围的：\n1. 发掘可变现的垂直技能：我选择了自媒体运营和基础文案策划。\n2. 铁律般的执行力：在大家都打游戏看剧的下班时间，我坚持每天输出 3 小时，不找任何理由。\n3. 别怕碰壁，先跑通MVP：第一个单子可能只有 200 元，但它证明了你的商业闭环是跑得通的。只要敢于不断复盘优化，雪球就会越滚越大。' }
  ];

  let blogList = getLocalData('admin_blogs_db', defaultBlogs);
  // 如果缓存是空的，将默认的写入缓存
  if (getLocalData('admin_blogs_db', []).length === 0) {
    setLocalData('admin_blogs_db', defaultBlogs);
  }
  let starred = getLocalData('starred_items', []);
  let activeNewsFilter = 'all';
  let currentNews = [...newsList]; // 当前内存中渲染的新闻集

  // 获取文章阅读器 Modal DOM
  const artModal = document.getElementById('modal-article-reader');
  const artModalClose = document.getElementById('btn-article-modal-close');
  const artModalTitle = document.getElementById('lbl-article-modal-title');
  const artModalBody = document.getElementById('modal-article-body');
  const artModalLink = document.getElementById('btn-article-modal-external-link');

  const openArticleReader = (item) => {
    if (artModal && artModalTitle && artModalBody && artModalLink) {
      artModalTitle.textContent = `[${item.source || '精选'}] ${item.title}`;
      artModalBody.textContent = item.content || item.desc || "暂无详情内容";
      artModalLink.href = item.linkUrl || "#";
      artModal.classList.add('open');
    }
  };

  if (artModalClose && artModal) {
    artModalClose.addEventListener('click', () => {
      artModal.classList.remove('open');
    });
    artModal.addEventListener('click', (e) => {
      if (e.target === artModal) artModal.classList.remove('open');
    });
  }

  // 渲染实时或备用新闻列表
  const renderNews = (filter = 'all') => {
    activeNewsFilter = filter;
    const list = document.getElementById('list-news');
    if (!list) return;
    list.innerHTML = '';
    const filtered = currentNews.filter(item => filter === 'all' || item.cat === filter);
    filtered.forEach(item => {
      const isStarred = starred.includes(`news-${item.id}`);
      const el = document.createElement('div');
      el.className = 'card';
      el.style.marginBottom = '12px';
      el.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:12px; color:var(--theme-accent); font-weight:700;">[${item.cat}] ${item.source}</span>
          <span style="cursor:pointer;" class="star-btn" data-key="news-${item.id}">${isStarred ? '⭐' : '☆'}</span>
        </div>
        <div style="font-size:15px; font-weight:700; margin-bottom:8px;">${item.title}</div>
        <div style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-bottom:12px;">${item.desc}</div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:10px; color:var(--text-secondary);">${item.time}</span>
          <a class="read-article-btn" style="font-size:11px; color:#2F80ED; font-weight:700; text-decoration:none; cursor:pointer;" data-id="${item.id}">查看详情 →</a>
        </div>
      `;
      list.appendChild(el);
    });
  };

  // 异步获取实时热点新闻
  const fetchRealtimeNews = () => {
    // 使用公开支持跨域的网易实时新闻 RSS-to-JSON
    const apiEndpoint = `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.163.com%2Fspecial%2F00011K6L%2Frss_newstop.xml`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    fetch(apiEndpoint, { signal: controller.signal })
      .then(response => response.json())
      .then(data => {
        clearTimeout(timeoutId);
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          currentNews = data.items.slice(0, 8).map((item, index) => {
            const cleanDesc = (item.description || item.content || "点击查看详情").replace(/<\/?[^>]+(>|$)/g, "").slice(0, 80) + '...';
            // 根据标题分发类别
            let category = '时政';
            if (item.title.includes('AI') || item.title.includes('科技') || item.title.includes('芯片') || item.title.includes('数码')) {
              category = '科技';
            } else if (item.title.includes('股') || item.title.includes('财') || item.title.includes('金') || item.title.includes('市')) {
              category = '财经';
            } else if (item.title.includes('娱') || item.title.includes('影') || item.title.includes('演') || item.title.includes('剧')) {
              category = '娱乐';
            } else if (item.title.includes('生活') || item.title.includes('健康') || item.title.includes('养')) {
              category = '生活';
            }
            
            return {
              id: `real-${index}`,
              cat: category,
              source: item.author || '网易实时',
              title: item.title,
              desc: cleanDesc,
              time: '刚刚',
              content: cleanDesc + '\n\n【网易热点】该实时热点新闻已成功接入。由于跨域与排版限制，若需研读深度图文与评论，请点击下方“阅读媒体原文”按钮直接跳转到官方报道页面进行阅读。',
              linkUrl: item.link
            };
          });
          renderNews(activeNewsFilter);
        } else {
          renderNews(activeNewsFilter);
        }
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.warn('实时新闻网络请求失败，已无缝启用备用离线数据。', err);
        // 使用默认离线数据
        currentNews = [...newsList];
        renderNews(activeNewsFilter);
      });
  };

  const renderArbitrage = (filter = 'all') => {
    const list = document.getElementById('list-arbitrage');
    if (!list) return;
    list.innerHTML = '';
    const filtered = arbitrageList.filter(item => filter === 'all' || item.cat === filter);
    filtered.forEach(item => {
      const isStarred = starred.includes(`arbitrage-${item.id}`);
      const el = document.createElement('div');
      el.className = 'card';
      el.style.marginBottom = '12px';
      el.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:12px; color:var(--theme-accent); font-weight:700;">[${item.cat}] ${item.source}</span>
          <span style="cursor:pointer;" class="star-btn" data-key="arbitrage-${item.id}">${isStarred ? '⭐' : '☆'}</span>
        </div>
        <div style="font-size:15px; font-weight:700; margin-bottom:8px;">${item.title}</div>
        <div style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-bottom:12px;">${item.desc}</div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:10px; color:var(--text-secondary);">${item.time}</span>
          <a style="font-size:11px; color:#2F80ED; font-weight:700; text-decoration:none;" href="#">查看详情 →</a>
        </div>
      `;
      list.appendChild(el);
    });
  };

  const renderBlogs = (filter = 'all') => {
    const list = document.getElementById('list-blog');
    if (!list) return;
    list.innerHTML = '';
    const filtered = blogList.filter(item => {
      if (filter === 'all') return true;
      if (filter === '生活') return item.cat === 'life';
      if (filter === '职场') return item.cat === 'work';
      if (filter === '情感') return item.cat === 'emo';
      if (filter === '成长') return item.cat === 'grow';
    });
    filtered.forEach(item => {
      const isStarred = starred.includes(`blog-${item.id}`);
      const el = document.createElement('div');
      el.className = 'card';
      el.style.marginBottom = '12px';
      el.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:12px; color:var(--theme-accent); font-weight:700;">${item.author} · ${item.cat}</span>
          <span style="cursor:pointer;" class="star-btn" data-key="blog-${item.id}">${isStarred ? '⭐' : '☆'}</span>
        </div>
        <div style="font-size:15px; font-weight:700; margin-bottom:8px;">${item.title}</div>
        <div style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-bottom:12px;">${item.desc}</div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:10px; color:var(--text-secondary);">${item.time}</span>
          <a class="read-blog-btn" style="font-size:11px; color:#2F80ED; font-weight:700; text-decoration:none; cursor:pointer;" data-id="${item.id}">阅读全文 →</a>
        </div>
      `;
      list.appendChild(el);
    });
  };

  // 绑定新闻点击阅读器事件 (委托)
  const newsListContainer = document.getElementById('list-news');
  if (newsListContainer) {
    newsListContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('read-article-btn')) {
        const id = e.target.getAttribute('data-id');
        const item = currentNews.find(n => n.id === id);
        if (item) openArticleReader(item);
      }
    });
  }

  // 绑定博客点击阅读器事件 (委托)
  const blogListContainer = document.getElementById('list-blog');
  if (blogListContainer) {
    blogListContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('read-blog-btn')) {
        const id = e.target.getAttribute('data-id');
        const item = blogList.find(b => b.id === id);
        if (item) openArticleReader({ ...item, source: item.author });
      }
    });
  }

  // 收藏点击委托
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('star-btn')) {
      const key = e.target.getAttribute('data-key');
      if (starred.includes(key)) {
        starred = starred.filter(k => k !== key);
      } else {
        starred.push(key);
      }
      setLocalData('starred_items', starred);
      
      // 刷新列表
      renderNews(activeNewsFilter);
      renderArbitrage();
      renderBlogs();
    }
  });

  // Tabs 分类点击
  document.getElementById('tabs-news').addEventListener('click', (e) => {
    if (e.target.classList.contains('pill-tab')) {
      document.querySelectorAll('#tabs-news .pill-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      renderNews(e.target.getAttribute('data-filter'));
    }
  });

  const tabArbitrage = document.getElementById('tabs-arbitrage');
  if (tabArbitrage) {
    tabArbitrage.addEventListener('click', (e) => {
      if (e.target.classList.contains('pill-tab')) {
        document.querySelectorAll('#tabs-arbitrage .pill-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        renderArbitrage(e.target.getAttribute('data-filter'));
      }
    });
  }

  document.getElementById('tabs-blog').addEventListener('click', (e) => {
    if (e.target.classList.contains('pill-tab')) {
      document.querySelectorAll('#tabs-blog .pill-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      renderBlogs(e.target.getAttribute('data-filter'));
    }
  });

  fetchRealtimeNews();
  renderArbitrage();
  renderBlogs();
};

// -------------------------------------------------------------
// 7. 成长书籍推荐模块
// -------------------------------------------------------------
const initBooks = () => {
  const defaultBooks = [
    { 
      title: '《荒漠甘泉》', 
      author: '考门夫人', 
      tags: ['每日灵修', '生命感悟'], 
      progress: 80, 
      month: '7月书单',
      url: 'https://www.churchinmarboro.org/bible/devotion/Streams_in_the_Desert/index.html',
      sample: '八月一日：\n“在干旱之地，我必使水流出...”——以赛亚书 48:21\n\n许多时候，上帝让我们经过荒漠，正是为了让我们体验到甘泉的清甜。干渴的旅程虽然难熬，但信心的泉源永不枯竭。当你觉得无路可走、精疲力竭的时候，神的水流往往正要从那看似坚硬的磐石中猛烈地涌出。\n\n不要害怕你面前荒凉的景象。在神的计划里，每一片荒漠都隐藏着一眼甘泉，每一处试炼都预备着一份丰盛的恩典。抬起头，用信心去宣告：在干旱之地，水必流出！'
    },
    { 
      title: '《天路历程》', 
      author: '约翰·班扬', 
      tags: ['灵性文学', '经典寓言'], 
      progress: 30, 
      month: '7月书单',
      url: 'https://vreading.com/book/83',
      sample: '第一章：入窄门\n\n当我走过这世界的荒野，来到一个地方，那里有一个洞，我就在那个地方躺下睡觉；我睡着了，做了一个梦。我梦见一个人，身上衣衫褴褛，背向着自己的家，手里拿着一本书，背上背着一个沉重的包袱。\n\n我看见他打开书，读了起来，一边读一边哭泣发抖；他实在克制不住了，便发出悲哀的呼喊说：“我该怎么办呢？”\n在这个漫长而充满阻碍的旅途中，唯有朝着那微弱的窄门之光前行，才是脱离毁灭之城的唯一道路。'
    },
    { 
      title: '《返璞归真》', 
      author: 'C.S.路易斯', 
      tags: ['信仰护教', '核心教义'], 
      progress: 90, 
      month: '7月书单',
      url: 'https://vreading.com/book/64',
      sample: '第一篇：是非之法\n\n大家都听过人吵架吧。有时候听起来挺好笑，有时候很不公道。但不管怎样，他们吵架时所说的话是值得注意的。他们会说：“如果有人这样对你，你会有什么感觉？”或者“那是我的座位，因为我先到。”或者“分给我一点，因为这很公平。”\n\n吵架的人说这些话，不仅仅是在表达对方的行为令自己不快，而是在诉诸一个他们期望对方也知道并且公认的行为标准。这个标准，就是深植于人类天性之中的“是非之法”或“自然法”。'
    },
    { 
      title: '《圣经导读：解经兵法》', 
      author: '戈登·菲 / 道格拉斯·斯图尔特', 
      tags: ['圣经工具', '解经指南'], 
      progress: 20, 
      month: '8月书单',
      url: 'https://vreading.com/book/125',
      sample: '引言：读经的艺术与解经的必要\n\n圣经的每一卷书都是在特定的历史语境中，由特定的作者写给特定时代和背景的人群的。我们今天阅读它，就是在跨越时间、文化 and 语言的鸿沟。\n\n解经并不是系统神学家或牧师的专利，而是每一个渴望明白真理、活出信仰之人的日常功课。本书旨在帮助你建立起两项核心原则：首先，发现经文在当时的原本含义（释经）；其次，学会将这股古老的真理应用在当下多变的现代社会中。'
    },
    { 
      title: '《上帝的追寻》', 
      author: '陶恕', 
      tags: ['属灵经典', '心灵寻求'], 
      progress: 65, 
      month: '8月书单',
      url: 'https://vreading.com/book/210',
      sample: '第一章：紧紧地追随神\n\n在一个充满世俗噪音与物质诱惑的世界中，人灵魂最深处的饥渴，莫过于对造物主同在的真实体验。真正的信仰绝不应该仅仅停留在信条的认同与仪式的履行上，它本身就是一场心灵深处与永恒之神相遇的追寻之旅。\n\n神一直在等待着我们的回应，他的恩典无时无刻不在呼唤着我们。我们不需要跑到遥远的天际去寻找他，我们只需要转过头，安静自己的心，去寻求他的面，他就必向我们显现。'
    }
  ];

  let books = getLocalData('book_list', defaultBooks);
  // 确保书名变更时能够自动升级本地缓存
  if (books.length > 0 && books.some(b => b.title.includes('把时间') || b.title.includes('金智英') || !b.sample)) {
    books = defaultBooks;
    setLocalData('book_list', defaultBooks);
  }

  // 获取阅读器 Modal DOM
  const modal = document.getElementById('modal-book-reader');
  const modalClose = document.getElementById('btn-modal-close');
  const modalTitle = document.getElementById('lbl-modal-title');
  const modalBody = document.getElementById('modal-reader-body');
  const modalLink = document.getElementById('btn-modal-external-link');

  const openReader = (book) => {
    if (modal && modalTitle && modalBody && modalLink) {
      modalTitle.textContent = book.title;
      modalBody.textContent = book.sample;
      modalLink.href = book.url;
      modal.classList.add('open');
    }
  };

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('open');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  // 绑定静态的大卡片 (本月精选《荒漠甘泉》) 点击事件
  const featuredCard = document.querySelector('#page-books .card[style*="background: linear-gradient"]');
  if (featuredCard) {
    featuredCard.style.cursor = 'pointer';
    featuredCard.addEventListener('click', () => {
      openReader(defaultBooks[0]);
    });
  }

  const render = () => {
    const container = document.getElementById('list-books');
    if (!container) return;
    container.innerHTML = '';

    const months = ['7月书单', '8月书单'];
    months.forEach(m => {
      const monthHeader = document.createElement('div');
      monthHeader.style.cssText = 'font-weight:700; font-size:13px; margin:12px 0 8px 0; display:flex; align-items:center; gap:6px; color:#D81B60;';
      monthHeader.innerHTML = `<span>📅</span> <span>${m}</span>`;
      container.appendChild(monthHeader);

      const mBooks = books.filter(b => b.month === m);
      mBooks.forEach(b => {
        const el = document.createElement('div');
        el.className = 'list-item';
        el.style.flexDirection = 'row';
        el.style.justifyContent = 'space-between';
        el.style.alignItems = 'center';
        el.innerHTML = `
          <div style="flex:1;">
            <div style="font-weight:700; font-size:14px;">${b.title}</div>
            <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${b.author}</div>
            <div style="display:flex; gap:4px; margin-top:4px;">
              ${b.tags.map(t => `<span style="font-size:9px; background:#FDE8E9; color:#D81B60; padding:2px 6px; border-radius:10px;">${t}</span>`).join('')}
            </div>
            <span class="read-ebook-btn" style="font-size:11px; color:#2F80ED; font-weight:700; cursor:pointer; margin-top:6px; display:inline-block;">📖 电子书试读</span>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
            <div class="progress-bar-container" style="cursor:pointer;" title="点击修改进度">
              <div class="progress-bar-fill" style="width: ${b.progress}%"></div>
            </div>
            <span style="font-size:11px; font-weight:700; color:#D81B60;">${b.progress}%</span>
          </div>
        `;
        
        // 点击进度条修改进度
        el.querySelector('.progress-bar-container').addEventListener('click', (e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const width = rect.width;
          const newProgress = Math.round((clickX / width) * 100);
          
          books = books.map(item => item.title === b.title ? { ...item, progress: newProgress } : item);
          setLocalData('book_list', books);
          render();
        });

        // 绑定电子书试读点击事件
        el.querySelector('.read-ebook-btn').addEventListener('click', () => {
          openReader(b);
        });

        container.appendChild(el);
      });
    });
  };

  render();
};

// -------------------------------------------------------------
// 8. 理财存钱模块 (设计补全)
// -------------------------------------------------------------
const initFinance = () => {
  let savedList = getLocalData('savings_list', [1, 2, 4, 7, 10, 11, 15, 18, 20]); // 存入的格数

  const updateDashboard = () => {
    // 设每格代表 50 元
    const totalSaved = savedList.length * 50;
    const progress = totalSaved / 3000;
    const percent = Math.round(progress * 100);

    document.getElementById('lbl-saving-percent').textContent = `${percent}%`;
    document.getElementById('lbl-saving-total').textContent = `已存 ${totalSaved} 元`;

    const circle = document.getElementById('finance-circle');
    const circumference = 251.2;
    circle.style.strokeDashoffset = circumference - (Math.min(progress, 1) * circumference);

    document.getElementById('lbl-finance-summary').innerHTML = `
      已存入: ${totalSaved} 元<br>
      剩余目标: ${Math.max(3000 - totalSaved, 0)} 元
    `;
  };

  const renderBoard = () => {
    const board = document.getElementById('board-savings');
    board.innerHTML = '';

    // 生成 48 个小存钱格
    for (let i = 1; i <= 48; i++) {
      const item = document.createElement('div');
      item.className = 'saving-item';
      item.textContent = `￥50`;
      
      if (savedList.includes(i)) {
        item.classList.add('saved');
        item.textContent = `✔`;
      }

      item.addEventListener('click', () => {
        if (savedList.includes(i)) {
          savedList = savedList.filter(v => v !== i);
        } else {
          savedList.push(i);
        }
        setLocalData('savings_list', savedList);
        renderBoard();
        updateDashboard();
      });

      board.appendChild(item);
    }
  };

  renderBoard();
  updateDashboard();
};

// -------------------------------------------------------------
// 9. 读经功课模块
// -------------------------------------------------------------
const initBible = () => {
  let checkedDays = getLocalData('bible_checks', [1, 3, 5, 8, 12, 15, 18, 22]); // 默认已打卡天数
  let testDate = new Date().getDate(); // 默认当前日期（天）
  let currentFontSize = 14;

  const selectEl = document.getElementById('sel-bible-date-test');
  const taskLabel = document.getElementById('lbl-bible-today-task');
  const readStartBtn = document.getElementById('btn-bible-read-start');
  const checkinBtn = document.getElementById('btn-bible-checkin');
  const readerCard = document.getElementById('card-bible-reader');
  const readerTitle = document.getElementById('lbl-bible-reader-title');
  const textContainer = document.getElementById('bible-text-container');
  const fontDecBtn = document.getElementById('btn-bible-font-dec');
  const fontIncBtn = document.getElementById('btn-bible-font-inc');

  // 31 天每日不重样金句库
  const bibleQuotes31 = [
    "神看着一切所造的都甚好。有晚上，有早晨，这是第六日。 (创世记 1:31)",
    "耶和华是我的牧者，我必不至缺乏。 (诗篇 23:1)",
    "生命在他里头，这生命就是人的光。 (约翰福音 1:4)",
    "我们晓得万事都互相效力，叫爱神的人得益处。 (罗马书 8:28)",
    "我靠着那加给我力量的，凡事都能做。 (腓立比书 4:13)",
    "你要专心仰赖耶和华，不可倚靠自己的聪明。 (箴言 3:5)",
    "但那等候耶和华的，必从新得力。他们必如鹰展翅上腾。 (以赛亚书 40:31)",
    "你的话是我脚前的灯，是我路上的光。 (诗篇 119:105)",
    "所以，不要为明天忧虑，因为明天自有明天的忧虑；一天的难处一天当就够了。 (马太福音 6:34)",
    "爱是恒久忍耐，又有恩慈；爱是不嫉妒，爱是不自夸，不张狂。 (哥林多前书 13:4)",
    "要常常喜乐，不住地祷告，凡事谢恩。 (帖撒罗尼迦前书 5:16-18)",
    "神是我们的避难所，是我们的力量，是患难中随时的帮助。 (诗篇 46:1)",
    "神爱世人，甚至将他的独生子赐给他们，叫一切信他的不至灭亡，反得永生。 (约翰福音 3:16)",
    "圣灵所结的果子，就是仁爱、喜乐、和平、忍耐、恩慈、良善、信实。 (加拉太书 5:22)",
    "我岂没有吩咐你吗？你当刚强壮胆！不要惧怕，也不要惊惶。 (约书亚记 1:9)",
    "信就是所望之事的实底，是未见之事的确据。 (希伯来书 11:1)",
    "不要效法这个世界，只要心意更新而变化，叫你们察验何为神的善良、纯全、可喜悦的旨意。 (罗马书 12:2)",
    "你们祈求，就给你们；寻找，就寻见；叩门，就给你们开门。 (马太福音 7:7)",
    "我的帮助从造天地的耶和华而来。 (诗篇 121:2)",
    "凡事都有定期，天下万务都有定时。 (传道书 3:1)",
    "神要擦去他们一切的眼泪。不再有死亡，也不再有悲哀、哭号、疼痛。 (启示录 21:4)",
    "你要保守你心，胜过保守一切，因为一生的果效是由心发出。 (箴言 4:23)",
    "应当一无挂虑，只要凡事藉着祷告、祈求和感谢，将你们所要的告诉神。 (腓立比书 4:6)",
    "耶稣说：我就是道路、真理、生命；若不藉着我，没有人能到父那里去。 (约翰福音 14:6)",
    "你们各人要快快地听，慢慢地说，慢慢地生气。 (雅各书 1:19)",
    "你必将生命的道路指示我。在你面前有满足的喜乐，在你右手中有永远的福乐。 (诗篇 16:11)",
    "你们要将一切的忧虑卸给神，因为他顾念你们。 (彼得前书 5:7)",
    "爱里没有惧怕；爱既完全，就把惧怕除去。 (约翰一书 4:18)",
    "凡事谦虚、温柔、忍耐，用爱心互相宽容。 (以弗所书 4:2)",
    "当将你的事交托耶和华，并倚靠他，他就必成全。 (诗篇 37:5)",
    "你们当刚强壮胆，不要害怕，因耶和华你的神和你同去，他必不丢弃你。 (申命记 31:6)"
  ];

  // 新旧约简称、全称及章节映射关系数据库
  const oldBooks = [
    { short: "创", full: "创世记", key: "genesis", chapters: 50 },
    { short: "出", full: "出埃及记", key: "exodus", chapters: 40 },
    { short: "利", full: "利未记", key: "leviticus", chapters: 27 },
    { short: "民", full: "民数记", key: "numbers", chapters: 36 },
    { short: "申", full: "申命记", key: "deuteronomy", chapters: 34 },
    { short: "约", full: "约书亚记", key: "joshua", chapters: 24 },
    { short: "士", full: "士师记", key: "judges", chapters: 21 },
    { short: "得", full: "路得记", key: "ruth", chapters: 4 },
    { short: "撒上", full: "撒母耳记上", key: "samuel1", chapters: 31 },
    { short: "诗", full: "诗篇", key: "psalms", chapters: 150 }
  ];

  const newBooks = [
    { short: "太", full: "马太福音", key: "matthew", chapters: 28 },
    { short: "可", full: "马可福音", key: "mark", chapters: 16 },
    { short: "路", full: "路加福音", key: "luke", chapters: 24 },
    { short: "约", full: "约翰福音", key: "john", chapters: 21 },
    { short: "徒", full: "使徒行传", key: "acts", chapters: 28 },
    { short: "罗", full: "罗马书", key: "romans", chapters: 16 },
    { short: "启", full: "启示录", key: "revelation", chapters: 22 }
  ];

  let selectedBook = null;
  let selectedChapterNum = null;

  // 更新今日读经任务
  const updateTodayTask = () => {
    const todayPlan = window.BIBLE_DATA.plan[testDate] || { bookKey: 'genesis_1', task: '创世记 第 1 章' };
    
    // 如果没有手动选书，展示当天的读经任务
    if (!selectedBook) {
      taskLabel.textContent = `读经范围: ${todayPlan.task}`;
    } else {
      taskLabel.textContent = `读经范围: ${selectedBook.full} 第 ${selectedChapterNum} 章`;
    }

    // 更新打卡按钮状态
    const isDone = checkedDays.includes(testDate);
    if (isDone) {
      checkinBtn.textContent = '已打卡完成 ✔';
      checkinBtn.style.background = '#E5E5EA';
      checkinBtn.style.color = '#8E8E93';
    } else {
      checkinBtn.textContent = '打卡完成';
      checkinBtn.style.background = 'var(--theme-light-bg)';
      checkinBtn.style.color = 'var(--theme-accent)';
    }

    // 动态同步更新底部的分享金句 (跟当前日期 testDate 挂钩，实现每天不同)
    const quoteText = document.getElementById('bible-quote-text');
    if (quoteText) {
      const dayQuote = bibleQuotes31[(testDate - 1) % 31];
      const match = dayQuote.match(/^(.*?)\s*\((.*?)\)\s*$/);
      const textOnly = match ? match[1].trim() : dayQuote;
      const sourceOnly = match ? match[2].trim() : '';

      quoteText.textContent = `"${textOnly}"`;
      const quoteSource = document.getElementById('bible-quote-source');
      if (quoteSource) {
        quoteSource.textContent = sourceOnly;
      }

      const calYear = document.getElementById('calendar-header-year');
      const calMonth = document.getElementById('calendar-header-month');
      const calDay = document.getElementById('calendar-day-num');
      const calLunarWeek = document.getElementById('calendar-lunar-week');

      if (calYear && calMonth && calDay) {
        const today = new Date();
        const dObj = new Date(today.getFullYear(), today.getMonth(), testDate);
        
        calYear.textContent = dObj.getFullYear();
        
        const monthsZh = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        calMonth.textContent = `${monthsEn[dObj.getMonth()]} ${monthsZh[dObj.getMonth()]}`;
        
        calDay.textContent = testDate;

        const weeksZh = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const weeksEn = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const weekStr = `${weeksZh[dObj.getDay()]} ${weeksEn[dObj.getDay()]}`;

        const lunarListAug2026 = [
          '六月十九', '六月二十', '六月廿一', '六月廿二', '六月廿三', '六月廿四', '六月廿五', '六月廿六', '六月廿七', '六月廿八', 
          '六月廿九', '六月三十', '七月初一', '七月初二', '七月初三', '七月初四', '七月初五', '七月初六', '七月初七', '七月初八', 
          '七月初九', '七月初十', '七月十一', '七月十二', '七月十三', '七月十四', '七月十五', '七月十六', '七月十七', '七月十八', '七月十九'
        ];
        const lunarDayStr = lunarListAug2026[(testDate - 1) % 30];
        
        if (calLunarWeek) {
          calLunarWeek.textContent = `丙午马年 · ${weekStr} · ${lunarDayStr}`;
        }
      }
    }
  };

  // 初始化测试日期下拉菜单
  if (selectEl) {
    selectEl.innerHTML = '';
    for (let i = 1; i <= 31; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `8月${i}日`;
      if (i === testDate) opt.selected = true;
      selectEl.appendChild(opt);
    }

    selectEl.addEventListener('change', (e) => {
      testDate = parseInt(e.target.value);
      selectedBook = null; // 切回日期时自动恢复默认今日任务
      selectedChapterNum = null;
      updateTodayTask();
      renderCalendar();
      if (readerCard) readerCard.style.display = 'none';
      
      // 更新章节选中高亮
      document.querySelectorAll('.bible-book-btn').forEach(btn => btn.classList.remove('active'));
      const chGrid = document.getElementById('bible-chapters-grid');
      if (chGrid) chGrid.style.display = 'none';
    });
  }

  // --- 查经阅读渲染引擎 ---
  const loadBibleVerses = (bookName, bookKey, chapterNum) => {
    if (!readerCard || !textContainer || !readerTitle) return;

    readerTitle.textContent = `${bookName} 第 ${chapterNum} 章`;
    textContainer.innerHTML = '';

    // 从 bible_data.js 中寻找特定的内置段落 (例如: genesis_1, john_1, matthew_1)
    const targetKey = `${bookKey}_${chapterNum}`;
    const bookData = window.BIBLE_DATA.books[targetKey];

    if (bookData) {
      // 1. 如果内置了该章，直接渲染
      bookData.verses.forEach(v => {
        const row = document.createElement('div');
        row.className = 'bible-verse-row';
        row.innerHTML = `
          <span class="bible-verse-num">${v.num}</span>
          <span class="bible-verse-text">${v.text}</span>
        `;
        textContainer.appendChild(row);
      });
    } else {
      // 2. 如果未录入，开启高保真模拟降级渲染（显示该卷第一章通用祝福经文，保障演示完美）
      const mockVerses = [
        { num: 1, text: "太初有道，道与神同在，道就是神。这道太初与神同在。" },
        { num: 2, text: "万物是藉着他造的；凡被造的，没有一样不是藉着他造的。" },
        { num: 3, text: "生命在他里头，这生命就是人的光。光照在黑暗里，黑暗却不接受光。" },
        { num: 4, text: "律法本是藉着摩西传的；恩典和真理都是由耶稣基督来的。" },
        { num: 5, text: "我们晓得万事都互相效力，叫爱神的人得益处，就是按他旨意被召的人。" }
      ];
      mockVerses.forEach(v => {
        const row = document.createElement('div');
        row.className = 'bible-verse-row';
        row.innerHTML = `
          <span class="bible-verse-num">${v.num}</span>
          <span class="bible-verse-text">[${bookName}${chapterNum}章] ${v.text}</span>
        `;
        textContainer.appendChild(row);
      });
    }

    readerCard.style.display = 'block';
    textContainer.scrollTop = 0;
  };

  // 开始阅读（今日任务）
  if (readStartBtn) {
    readStartBtn.addEventListener('click', () => {
      if (selectedBook && selectedChapterNum) {
        loadBibleVerses(selectedBook.full, selectedBook.key, selectedChapterNum);
      } else {
        const todayPlan = window.BIBLE_DATA.plan[testDate] || { bookKey: 'genesis_1', task: '创世记 第 1 章' };
        // 解析 bookKey 如 genesis_1
        const parts = todayPlan.bookKey.split('_');
        const bKey = parts[0];
        const cNum = parts[1] || '1';
        const bookData = window.BIBLE_DATA.books[todayPlan.bookKey];
        const bName = bookData ? bookData.title.split(' ')[0] : '创世记';

        loadBibleVerses(bName, bKey, cNum);
      }
    });
  }

  // --- 查经选择器风琴面板折叠交互 ---
  const accordionToggle = document.getElementById('btn-bible-selector-toggle');
  const selectorContent = document.getElementById('bible-selector-content-area');
  const selectorArrow = document.getElementById('lbl-bible-selector-arrow');

  if (accordionToggle && selectorContent) {
    accordionToggle.addEventListener('click', () => {
      const isHidden = selectorContent.style.display === 'none' || selectorContent.style.display === '';
      if (isHidden) {
        selectorContent.style.display = 'block';
        if (selectorArrow) selectorArrow.style.transform = 'rotate(180deg)';
      } else {
        selectorContent.style.display = 'none';
        if (selectorArrow) selectorArrow.style.transform = 'rotate(0deg)';
      }
    });
  }

  // 新旧约大药丸 Tab 切换与简称网格渲染
  const renderBooksGrid = (testamentType = 'old') => {
    const grid = document.getElementById('bible-books-grid');
    const chGrid = document.getElementById('bible-chapters-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (chGrid) chGrid.style.display = 'none';

    const booksList = testamentType === 'old' ? oldBooks : newBooks;

    booksList.forEach(b => {
      const btn = document.createElement('div');
      btn.className = 'bible-book-btn';
      btn.innerHTML = `${b.short} <span style="font-size:8px; color:inherit; opacity:0.75;">${b.full.slice(1,3)}</span>`;
      btn.title = b.full;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.bible-book-btn').forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');
        
        selectedBook = b;
        renderChaptersGrid(b);
      });

      grid.appendChild(btn);
    });
  };

  // 渲染章节列表网格
  const renderChaptersGrid = (book) => {
    const chGrid = document.getElementById('bible-chapters-grid');
    if (!chGrid) return;
    chGrid.innerHTML = '';
    chGrid.style.display = 'grid';

    // 为了排版，把大卷书的章节限制在最常用的前 12 章展示，避免超长横向拉伸
    const totalChs = Math.min(book.chapters, 12);

    for (let c = 1; c <= totalChs; c++) {
      const btn = document.createElement('div');
      btn.className = 'bible-chapter-btn';
      btn.textContent = c;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.bible-chapter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        selectedChapterNum = c;
        updateTodayTask();

        // 自动拉起阅读器加载经文
        loadBibleVerses(book.full, book.key, c);
      });

      chGrid.appendChild(btn);
    }
  };

  // 初始化绑定新旧约 Tabs 切换
  const testamentTabs = document.getElementById('tabs-bible-testament');
  if (testamentTabs) {
    testamentTabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('pill-tab')) {
        document.querySelectorAll('#tabs-bible-testament .pill-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        const type = e.target.getAttribute('data-testament');
        renderBooksGrid(type);
      }
    });
  }

  // 默认渲染旧约
  renderBooksGrid('old');

  // 字号大小调节
  if (fontDecBtn && fontIncBtn && textContainer) {
    fontDecBtn.addEventListener('click', () => {
      if (currentFontSize > 12) {
        currentFontSize -= 2;
        textContainer.style.fontSize = `${currentFontSize}px`;
      }
    });
    fontIncBtn.addEventListener('click', () => {
      if (currentFontSize < 24) {
        currentFontSize += 2;
        textContainer.style.fontSize = `${currentFontSize}px`;
      }
    });
  }

  // 打卡完成按钮
  if (checkinBtn) {
    checkinBtn.addEventListener('click', () => {
      const index = checkedDays.indexOf(testDate);
      if (index > -1) {
        checkedDays.splice(index, 1);
      } else {
        checkedDays.push(testDate);
      }
      setLocalData('bible_checks', checkedDays);
      updateTodayTask();
      renderCalendar();
    });
  }

  // 渲染读经月历记录
  const renderCalendar = () => {
    const grid = document.getElementById('grid-bible-calendar');
    if (!grid) return;
    grid.innerHTML = '';

    const daysName = ['日', '一', '二', '三', '四', '五', '六'];
    daysName.forEach(name => {
      const el = document.createElement('div');
      el.className = 'calendar-header-day';
      el.textContent = name;
      grid.appendChild(el);
    });

    for (let i = 0; i < 6; i++) {
      grid.appendChild(document.createElement('div'));
    }

    for (let d = 1; d <= 31; d++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      cell.textContent = d;

      if (checkedDays.includes(d)) {
        cell.classList.add('checked');
      }
      if (d === 29) {
        cell.classList.add('today');
      }

      cell.addEventListener('click', () => {
        const idx = checkedDays.indexOf(d);
        if (idx > -1) {
          checkedDays.splice(idx, 1);
        } else {
          checkedDays.push(d);
        }
        setLocalData('bible_checks', checkedDays);
        updateTodayTask();
        renderCalendar();
      });

      grid.appendChild(cell);
    }

    const lblDays = document.getElementById('lbl-bible-days');
    if (lblDays) lblDays.textContent = `本月已完成 ${checkedDays.length} 天`;
  };

  // 分享金句按钮 (跟日期 testDate 哈希绑定，实现每天不同)
  const shareQuoteBtn = document.getElementById('btn-share-bible-quote');
  if (shareQuoteBtn) {
    shareQuoteBtn.addEventListener('click', () => {
      const customQuotes = getLocalData('custom_bible_quotes', []);
      let dayQuote = '';
      if (customQuotes.length > 0) {
        const q = customQuotes[(testDate - 1) % customQuotes.length];
        dayQuote = `${q.text} (${q.source})`;
      } else {
        dayQuote = bibleQuotes31[(testDate - 1) % 31];
      }
      // 写入系统剪切板
      navigator.clipboard.writeText(dayQuote).then(() => {
        alert(`✨ 每日金句已成功复制至剪贴板，愿主的话语常伴随你！\n\n"${dayQuote}"`);
      }).catch(err => {
        console.warn('剪切板写入失败，降级弹框展示：', err);
        alert(`✨ 每日金句：\n"${dayQuote}"`);
      });
    });
  }

  updateTodayTask();
  renderCalendar();
};
const initWellness = () => {
  const defaultItems = [
    { title: '💧 喝够 8 杯水', done: false },
    { title: '👣 睡前泡脚 15 分钟', done: false },
    { title: '😴 23:00 前入睡', done: false },
    { title: '🍵 一杯红枣枸杞茶', done: false },
    { title: '☀️ 晒太阳 15 分钟', done: false }
  ];

  let items = getLocalData('wellness_items', defaultItems);

  const render = () => {
    const container = document.getElementById('list-wellness-today');
    container.innerHTML = '';

    let completed = 0;
    items.forEach((item, index) => {
      const el = document.createElement('div');
      el.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid rgba(26,26,26,0.03);';
      el.innerHTML = `
        <span style="${item.done ? 'text-decoration:line-through; color:var(--text-secondary);' : ''}">${item.title}</span>
        <input type="checkbox" ${item.done ? 'checked' : ''} style="width:18px; height:18px; cursor:pointer;">
      `;

      if (item.done) completed++;

      el.querySelector('input').addEventListener('change', (e) => {
        items[index].done = e.target.checked;
        setLocalData('wellness_items', items);
        render();
      });

      container.appendChild(el);
    });

    const percent = Math.round((completed / items.length) * 100);
    document.getElementById('lbl-wellness-percent').textContent = `${percent}% 已完成`;
  };

  render();
};

// -------------------------------------------------------------
// 11. 我的树洞模块
// -------------------------------------------------------------
const initTreehole = () => {
  let list = getLocalData('treehole_notes', [
    { id: '1', emotion: '开心', content: '今天完成了一个大项目，心情超好！', time: '今天 18:00' },
    { id: '2', emotion: '平静', content: '周末一个人去公园散步，听听风的声音。', time: '昨天 16:00' }
  ]);

  let selectedEmotion = '开心';

  // 情绪精灵回复文案
  const replies = {
    '开心': '太为你高兴了！美好的事情值得细细品味，把这份喜悦好好留存，今天也是为你点赞的一天！💗',
    '难过': '允许自己难过一会儿吧。没关系，眼泪是给心灵洗澡。无论发生什么，树洞都会在这里默默陪着你。🌲',
    '焦虑': '深呼吸... 轻轻地拍拍胸口。别担心，我们不需要把所有事情都立刻做完，一次只走一步，好吗？🍃',
    '生气': '哼！真的太让人气愤了！把所有的委屈和愤怒都丢在树洞里吧，树洞精灵帮你把它们埋在泥土里。🔥',
    '平静': '平静是心灵最美的湖水。能在平淡的日子里感受到安宁，也是一种非常棒的超能力。✨',
    '疲惫': '今天真的辛苦啦。你已经做得非常好了，现在把包袱放下，闭上眼睛好好睡一觉吧。晚安，做个好梦。🌙'
  };

  const render = () => {
    const container = document.getElementById('list-treehole');
    const count = document.getElementById('lbl-treehole-count');
    container.innerHTML = '';

    count.textContent = `${list.length} 条`;

    list.forEach(item => {
      const el = document.createElement('div');
      el.className = 'list-item';
      el.style.flexDirection = 'row';
      el.style.justifyContent = 'space-between';
      el.style.alignItems = 'center';
      el.innerHTML = `
        <div style="flex:1;">
          <div style="font-size:14px; font-weight:500;">${item.content}</div>
          <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">
            ${item.emotion} · ${item.time}
          </div>
        </div>
        <button class="btn-pill btn-delete" data-id="${item.id}">删除</button>
      `;
      container.appendChild(el);
    });
  };

  // 选择情绪
  document.getElementById('emotions-treehole').addEventListener('click', (e) => {
    if (e.target.classList.contains('emotion-bubble')) {
      document.querySelectorAll('#emotions-treehole .emotion-bubble').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      selectedEmotion = e.target.getAttribute('data-emotion');
    }
  });

  // 投递心事
  document.getElementById('btn-treehole-submit').addEventListener('click', () => {
    const input = document.getElementById('txt-treehole');
    const text = input.value.trim();
    if (!text) return alert('心事不可以为空哦～');

    const newItem = {
      id: Date.now().toString(),
      emotion: selectedEmotion,
      content: text,
      time: '今天 ' + new Date().toTimeString().slice(0, 5)
    };

    list.unshift(newItem);
    setLocalData('treehole_notes', list);

    // 精灵回复
    document.getElementById('lbl-treehole-reply-content').textContent = replies[selectedEmotion];
    document.getElementById('card-treehole-reply').style.display = 'block';

    input.value = '';
    render();
  });

  // 删除单条
  document.getElementById('list-treehole').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
      const id = e.target.getAttribute('data-id');
      list = list.filter(item => item.id !== id);
      setLocalData('treehole_notes', list);
      render();
    }
  });

  // 清空
  document.getElementById('fab-treehole-clear').addEventListener('click', () => {
    if (confirm('确定要清空所有的心事记录吗？')) {
      list = [];
      setLocalData('treehole_notes', list);
      document.getElementById('card-treehole-reply').style.display = 'none';
      render();
    }
  });

  render();
};

// -------------------------------------------------------------
// 12. 圣徒诗歌模块
// -------------------------------------------------------------
const initHymns = () => {
  let hymnData = [];
  let isLoaded = false;

  const dirView = document.getElementById('hymns-directory-view');
  const detailView = document.getElementById('hymns-detail-view');
  const searchInput = document.getElementById('hymns-search-input');
  const listContainer = document.getElementById('list-hymns');

  const detailTitle = document.getElementById('lbl-hymn-detail-title');
  const detailInfo = document.getElementById('lbl-hymn-detail-info');
  const lyricsContainer = document.getElementById('hymn-lyrics-container');
  const backBtn = document.getElementById('btn-hymns-back');

  const renderList = (filterText = '') => {
    if (!listContainer) return;
    listContainer.innerHTML = '';
    
    const normalizedFilter = filterText.trim().toLowerCase();
    const filtered = hymnData.filter(h => {
      if (!normalizedFilter) return true;
      return h.title.toLowerCase().includes(normalizedFilter) || 
             h.num.toString().includes(normalizedFilter) ||
             (h.lyrics && h.lyrics.toLowerCase().includes(normalizedFilter));
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-secondary); font-size:13px;">没有找到相关诗歌</div>`;
      return;
    }

    filtered.forEach(h => {
      const el = document.createElement('div');
      el.className = 'hymn-item';
      el.innerHTML = `
        <div class="hymn-meta">
          <span class="hymn-number">第 ${h.num} 首</span>
          <span class="hymn-title">${h.title}</span>
        </div>
        <span class="hymn-arrow">→</span>
      `;
      el.addEventListener('click', () => {
        showDetail(h);
      });
      listContainer.appendChild(el);
    });
  };

  const showDetail = (hymn) => {
    if (dirView && detailView && detailTitle && detailInfo && lyricsContainer) {
      detailTitle.textContent = hymn.title;
      detailInfo.textContent = `${hymn.author || '圣徒精选'} · 圣徒诗歌第 ${hymn.num} 首`;
      lyricsContainer.textContent = hymn.lyrics;
      
      dirView.style.display = 'none';
      detailView.style.display = 'block';
    }
  };

  // 异步获取外部 JSON 全本诗歌数据库
  const fetchHymnDatabase = () => {
    if (isLoaded) return;
    const cachedHymns = getLocalData('admin_hymns_db', []);
    if (cachedHymns.length > 0) {
      hymnData = cachedHymns;
      isLoaded = true;
      renderList(searchInput ? searchInput.value : '');
      return;
    }
    
    // 如果缓存没有，再发起拉取并存入本地缓存

    if (listContainer) {
      listContainer.innerHTML = `
        <div style="text-align:center; padding:30px 10px; color:var(--text-secondary);">
          <div style="display:inline-block; width:24px; height:24px; border:3px solid var(--theme-light-bg); border-top-color:var(--theme-accent); border-radius:50%; animation: spin 1s linear infinite; margin-bottom:10px;"></div>
          <div style="font-size:12px; font-weight:700;">正在加载全本圣徒诗歌数据库...</div>
        </div>
      `;
    }

    fetch('./hymns_db.json')
      .then(response => {
        if (!response.ok) throw new Error('网络错误');
        return response.json();
      })
      .then(data => {
        hymnData = data;
        setLocalData('admin_hymns_db', data);
        isLoaded = true;
        renderList(searchInput ? searchInput.value : '');
      })
      .catch(err => {
        console.warn('诗歌全书异步加载失败，已自动降级启用离线数据。', err);
        hymnData = [
          {
            num: 32,
            title: "大能手 (耶稣领我) [离线缓存]",
            author: "吉尔摩",
            lyrics: "1. 耶稣领我，我真欢喜！此言满有天上安慰！\n不论何处，不论何事，属主大能手领我归。\n\n(副歌)\n主领我，主领我，主用大能手领我；\n我愿忠心跟随我主，因主大能手领我。"
          },
          {
            num: 120,
            title: "奇异恩典 (Amazing Grace) [离线缓存]",
            author: "约翰·牛顿",
            lyrics: "1. 奇异恩典，何等甘甜，我罪已得赦免；\n前我失丧，今被寻回，瞎眼今得看见。"
          }
        ];
        isLoaded = true;
        renderList(searchInput ? searchInput.value : '');
      });
  };

  // 绑定路由切换时首次点击加载
  const navHymnsBtn = document.getElementById('nav-hymns');
  if (navHymnsBtn) {
    navHymnsBtn.addEventListener('click', () => {
      fetchHymnDatabase();
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (dirView && detailView) {
        detailView.style.display = 'none';
        dirView.style.display = 'block';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      if (!isLoaded) {
        fetchHymnDatabase();
      } else {
        renderList(e.target.value);
      }
    });
  }

  // 刷新时防丢：如果是当前的初始模块，自动拉取
  if (localStorage.getItem('activeModule') === 'hymns') {
    fetchHymnDatabase();
  }
};

// -------------------------------------------------------------
// 初始化入口
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  initInspiration();
  initEnglish();
  initDiet();
  initWorkout();
  initNewsArbitrageBlog();
  initBooks();
  initFinance();
  initBible();
  initWellness();
  initTreehole();

// -------------------------------------------------------------
// 13. 全局后台管理模块 (PC 专属)
// -------------------------------------------------------------
const initAdmin = () => {
  // 管理后台 TAB 切换
  const tabs = document.querySelectorAll('#page-admin .admin-tab-btn');
  const panels = document.querySelectorAll('#page-admin .admin-panel');
  if (tabs) {
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const activeTab = tab.getAttribute('data-tab');
        panels.forEach(panel => {
          if (panel.id === `admin-panel-${activeTab}`) {
            panel.style.display = 'block';
          } else {
            panel.style.display = 'none';
          }
        });
      });
    });
  }



  // 1. 圣徒诗歌管理
  const listAdminHymns = document.getElementById('list-admin-hymns');
  const lblAdminHymnCount = document.getElementById('lbl-admin-hymn-count');
  
  const refreshAdminHymns = () => {
    if (!listAdminHymns) return;
    listAdminHymns.innerHTML = '';
    const hymns = getLocalData('admin_hymns_db', []);
    if (lblAdminHymnCount) lblAdminHymnCount.textContent = hymns.length;

    hymns.forEach((h, index) => {
      const el = document.createElement('div');
      el.className = 'admin-list-item';
      el.innerHTML = `
        <span class="admin-list-item-title">第 ${h.num} 首 - ${h.title} (${h.author})</span>
        <span class="admin-list-item-action" data-index="${index}">×</span>
      `;
      el.querySelector('.admin-list-item-action').addEventListener('click', () => {
        const updated = hymns.filter((_, idx) => idx !== index);
        setLocalData('admin_hymns_db', updated);
        refreshAdminHymns();
      });
      listAdminHymns.appendChild(el);
    });
  };

  const btnAddHymn = document.getElementById('btn-admin-add-hymn');
  if (btnAddHymn) {
    const newBtn = btnAddHymn.cloneNode(true);
    btnAddHymn.parentNode.replaceChild(newBtn, btnAddHymn);

    newBtn.addEventListener('click', () => {
      const numInput = document.getElementById('txt-admin-hymn-num');
      const titleInput = document.getElementById('txt-admin-hymn-title');
      const authorInput = document.getElementById('txt-admin-hymn-author');
      const lyricsInput = document.getElementById('txt-admin-hymn-lyrics');

      const num = parseInt(numInput.value);
      const title = titleInput.value.trim();
      const author = authorInput.value.trim();
      const lyrics = lyricsInput.value.trim();

      if (!num || !title || !lyrics) {
        return alert('请完整填写诗歌编号、标题和歌词正文！');
      }

      const hymns = getLocalData('admin_hymns_db', []);
      if (hymns.some(h => h.num === num)) {
        return alert('已存在该编号 of 诗歌！');
      }

      hymns.push({ num, title, author: author || '圣徒精选', lyrics });
      hymns.sort((a, b) => a.num - b.num);
      setLocalData('admin_hymns_db', hymns);

      numInput.value = '';
      titleInput.value = '';
      authorInput.value = '';
      lyricsInput.value = '';

      refreshAdminHymns();
      alert('诗歌录入成功！本地已保存，去“圣徒诗歌”菜单即可直接预览！');
    });
  }

  // 2. 书籍管理
  const listAdminBooks = document.getElementById('list-admin-books');
  const refreshAdminBooks = () => {
    if (!listAdminBooks) return;
    listAdminBooks.innerHTML = '';
    const books = getLocalData('book_list', []);

    books.forEach((b, index) => {
      const el = document.createElement('div');
      el.className = 'admin-list-item';
      el.innerHTML = `
        <span class="admin-list-item-title">${b.title} (${b.author})</span>
        <span class="admin-list-item-action" data-index="${index}">×</span>
      `;
      el.querySelector('.admin-list-item-action').addEventListener('click', () => {
        const updated = books.filter((_, idx) => idx !== index);
        setLocalData('book_list', updated);
        refreshAdminBooks();
      });
      listAdminBooks.appendChild(el);
    });
  };

  const btnAddBook = document.getElementById('btn-admin-add-book');
  if (btnAddBook) {
    const newBtn = btnAddBook.cloneNode(true);
    btnAddBook.parentNode.replaceChild(newBtn, btnAddBook);

    newBtn.addEventListener('click', () => {
      const titleInput = document.getElementById('txt-admin-book-title');
      const authorInput = document.getElementById('txt-admin-book-author');
      const descInput = document.getElementById('txt-admin-book-desc');
      const previewInput = document.getElementById('txt-admin-book-preview');

      const title = titleInput.value.trim();
      const author = authorInput.value.trim();
      const desc = descInput.value.trim();
      const preview = previewInput.value.trim();

      if (!title || !author || !desc || !preview) {
        return alert('请完整填写书籍信息与试读正文！');
      }

      const books = getLocalData('book_list', []);
      books.push({
        title: `《${title.replace(/[《》]/g, '')}》`,
        author,
        tags: ['经典灵修', '用户推荐'],
        progress: 0,
        month: '用户专属',
        url: '#',
        sample: preview
      });

      setLocalData('book_list', books);

      titleInput.value = '';
      authorInput.value = '';
      descInput.value = '';
      previewInput.value = '';

      refreshAdminBooks();
      alert('书籍推荐成功！');
    });
  }

  // 3. RSS & 博客管理
  const rssInput = document.getElementById('txt-admin-rss-url');
  const btnSaveRss = document.getElementById('btn-admin-save-rss');
  const cachedRss = localStorage.getItem('admin_rss_url') || 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.un.org%2Ffeed%2Fsubscribe%2Fzh%2Fnews%2Fregion%2Fasia-pacific%2Frss.xml';
  if (rssInput) rssInput.value = cachedRss;

  if (btnSaveRss && rssInput) {
    const newBtn = btnSaveRss.cloneNode(true);
    btnSaveRss.parentNode.replaceChild(newBtn, btnSaveRss);

    newBtn.addEventListener('click', () => {
      const val = rssInput.value.trim();
      if (val) {
        localStorage.setItem('admin_rss_url', val);
        alert('RSS 订阅源地址更新成功！');
      }
    });
  }

  const btnAddBlog = document.getElementById('btn-admin-add-blog');
  if (btnAddBlog) {
    const newBtn = btnAddBlog.cloneNode(true);
    btnAddBlog.parentNode.replaceChild(newBtn, btnAddBlog);

    newBtn.addEventListener('click', () => {
      const title = document.getElementById('txt-admin-blog-title').value.trim();
      const cat = document.getElementById('txt-admin-blog-cat').value.trim() || 'grow';
      const source = document.getElementById('txt-admin-blog-source').value.trim() || '管理员';
      const desc = document.getElementById('txt-admin-blog-desc').value.trim();
      const content = document.getElementById('txt-admin-blog-content').value.trim();

      if (!title || !desc || !content) {
        return alert('请完整填写博客文章标题、摘要和正文内容！');
      }

      const blogs = getLocalData('admin_blogs_db', []);
      blogs.unshift({
        id: Date.now().toString(),
        cat,
        author: `@${source}`,
        title,
        desc,
        time: '刚刚',
        content
      });

      setLocalData('admin_blogs_db', blogs);

      document.getElementById('txt-admin-blog-title').value = '';
      document.getElementById('txt-admin-blog-cat').value = '';
      document.getElementById('txt-admin-blog-source').value = '';
      document.getElementById('txt-admin-blog-desc').value = '';
      document.getElementById('txt-admin-blog-content').value = '';

      alert('博客录入成功！切换到热点新闻 ➔ 博客分类 即可直接阅读！');
    });
  }

  // 4. 个人信息设置
  const profileNameInput = document.getElementById('txt-admin-profile-name');
  const fileAvatarUpload = document.getElementById('file-admin-avatar-upload');
  const avatarPreview = document.getElementById('admin-profile-avatar-preview');
  const btnSaveProfile = document.getElementById('btn-admin-save-profile');

  // 初始化个人资料数值
  if (profileNameInput) profileNameInput.value = localStorage.getItem('admin_profile_name') || '同工';
  
  let selectedAvatarUrl = localStorage.getItem('admin_profile_avatar') || 'https://img.icons8.com/color/512/user-male-circle.png';
  if (avatarPreview) {
    avatarPreview.style.backgroundImage = `url('${selectedAvatarUrl}')`;
  }

  // 监听本地头像文件上传，并使用 Canvas 在前端强剪裁压缩为 128x128 像素
  if (fileAvatarUpload) {
    fileAvatarUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // 利用 Canvas 裁剪为固定的 128x128 圆形头像数据
          const canvas = document.createElement('canvas');
          canvas.width = 128;
          canvas.height = 128;
          const ctx = canvas.getContext('2d');

          // 计算等比居中正方形
          const size = Math.min(img.width, img.height);
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;

          ctx.drawImage(img, sx, sy, size, size, 0, 0, 128, 128);

          // 压缩为 JPEG base64 (品质设置为 0.85)
          const compressedData = canvas.toDataURL('image/jpeg', 0.85);

          // 更新状态与界面
          selectedAvatarUrl = compressedData;
          if (avatarPreview) {
            avatarPreview.style.backgroundImage = `url('${compressedData}')`;
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnSaveProfile) {
    const newBtn = btnSaveProfile.cloneNode(true);
    btnSaveProfile.parentNode.replaceChild(newBtn, btnSaveProfile);

    newBtn.addEventListener('click', () => {
      const nameVal = profileNameInput.value.trim();

      if (!nameVal) {
        return alert('展示昵称不能为空！');
      }

      localStorage.setItem('admin_profile_name', nameVal);
      localStorage.setItem('admin_profile_avatar', selectedAvatarUrl);

      updateProfileUI();
      
      if (selectedAvatarUrl.startsWith('data:image/')) {
        try {
          const parts = selectedAvatarUrl.split(',');
          const mime = parts[0].match(/:(.*?);/)[1];
          const bstr = atob(parts[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const fileBlob = new Blob([u8arr], { type: mime });
          const downloadUrl = URL.createObjectURL(fileBlob);
          
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'apple-touch-icon.png';
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(downloadUrl);
          
          alert('🎉 保存成功！\n\n已自动为你裁剪并下载了标准的桌面图标文件 [apple-touch-icon.png]。\n\n请直接将电脑 Downloads 目录下的该图片拖入你的项目根目录中覆盖同名文件，然后再运行一次 ./deploy.sh 即可！');
        } catch (err) {
          alert('个人信息配置更新成功！');
        }
      } else {
        alert('个人信息配置更新成功！');
      }
      location.reload();
    });
  }

  // 💾 数据口令备份导出与恢复导入
  const btnExportData = document.getElementById('btn-admin-export-data');
  const btnImportData = document.getElementById('btn-admin-import-data');
  const txtImportCode = document.getElementById('txt-admin-import-code');

  if (btnExportData) {
    btnExportData.addEventListener('click', () => {
      // 收集 localStorage 里的所有相关配置
      const keysToBackup = [
        'admin_profile_name',
        'admin_profile_avatar',
        'book_list',
        'admin_blogs_db',
        'admin_hymns_db',
        'starred_items',
        'starred_news_db',
        'chk-health-diabetes',
        'chk-health-cholesterol',
        'diet_calories_total',
        'diet_items',
        'wellness_sleep_records',
        'wellness_bp_records',
        'wellness_bg_records',
        'pedometer_daily_steps',
        'treehole_records',
        'treehole_emotions',
        'custom_bible_quotes',
        'custom_speech_phrases'
      ];
      
      const backupObj = {};
      keysToBackup.forEach(key => {
        const val = localStorage.getItem(key);
        if (val !== null) {
          backupObj[key] = val;
        }
      });

      try {
        // 转为 Base64 口令代码
        const jsonStr = JSON.stringify(backupObj);
        // 使用 encodeURIComponent 配合 btoa 处理中文及 Base64 宽字符问题
        const base64Code = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        }));

        // 写入剪贴板
        navigator.clipboard.writeText(base64Code).then(() => {
          alert('🎉 备份成功！已将你所有的打卡和资料数据口令成功复制到剪贴板。请前往桌面 App 的设置页粘贴并恢复。');
        }).catch(err => {
          // 如果剪贴板限制，直接填入恢复文本框让用户手动拷贝
          if (txtImportCode) txtImportCode.value = base64Code;
          alert('数据打包成功！因为手机权限限制未能自动复制，已将口令填入下方的输入框中，请手动复制它！');
        });
      } catch (e) {
        alert('备份数据打包失败，请重试！');
      }
    });
  }

  if (btnImportData && txtImportCode) {
    btnImportData.addEventListener('click', () => {
      const codeVal = txtImportCode.value.trim();
      if (!codeVal) {
        return alert('请先粘贴你的数据备份口令代码！');
      }

      try {
        // 解码 Base64
        const jsonStr = decodeURIComponent(atob(codeVal).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const backupObj = JSON.parse(jsonStr);

        // 遍历还原写入 localStorage
        Object.keys(backupObj).forEach(key => {
          localStorage.setItem(key, backupObj[key]);
        });

        alert('🎉 恭喜！你的所有打卡、计步和历史记录已成功恢复并满血复活！页面即将重新加载以应用配置。');
        window.location.reload();
      } catch (e) {
        alert('❌ 恢复失败！你粘贴的可能不是有效的数据口令，或者口令代码有损坏。请确保完整复制了备份代码。');
      }
    });
  }

  // 一键导出 hymns_db.json
  const btnExportHymns = document.getElementById('btn-admin-export-hymns');
  if (btnExportHymns) {
    const newBtn = btnExportHymns.cloneNode(true);
    btnExportHymns.parentNode.replaceChild(newBtn, btnExportHymns);

    newBtn.addEventListener('click', () => {
      const hymns = getLocalData('admin_hymns_db', []);
      if (hymns.length === 0) {
        return alert('本地暂无圣徒诗歌数据，请先进入“圣徒诗歌”拉取初始数据或手工录入诗歌！');
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(hymns, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href",     dataStr);
      downloadAnchor.setAttribute("download", "hymns_db.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  // 5. 零散资源添加与管理 (添加+管理)
  const listAdminQuotes = document.getElementById('list-admin-quotes');
  const listAdminSpeech = document.getElementById('list-admin-speech');
  const btnAddQuote = document.getElementById('btn-admin-add-quote');
  const btnAddSpeech = document.getElementById('btn-admin-add-speech');

  // 刷新自定义金句列表
  const refreshAdminQuotes = () => {
    if (!listAdminQuotes) return;
    listAdminQuotes.innerHTML = '';
    const customQuotes = getLocalData('custom_bible_quotes', []);
    if (customQuotes.length === 0) {
      listAdminQuotes.innerHTML = '<div style="font-size:11px; color:var(--text-secondary); text-align:center; padding:10px;">暂无自定义灵修金句，可在上方录入。</div>';
      return;
    }
    customQuotes.forEach((q, index) => {
      const item = document.createElement('div');
      item.className = 'list-item';
      item.style.flexDirection = 'row';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.innerHTML = `
        <div style="flex:1; padding-right:10px;">
          <div style="font-size:12px; font-weight:700; color:var(--text-primary); line-height:1.5;">"${q.text}"</div>
          <div style="font-size:10px; color:var(--theme-accent); margin-top:2px;">— ${q.source}</div>
        </div>
        <button class="btn-pill" style="background:#FFEbee; color:#D32F2F; border:none; padding:4px 8px; font-size:10px; cursor:pointer; font-weight:700; border-radius:4px;">删除</button>
      `;
      item.querySelector('button').addEventListener('click', () => {
        if (confirm('确定要删除这句灵修金句吗？')) {
          customQuotes.splice(index, 1);
          setLocalData('custom_bible_quotes', customQuotes);
          refreshAdminQuotes();
          // 同步刷新读经打卡卡片上的今日金句
          const quoteText = document.getElementById('bible-quote-text');
          if (quoteText) {
            let testDate = new Date().getDate();
            let dayQuote = '';
            if (customQuotes.length > 0) {
              const q = customQuotes[(testDate - 1) % customQuotes.length];
              dayQuote = `${q.text} (${q.source})`;
            } else {
              dayQuote = bibleQuotes31[(testDate - 1) % 31];
            }
            quoteText.textContent = `"${dayQuote}"`;
          }
        }
      });
      listAdminQuotes.appendChild(item);
    });
  };

  // 刷新自定义口语句子列表
  const refreshAdminSpeech = () => {
    if (!listAdminSpeech) return;
    listAdminSpeech.innerHTML = '';
    const customSpeech = getLocalData('custom_speech_phrases', []);
    if (customSpeech.length === 0) {
      listAdminSpeech.innerHTML = '<div style="font-size:11px; color:var(--text-secondary); text-align:center; padding:10px;">暂无自定义口语，可在上方录入。</div>';
      return;
    }
    const langNames = { en: '英语', es: '西语', ja: '日语', fr: '法语' };
    customSpeech.forEach((s, index) => {
      const item = document.createElement('div');
      item.className = 'list-item';
      item.style.flexDirection = 'row';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.innerHTML = `
        <div style="flex:1; padding-right:10px;">
          <div style="font-size:12px; font-weight:700; color:#2F80ED;">${s.text}</div>
          <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${s.cn}</div>
          <div style="font-size:9px; color:var(--theme-accent); margin-top:2px; font-weight:700; text-transform:uppercase;">语种: ${langNames[s.lang] || s.lang}</div>
        </div>
        <button class="btn-pill" style="background:#FFEbee; color:#D32F2F; border:none; padding:4px 8px; font-size:10px; cursor:pointer; font-weight:700; border-radius:4px;">删除</button>
      `;
      item.querySelector('button').addEventListener('click', () => {
        if (confirm('确定要删除这句口语练习句吗？')) {
          customSpeech.splice(index, 1);
          setLocalData('custom_speech_phrases', customSpeech);
          refreshAdminSpeech();
          renderSpeechModule();
        }
      });
      listAdminSpeech.appendChild(item);
    });
  };

  // 绑定金句录入保存
  if (btnAddQuote) {
    const newBtn = btnAddQuote.cloneNode(true);
    btnAddQuote.parentNode.replaceChild(newBtn, btnAddQuote);
    newBtn.addEventListener('click', () => {
      const quoteTextVal = document.getElementById('txt-admin-quote-text').value.trim();
      const quoteSourceVal = document.getElementById('txt-admin-quote-source').value.trim() || '佚名';

      if (!quoteTextVal) {
        return alert('金句正文不能为空！');
      }

      const customQuotes = getLocalData('custom_bible_quotes', []);
      customQuotes.push({ text: quoteTextVal, source: quoteSourceVal });
      setLocalData('custom_bible_quotes', customQuotes);

      document.getElementById('txt-admin-quote-text').value = '';
      document.getElementById('txt-admin-quote-source').value = '';

      refreshAdminQuotes();
      alert('🎉 灵修金句保存成功！已存入你的金句资料库。');
      
      // 同步刷新读经打卡卡片上的今日金句
      const quoteText = document.getElementById('bible-quote-text');
      if (quoteText) {
        let testDate = new Date().getDate();
        let dayQuote = '';
        if (customQuotes.length > 0) {
          const q = customQuotes[(testDate - 1) % customQuotes.length];
          dayQuote = `${q.text} (${q.source})`;
        } else {
          dayQuote = bibleQuotes31[(testDate - 1) % 31];
        }
        quoteText.textContent = `"${dayQuote}"`;
      }
    });
  }

  // 绑定口语录入保存
  if (btnAddSpeech) {
    const newBtn = btnAddSpeech.cloneNode(true);
    btnAddSpeech.parentNode.replaceChild(newBtn, btnAddSpeech);
    newBtn.addEventListener('click', () => {
      const langVal = document.getElementById('sel-admin-speech-lang').value;
      const speechTextVal = document.getElementById('txt-admin-speech-text').value.trim();
      const speechCnVal = document.getElementById('txt-admin-speech-cn').value.trim();

      if (!speechTextVal || !speechCnVal) {
        return alert('口语原文和中文翻译不能为空！');
      }

      const customSpeech = getLocalData('custom_speech_phrases', []);
      customSpeech.push({ lang: langVal, text: speechTextVal, cn: speechCnVal });
      setLocalData('custom_speech_phrases', customSpeech);

      document.getElementById('txt-admin-speech-text').value = '';
      document.getElementById('txt-admin-speech-cn').value = '';

      refreshAdminSpeech();
      renderSpeechModule();
      alert('🎉 口语练习句保存成功！已存入对应语言学习库。');
    });
  }

  // 首次运行
  refreshAdminHymns();
  refreshAdminBooks();
  refreshAdminQuotes();
  refreshAdminSpeech();
};


  initHymns();
  initAdmin();
  updateProfileUI();
});