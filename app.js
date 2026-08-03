// �嘥��碶��砍𧑐摮睃�
const getLocalData = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};
const setLocalData = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

const updateProfileUI = () => {
  const cachedName = localStorage.getItem('admin_profile_name') || '��極';
  const cachedAvatar = localStorage.getItem('admin_profile_avatar') || 'https://img.icons8.com/color/512/user-male-circle.png';

  const sidebarName = document.getElementById('lbl-sidebar-name');
  const sidebarAvatar = document.getElementById('lbl-sidebar-avatar');

  if (sidebarName) sidebarName.textContent = cachedName;
  if (sidebarAvatar) {
    sidebarAvatar.style.backgroundImage = `url('${cachedAvatar}')`;
  }
};

// -------------------------------------------------------------
// 1. 頝舐眏銝𦒘蜓憸睃���
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
      
      // ��揢擃䀝漁
      menuItems.forEach(m => m.classList.remove('active'));
      item.classList.add('active');

      // ��揢憿菟𢒰
      pages.forEach(p => p.classList.remove('active'));
      document.getElementById(`page-${target}`).classList.add('active');

      // ��揢�典�銝駁��脣���
      document.body.setAttribute('data-theme', target);
      
      // �湔鰵蝘餃𢆡蝡舫▲�𤩺�憸�
      if (mobileTitle) {
        const text = item.querySelector('span').textContent;
        mobileTitle.textContent = text;
      }

      // 蝘餃𢆡蝡臭��芸𢆡�喲𡡒靘扯器�𤩺𡂝撅�
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      
      // 靽嘥�敶枏�頝舐眏
      localStorage.setItem('activeModule', target);
      // �唳旿�𥪜𢆡�滩蝸
      if (target === 'hymns') initHymns();
      if (target === 'books') initBooks();
      if (target === 'news') initNewsArbitrageBlog();
      if (target === 'admin') initAdmin();
    });
  });

  // 蝘餃𢆡蝡舀��∟��閙綉��
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

  // �Ｗ�銝𦠜活霈輸䔮��芋��
  const activeModule = localStorage.getItem('activeModule') || 'inspiration';
  const targetNav = document.getElementById(`nav-${activeModule}`);
  if (targetNav) targetNav.click();
};

// -------------------------------------------------------------
// 2. 瘥𤩺𠯫�菜�璅∪�
// -------------------------------------------------------------
const initInspiration = () => {
  const defaultList = [
    { id: '1', category: '�𥟇�', content: '�帋�銝芾扇敶閧��毺�App嚗峕����匧末���瘜閖�銝剔恣��', createdAt: '隞𠰴予 10:15', isPinned: false },
    { id: '2', category: '��暑', content: '�冽錰撠肽��帋�甈⊿蠧�伐�餈𦦵氖�𤾸��批鶓', createdAt: '�典予 20:30', isPinned: true },
    { id: '3', category: '撌乩�', content: '隡朞悅�滚��𤏸悅蝔页�霈拙之摰嗆��滚�憭�凒擃䀹�', createdAt: '7��25�� 14:20', isPinned: false }
  ];

  let list = getLocalData('inspirations', defaultList);
  let activeFilter = 'all';

  const render = () => {
    const container = document.getElementById('list-inspiration');
    const countLabel = document.getElementById('cnt-inspiration');
    container.innerHTML = '';

    // 餈�誘銝𡒊蔭憿嗆�摨�
    const filtered = list.filter(item => activeFilter === 'all' || item.category === activeFilter);
    const sorted = [...filtered].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    countLabel.textContent = `${sorted.length} �︶;

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
              ${item.isPinned ? '�� 撌脩蔭憿�' : '蝵桅▲'}
            </button>
            <button class="btn-pill btn-edit" data-id="${item.id}">蝻𤥁�</button>
            <button class="btn-pill btn-delete" data-id="${item.id}">�𣳇膄</button>
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
      category: ['�𥟇�', '��暑', '撌乩�', '摮虫�'][Math.floor(Math.random() * 4)],
      content: text,
      createdAt: '隞𠰴予 ' + new Date().toTimeString().slice(0, 5),
      isPinned: false
    };
    list.unshift(newItem);
    setLocalData('inspirations', list);
    render();
  };

  // 鈭衤辣�穃𨯬
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
    const text = prompt('霂瑁��乩���鰵�菜�嚗�');
    if (text) addInspiration(text);
  });

  // ��掩 Tabs
  document.getElementById('tabs-inspiration').addEventListener('click', (e) => {
    if (e.target.classList.contains('pill-tab')) {
      document.querySelectorAll('#tabs-inspiration .pill-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      activeFilter = e.target.getAttribute('data-filter');
      render();
    }
  });

  // �滢�蝏� (鈭衤辣憪娍�)
  document.getElementById('list-inspiration').addEventListener('click', (e) => {
    const target = e.target;
    const id = target.getAttribute('data-id');
    if (!id) return;

    if (target.classList.contains('btn-pin')) {
      list = list.map(item => item.id === id ? { ...item, isPinned: !item.isPinned } : item);
    } else if (target.classList.contains('btn-edit')) {
      const item = list.find(item => item.id === id);
      const newText = prompt('蝻𤥁�雿删��菜�嚗�', item.content);
      if (newText) {
        list = list.map(item => item.id === id ? { ...item, content: newText } : item);
      }
    } else if (target.classList.contains('btn-delete')) {
      if (confirm('蝖桀�閬���方��∠��笔�嚗�')) {
        list = list.filter(item => item.id !== id);
      }
    }
    setLocalData('inspirations', list);
    render();
  });

  render();
};

// -------------------------------------------------------------
// 3. �梯祗��祗蝏��璅∪�
// -------------------------------------------------------------
const initEnglish = () => {
  const langData = {
    en: {
      quote: "It does not matter how slowly you go as long as you do not stop.",
      quoteCn: "�滩����笔漲銝漤�閬���芾�銝滚�銝𧢲䔉��",
      phrases: [
        { text: 'Nice to meet you.', cn: '敺���渲恕霂����' },
        { text: 'How are you doing?', cn: '雿䭾�餈烐�𦒘��瘀�' },
        { text: 'I love learning languages.', cn: '�穃�甈Ｗ郎銋惩�霂准��' },
        { text: 'Where is the nearest station?', cn: '��餈𤑳�頧衣��典𪑛�䕘�' },
        { text: 'Could you help me, please?', cn: '霂琿䔮�賢葬銝芸��梹�' },
        { text: 'What time is it?', cn: '�啣銁�删�鈭��' }
      ],
      speechLang: 'en-US'
    },
    es: {
      quote: "El 矇xito no es el final, el fracaso no es fatal: es el valor para continuar lo que cuenta.",
      quoteCn: "�𣂼�銝齿糓蝏��嚗�仃韐乩�銝齿糓�急𠯫嚗𡁏�蝏剖�餈𤤿�����齿糓���滩�����",
      phrases: [
        { text: '癒Hola! 聶C籀mo est獺s?', cn: '雿惩末嚗���𦒘��瘀�' },
        { text: 'Buenos d穩as, que tengas un buen d穩a.', cn: '�拐�憟踝�蟡苷��厩�憟賜�銝�憭押��' },
        { text: 'El 矇xito requiere un esfuerzo constante.', cn: '�𣂼���閬��蝏剔��芸���' },
        { text: 'Muchas gracias por tu ayuda hoy.', cn: '�𧼮虜�蠘陝雿牐�憭拍�撣桀𨭌��' },
        { text: '聶D籀nde est獺 el ba簽o, por favor?', cn: '霂琿䔮瘣埈��游銁�芷�嚗�' },
        { text: 'Mucho gusto en conocerte.', cn: '敺���渲恕霂����' }
      ],
      speechLang: 'es-ES'
    },
    ja: {
      quote: "憭Ｕ��滩�������芥�����喋��滩���閮�𤫇�芥�����颯��滩���摰蠘��芥���",
      quoteCn: "�䭾╪������嚗峕�������霈∪�嚗峕�霈∪�����扯���",
      phrases: [
        { text: '�瓐��怒��胯�������扼��页�', cn: '雿惩末嚗䔶�頨思�憟賢�嚗�' },
        { text: '�𨳍�����𢛵�����踺����乓��穃撐�𨳍��𨰜�����', cn: '�拐�憟踝�隞𠰴予銋煺�韏瑕�瘝孵嫃��' },
        { text: '�𣂼��踺��怒���絮����芥��芸����閬���踺��', cn: '�𣂼���閬���剔��芸���' },
        { text: '隞𦠜𠯫�舀�隡腈��艾��䎚��砍��怒��𨳍��具���', cn: '隞𠰴予靚Ｚ陝雿删�撣桀���' },
        { text: '擏���押��剹��踺�嚗�', cn: '頧衣��臬銁�芯葵�孵�嚗�' },
        { text: '�𠹺�����溻�戭剹�����踺��', cn: '敺���渲��唬���' }
      ],
      speechLang: 'ja-JP'
    },
    fr: {
      quote: "Petit � petit, l'oiseau fait son nid.",
      quoteCn: "銝滨妖頝祆郊嚗峕�隞亥秐�������渲�嚗帋��嫣��對�撠誯�蝑烐�撌Ｙ庖���",
      phrases: [
        { text: 'Bonjour ! Comment allez-vous ?', cn: '雿惩末嚗����餈烐�𦒘��瘀�' },
        { text: 'Bonne journ矇e, profitez bien de votre journ矇e.', cn: '�拐�憟踝�蟡苷��厩�憟賜�銝�憭押��' },
        { text: 'Le succ癡s exige des efforts constants.', cn: '�𣂼���閬���剔��芸���' },
        { text: 'Merci beaucoup pour votre aide aujourd\'hui.', cn: '�𧼮虜�蠘陝雿牐�憭拍�撣桀𨭌��' },
        { text: 'O羅 se trouve la gare la plus proche ?', cn: '��餈𤑳��怨膠蝡坔銁�芷�嚗�' },
        { text: 'Enchant矇 de vous rencontrer.', cn: '敺���渲恕霂����' }
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
    
    // �湔鰵瘥𤩺𠯫�穃蘂
    const quoteText = document.getElementById('lbl-daily-quote-text');
    const quoteTrans = document.getElementById('lbl-daily-quote-translation');
    if (quoteText && quoteTrans) {
      quoteText.textContent = data.quote;
      quoteTrans.textContent = data.quoteCn;
    }

    // �齿鰵皜脫���祗�∠��𡑒”
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
          <span style="font-size:18px;" class="speak-btn">��</span>
        `;
        
        // TTS �剜𦆮
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

  // 蝏穃��穃蘂�𡑒粉�煾𨺗
  const readBtn = document.getElementById('btn-english-read');
  if (readBtn) {
    readBtn.addEventListener('click', (e) => {
      const data = langData[currentLang];
      const speech = new SpeechSynthesisUtterance(data.quote);
      speech.lang = data.speechLang;
      window.speechSynthesis.speak(speech);
      
      const origText = e.target.textContent;
      e.target.textContent = '�� 甇�銁�煾𨺗銝�...';
      setTimeout(() => {
        e.target.textContent = origText;
      }, 1500);
    });
  }

  // 蝏穃� Tabs �孵稬��揢
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

  // �脲活皜脫�
  renderSpeechModule();
};

// -------------------------------------------------------------
// 4. 瘥𤩺𠯫�讛�擖桅�璅∪�
// -------------------------------------------------------------
const initDiet = () => {
  const defaultBreakfast = ['�閖漲�𥕦扒 + �肽�', '瘞渡��� � 1'];
  const defaultLunch = ['曏∟��㗇���', '��皎擖� �羓�'];
  const defaultDinner = ['皜�𡢄敼� + 镼踹���', '蝝怨鱻 � 1'];
  
  let meals = getLocalData('diet_meals', {
    breakfast: defaultBreakfast,
    lunch: defaultLunch,
    dinner: defaultDinner
  });

  const recipes = [
    { title: '曏∟��㕑𥈡�𨀣���', desc: '曏∟���150g + �蠘� + ��戊�� + 璈��瘝寞�瑼祆�', cal: 280 },
    { title: '�閖漲�賡�蝣�', desc: '�閖漲 + �肽� + �譍� + 撣諹��詨扒', cal: 320 },
    { title: '�芾�鞊��瘙�', desc: '�芾� + 憳抵��� + 曏∟� + 擐躰𤍤嚗䔶�����讠蒾', cal: 180 }
  ];

  const updateCalories = () => {
    let total = 0;
    ['breakfast', 'lunch', 'dinner'].forEach(meal => {
      meals[meal].forEach(item => {
        // 雿輻鍂甇���𣂼��砍噡銝剔��∟楝��
        const match = item.match(/(?:(\d+)��㨃|(\d+)憭批㨃)/);
        if (match) {
          total += parseInt(match[1] || match[2]);
        } else {
          total += 150; // 暺䁅恕瘥誯★蝞� 150 ��㨃
        }
      });
    });

    total = Math.min(total, 1500);
    const caloriesVal = document.getElementById('diet-calories-val');
    if (caloriesVal) caloriesVal.textContent = total;
    
    // �湔鰵 SVG ��㴓餈𥕦漲
    const circle = document.getElementById('diet-circle');
    if (circle) {
      const circumference = 251.2;
      const offset = circumference - (total / 1500) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    // �湔鰵摰誯��亙������𧋦
    const prot = Math.round(total * 0.05);
    const carb = Math.round(total * 0.09);
    const fat = Math.round(total * 0.03);
    const macroText = document.getElementById('diet-macronutrients');
    if (macroText) {
      macroText.innerHTML = `
        �拐�: ${1500 - total} ��㨃<br>
        �讠蒾韐�: ${prot}g 繚 蝣單偌: ${carb}g 繚 ���: ${fat}g
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
          <span>�� ${item}</span>
          <span style="color:var(--text-secondary); cursor:pointer;" class="del-diet-btn" data-meal="${meal}" data-item="${item}">�</span>
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

  // 瘛餃��厰僼鈭衤辣
  document.querySelectorAll('.btn-add-diet').forEach(btn => {
    btn.addEventListener('click', () => {
      const meal = btn.getAttribute('data-meal');
      const item = prompt('颲枏�雿惩����镼選�');
      if (item) addMealItem(meal, item);
    });
  });

  const fabDiet = document.getElementById('fab-diet-add');
  if (fabDiet) {
    fabDiet.addEventListener('click', () => {
      const meal = prompt('霂琿�㗇𥋘擗𣂼� (�拚�/���/�𡁻�)嚗�');
      let key = '';
      if (meal === '�拚�') key = 'breakfast';
      else if (meal === '���') key = 'lunch';
      else if (meal === '�𡁻�') key = 'dinner';
      else return alert('霂瑁��交迤蝖桃�擗𣂼�');

      const item = prompt('颲枏�憌毺��滨妍嚗�');
      if (item) addMealItem(key, item);
    });
  }

  // �𣳇膄擖桅�憿�
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

  // 皜脫��刻�憌蠘停
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
        <div style="margin-top:6px;"><span class="list-item-tag">�𤣳 ${r.cal} ��㨃</span></div>
      `;
      el.addEventListener('click', () => {
        const meal = prompt('�惩��芯�擗琜�(�拚�/���/�𡁻�)嚗�');
        let key = '';
        if (meal === '�拚�') key = 'breakfast';
        else if (meal === '���') key = 'lunch';
        else if (meal === '�𡁻�') key = 'dinner';
        if (key) addMealItem(key, `${r.title} (${r.cal}��㨃)`);
      });
      recipesContainer.appendChild(el);
    });
  }

  // -------------------------------------------------------------
  // Cal AI 憌毺��剝�銝𡒊�����抵�隡圈�餉�
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

  // 憌毺�擃䀝���𧋦�啗��坔�
  const foodDatabase = {
    hamburger: {
      name: "����嘥ㄚ瘙匧嵗",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
      cal: 620,
      carb: 48,
      prot: 28,
      fat: 32,
      warningText: "�� 瘙匧嵗��鉄�厰�蝎曉��Ｙ�嚗䔶��嘥ㄚ銝𤾸�撅���厰未撖�鉄擖勗�����諹��粹���"
    },
    fish: {
      name: "皜�𡢄曈閖掉�滨�蝐喲平",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=300&q=80",
      cal: 310,
      carb: 35,
      prot: 25,
      fat: 5,
      warningText: "�� 曈閖掉撅硺���蛹�亙熒���韐其�����踝�蝟嗵掖擖剖��臬��讠�擃条漱蝏港� GI �Ｙ４瘞湛��刻�憌毺鍂嚗�"
    },
    sweetpotato: {
      name: "�𥪯��啁�",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=300&q=80",
      cal: 450,
      carb: 92,
      prot: 2,
      fat: 8,
      warningText: "�� �𥪯��啁�鋆寧�憭折�蝎曉��賜�瘚��銝𥪜𧑐�𨀣�蝎㗇𧋦頨怎��硋漲���嚗��鈭舘�擃睃�蝟𡝗��堆�GI嚗厰��押��"
    }
  };

  // 銝厰����蝑𥟇䰻霅血������
  const runHealthCheck = (food) => {
    const warningBox = document.getElementById('cal-ai-warning-box');
    if (!warningBox || !food) return;
    warningBox.innerHTML = '';

    let hasWarning = false;

    // 1. 蝟硋倏�� / 擃䁅�蝟𤥁郎��
    if (hasDiabetes) {
      const isHighGI = food.name.includes('�啁�') || food.name.includes('蝟�') || 
                       food.name.includes('蝐喲平') || food.name.includes('�臭�') || 
                       food.name.includes('�Ｗ�') || food.name.includes('�Ｘ辺') || 
                       food.name.includes('�讠�') || food.name.includes('瘙匧嵗') ||
                       food.carb > 45;
      
      if (isHighGI) {
        hasWarning = true;
        const card = document.createElement('div');
        card.className = 'warning-card warning-blink-red';
        card.innerHTML = `
          <div style="font-weight: 700; display:flex; align-items:center; gap:6px;">�𩤃� 銵�蝟𣇉滯�脤�霅� (擃睃�蝟𤥁�憌�)</div>
          <div style="font-size: 11px; margin-top: 6px; color: var(--text-primary); line-height: 1.5;">
            霂仿��拙銁蝟硋倏��/擃䁅�蝟𣇉𠶖���嚗�捆�枏紡�渲�蝟𤥁��������
            ${food.warningText ? '<br>���: ' + food.warningText : ''}
            <br><strong>�働 撟單𤜯�刻�:</strong> 撱箄悅�Ｘ��鮋漲�Ｕ���暻衣�暻行�蝟嗵掖擖哨�撟嗡���𨰹�滩�憌毺漱蝏游辣蝻梶���𢙺�嗚��
          </div>
        `;
        warningBox.appendChild(card);
      }
    }

    // 2. 擃䁅��粹� / 擃䁅���郎��
    if (hasCholesterol) {
      const isHighFat = food.name.includes('瘙匧嵗') || food.name.includes('蝥Ｙ���') || 
                        food.name.includes('�亦�') || food.name.includes('�亥�') || 
                        food.name.includes('��') || food.name.includes('瘝�') ||
                        food.fat > 20;

      if (isHighFat) {
        hasWarning = true;
        const card = document.createElement('div');
        card.className = 'warning-card warning-blink-yellow';
        card.innerHTML = `
          <div style="font-weight: 700; display:flex; align-items:center; gap:6px;">�𩤃� ��𤐄����脤�霅� (擃㗛弗�諹���)</div>
          <div style="font-size: 11px; margin-top: 6px; color: var(--text-primary); line-height: 1.5;">
            霂仿��拇��恍弗�諹��芯���𤐄���擃矋��枏��滩�蝞∟����銝滚⏚鈭舘��粹��批���
            ${food.warningText && !hasDiabetes ? '<br>���: ' + food.warningText : ''}
            <br><strong>�働 撟單𤜯�刻�:</strong> 撱箄悅撠�滯��/瘝寧�憌笔��Ｘ��餌铜曏∟��剹��偌�株蓡�𡝗��賊�敼潛�隡䁅捶瘚琿��讠蒾��
          </div>
        `;
        warningBox.appendChild(card);
      }
    }

    // 3. ���摰匧��刻�嚗���暸�劐��餃�嚗䔶�憌毺�����亙熒�塚�
    if ((hasDiabetes || hasCholesterol) && !hasWarning) {
      const card = document.createElement('div');
      card.className = 'warning-card warning-blink-green';
      card.innerHTML = `
        <div style="font-weight: 700; display:flex; align-items:center; gap:6px;">�� 銝厰�蝏輻��刻��喲�</div>
        <div style="font-size: 11px; margin-top: 6px; color: var(--text-primary); line-height: 1.5;">
          ${food.name} 撅硺�雿𤾸�蝟硔����������讠蒾���摨瑁�憌麄��泵���撠輻�銝𡡞���𤐄���憌毺恣������撱箄悅�曉�憌毺鍂��
        </div>
      `;
      warningBox.appendChild(card);
    }
  };

  // 蝞��𤘪��祇��� AI 霂��
  const parseFoodText = (text) => {
    const query = text.trim().toLowerCase();
    if (!query) return null;

    let name = text;
    let cal = 260;
    let carb = 30;
    let prot = 15;
    let fat = 10;
    let warningText = "�砍𧑐 AI 隡啁��唳旿";

    if (query.includes('瘙匧嵗') || query.includes('hamburger')) {
      return foodDatabase.hamburger;
    } else if (query.includes('敼�') || query.includes('曈閖掉') || query.includes('cod')) {
      return foodDatabase.fish;
    } else if (query.includes('�啁�') || query.includes('蝥Ｚ鱻') || query.includes('�𥪯�')) {
      return foodDatabase.sweetpotato;
    } else if (query.includes('蝥Ｙ���') || query.includes('�芾�') || query.includes('�亥�')) {
      name = "蝏誩�蝥Ｙ���";
      cal = 580;
      carb = 15;
      prot = 18;
      fat = 52;
      warningText = "�巧 蝥Ｙ��匧��恍弗�諹��芸���𤐄���銝磰��喃葉�急�憭折�擃睃�蝟𣇉��啁���";
    } else if (query.includes('�臭�') || query.includes('瘙賣偌') || query.includes('擖格�')) {
      name = "�臭� (銝���)";
      cal = 140;
      carb = 35;
      prot = 0;
      fat = 0;
      warningText = "�奶 擖格�銝剖��怎移�嗆�蝟碶�皜貊氖蝟吔�隡朞����擃䁅�蝟𡝗偌撟喉�蝟硋倏������敹䎚��";
    } else if (query.includes('�閖漲') || query.includes('暻衣�') || query.includes('蝎㛖皎')) {
      name = "�券漲�閖漲��";
      cal = 220;
      carb = 38;
      prot = 8;
      fat = 3;
      warningText = "�駠 �閖漲�急�銝啣��� 帣-�∟�蝟𡝗偌皞嗆�扯�憌毺漱蝏湛��臬之憭批辣蝻梶４瘞游𢙺�塚�雿� GI ����刻���";
    }

    return { name, cal, carb, prot, fat, warningText };
  };

  // 蝏煺�撅閧緵 AI 霂��蝏𤘪���醌�𤩺�
  const showScanResult = (foodObj) => {
    const uploadPlaceholder = document.getElementById('cal-ai-upload-placeholder');
    const scanActive = document.getElementById('cal-ai-scan-active');
    const foodImg = document.getElementById('img-cal-ai-food');
    const resultPanel = document.getElementById('cal-ai-result-panel');

    if (!uploadPlaceholder || !scanActive || !resultPanel) return;

    // �曄內�急��寞�
    uploadPlaceholder.style.display = 'none';
    scanActive.style.display = 'flex';
    resultPanel.style.display = 'none';

    // 蝏穃�憭批㦛
    if (foodImg && foodObj.image) {
      foodImg.style.backgroundImage = `url('${foodObj.image}')`;
    } else if (foodImg) {
      foodImg.style.backgroundImage = 'linear-gradient(135deg, #FF9F43 0%, #FF5252 100%)';
    }

    // 1.5 蝘鍦�撅閧內 AI ����唳旿
    setTimeout(() => {
      scanActive.style.display = 'none';
      uploadPlaceholder.style.display = 'block';
      resultPanel.style.display = 'block';

      currentFoodResult = foodObj;

      // 憛怠��箇��亙��唳旿
      const resName = document.getElementById('lbl-result-food-name');
      const resFacts = document.getElementById('lbl-result-nutrition-facts');
      if (resName) resName.textContent = `霂��蝏𤘪�: ${foodObj.name}`;
      if (resFacts) {
        resFacts.innerHTML = `
          隡啁��剝�: <strong>${foodObj.cal}</strong> ��㨃 <br>
          蝣單偌: ${foodObj.carb}g | �讠蒾韐�: ${foodObj.prot}g | ���: ${foodObj.fat}g
        `;
      }

      // �扯�銝厰����憸�郎
      runHealthCheck(foodObj);
    }, 1500);
  };

  // 蝏穃��豢㦤/�詨�銝𠹺�
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
            name: "撌脖�隡𣳇���",
            image: event.target.result,
            cal: 480,
            carb: 52,
            prot: 20,
            fat: 18,
            warningText: "�芯�憌毺�隡啁���"
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 蝏穃���𧋦���
  const textBtn = document.getElementById('btn-cal-ai-text-identify');
  const textInput = document.getElementById('txt-cal-ai-food-input');
  if (textBtn && textInput) {
    textBtn.addEventListener('click', () => {
      const parsed = parseFoodText(textInput.value);
      if (parsed) {
        showScanResult(parsed);
      } else {
        alert('霂瑁��亙�雿梶�憌毺��滨妍嚗�𣈲����～���敼潦��𧑐�栶��虾銋僐��滯�扯����暻衣��寥�瞍𠉛內嚗�');
      }
    });
  }

  // 蝏穃�敹急㭘瞍𠉛內�厰僼
  document.querySelectorAll('.btn-preset-food').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-food');
      const food = foodDatabase[key];
      if (food) {
        showScanResult(food);
      }
    });
  });

  // 蝏穃�銝��株恣�亙㨃頝舫�憭抒�
  const logMealBtn = document.getElementById('btn-cal-ai-log-meal');
  if (logMealBtn) {
    logMealBtn.addEventListener('click', () => {
      if (currentFoodResult) {
        const meal = prompt('霈∪��芯�擗琜�(�拚�/���/�𡁻�)嚗�');
        let key = '';
        if (meal === '�拚�') key = 'breakfast';
        else if (meal === '���') key = 'lunch';
        else if (meal === '�𡁻�') key = 'dinner';
        
        if (key) {
          addMealItem(key, `${currentFoodResult.name} (${currentFoodResult.cal}��㨃)`);
          alert(`撌脫��笔� [${currentFoodResult.name}] �� ${currentFoodResult.cal} ��㨃霈啣�${meal}嚗�);
          
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
  // 餈𣂼𢆡�亙��枏㨃�嗆��
  let checkedDays = getLocalData('workout_checks', [1, 3, 5, 7, 10, 12, 15, 18, 22, 25, 27]);

  const renderCalendar = () => {
    const grid = document.getElementById('grid-workout-calendar');
    if (!grid) return;
    grid.innerHTML = '';
    
    // 皜脫��冽�憸�
    const daysName = ['��', '銝�', '鈭�', '銝�', '��', '鈭�', '��'];
    daysName.forEach(name => {
      const el = document.createElement('div');
      el.className = 'calendar-header-day';
      el.textContent = name;
      grid.appendChild(el);
    });

    // 2026撟�7���1�瑟糓�其���‵����Ｙ�蝛箇蒾
    for (let i = 0; i < 3; i++) {
      grid.appendChild(document.createElement('div'));
    }

    // 憛怠�7��遢憭拇㺭 1-31
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
    if (lblDays) lblDays.textContent = `撌脫��� ${checkedDays.length} 憭奈;
  };

  // 餈𣂼𢆡霈⊥𧒄��
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
        // ���
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.textContent = '撘�憪钅𤫇��';
        if (timerStatus) timerStatus.textContent = '撌脫���';
      } else {
        // 撘�憪�
        if (timerStatus) timerStatus.textContent = '�𡁏�撠望糓�𨅯⏚';
        startBtn.textContent = '����餌�';
        timerInterval = setInterval(() => {
          if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerCircle();
          } else {
            clearInterval(timerInterval);
            timerInterval = null;
            startBtn.textContent = '摰峕�嚗�';
            alert('�剖�雿惩��𣂷� 30 �����𤫇�潘�撌脰䌊�典銁�亙��枏㨃��');
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
      if (startBtn) startBtn.textContent = '撘�憪钅𤫇��';
      if (timerStatus) timerStatus.textContent = '�坿恣��';
      updateTimerCircle();
    });
  }

  // --- 霈⊥郊�券�餉� ---
  let stepCount = getLocalData('workout_step_count', 0);
  let isPedometerActive = false;
  let lastStepTime = 0;
  const stepThreshold = 11.6; // ����笔漲�文����� (9.8 �舫��偦����潘�頧餅�頞��11.6�文�韏唬�銝�甇�)

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

    // 霈∠�����笔漲
    const totalAcc = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
    const currentTime = Date.now();

    if (totalAcc > stepThreshold && (currentTime - lastStepTime) > 350) {
      lastStepTime = currentTime;
      updateSteps(stepCount + 1);
      
      // 蝏輻�敺桀𢆡��緾��
      if (pedometerStatus) {
        pedometerStatus.style.transform = 'scale(1.2)';
        setTimeout(() => pedometerStatus.style.transform = 'scale(1.0)', 120);
      }
    }
  };

  const startTracking = () => {
    isPedometerActive = true;
    window.addEventListener('devicemotion', handleDeviceMotion);
    if (pedometerToggleBtn) pedometerToggleBtn.textContent = '�� ���霈⊥郊';
    if (pedometerStatus) {
      pedometerStatus.textContent = '霈⊥郊銝�...';
      pedometerStatus.style.background = '#E3F9E5';
      pedometerStatus.style.color = '#1F8722';
    }
  };

  const stopTracking = () => {
    isPedometerActive = false;
    window.removeEventListener('devicemotion', handleDeviceMotion);
    if (pedometerToggleBtn) pedometerToggleBtn.textContent = '�𠎠 撘��航恣甇�';
    if (pedometerStatus) {
      pedometerStatus.textContent = '撌脫���';
      pedometerStatus.style.background = '#e0e0e0';
      pedometerStatus.style.color = '#666';
    }
  };

  if (pedometerToggleBtn) {
    pedometerToggleBtn.addEventListener('click', async () => {
      if (isPedometerActive) {
        stopTracking();
      } else {
        // 憭�� iOS 瘚讛��券��箔貌餈𣂼𢆡���
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
          try {
            const permission = await DeviceMotionEvent.requestPermission();
            if (permission === 'granted') {
              startTracking();
            } else {
              alert('�芾繮敺𡑒��其��笔膥���嚗�虾隞乩蝙�典𢰧靘扳芋����柴��');
            }
          } catch (e) {
            console.warn('���箔貌霂瑟����鋡急�嚗�', e);
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

  // 閫���𡑒”銝舘�皛�
  const videos = [
    { title: '15min�㰘�頝單�瘞抒����', info: '15��� 繚 �见��屸���', cat: 'aerobic' },
    { title: '20���憟喳𣪧�偦������', info: '20��� 繚 8擐𤥁�頝�', cat: 'strength' },
    { title: '10����刻澈�劐撓�暹𠹭', info: '10��� 繚 �垍��賢臁��', cat: 'stretch' }
  ];

  const renderVideos = (category = 'aerobic') => {
    const list = document.getElementById('list-workout-videos');
    if (!list) return;
    list.innerHTML = '';
    videos.filter(v => v.cat === category).forEach(v => {
      const el = document.createElement('div');
      el.style.cssText = 'background:#f9f9f9; border-radius:var(--radius-md); padding:20px 12px; text-align:center; cursor:pointer;';
      el.innerHTML = `
        <span style="font-size:24px;">��</span>
        <div style="font-size:12px; font-weight:700; margin-top:6px;">${v.title}</div>
        <div style="font-size:10px; color:var(--text-secondary);">${v.info}</div>
      `;
      el.addEventListener('click', () => {
        alert(`甇�銁�剜𦆮: ${v.title}`);
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
  // 蝳餌瑪憭�鍂擃䀝���鰵�餅㺭��
  const newsList = [
    { id: '1', cat: '蝘烐�', source: '36瘞�', title: 'AI 蝻𣇉��拇��滚�蝥改��舐𡠺蝡见��� 80% 隞��', desc: '���唬�隞� AI 蝻𣇉�撌亙��瑕��游撩��䌊銝餃�蝑𤥁��𨥈�霈拙��𤏸�����之撟������', time: '2撠𤩺𧒄��', content: '��36瘞芣��唳��胯�穃銁���唬�頧桃��函�撘��𤏸������隡唬葉嚗��甈曆蜓瘚� AI 蝻𣇉��拇�摰��摰峕�鈭��閬��批�蝥扼��n\n�啁��拇�銝滚�撅��𣂷��箄�銵亙��硋�銵𣬚��辷��峕糓�賢���迤��圾憭批�憿寧𤌍���撅�誨���韏硔���朞��亙��砍𧑐 AST 霂剜�����睲�瘚贝��扯�撘閙�嚗淾I �拇��冽𦻖�嗅�蝞��剔�鈭箇掩��誘�𠬍��臭誑�芯蜓����寞�霈曇恣����坔笆摨娍�隞嗚��䌊�函�霂穃僎�扯��訫�瘚贝�餈𥡝� Debug �剔㴓��㺭�株”�𠬍��嗅銁�祉�摰峕�撣貉�銝𡁜𦛚��瘙�䲮�Ｙ�瘥娪�撌脰���秐 80% 隞乩�嚗峕�憭批𧑐閫�𦆮鈭�極蝔衤犖�条��亙虜�滚��批𠓼�具��' },
    { id: '2', cat: '韐Ｙ�', source: '�𤾸�銵𡑒���', title: '�函��∪���㨃嚗��瘜其��𠰴僑韏�漣�滨蔭�箔�', desc: '蝢舘��典��舫���𦆮蝻橒�憭𡁜𤙴�∪��箇緵�滚撕餈寡情嚗峕�韏����靽脲����扼��', time: '4撠𤩺𧒄��', content: '�𣂼�撠磰�閫�鉟�寧阮�煾���蝢舘��典�撣�����啁��娪��粹��拍��唾悅嚗���箏笆�𣈯��拍�蝏湔��港��萘�憸���曇��齿萱嚗䔶�雿踹𤙴�箸𤣰�羓�敹恍�蠘歲瘞湛��函���之�∪�餈擧䔉鈭��餈萘��滚撕��㨃��n\n�嗉�䕘�韏�楛�𤏸����撣�郎�𠺪��曹��函��朞�蝎䀹�找��嗅��綽��牐�銝餉�蝏𤩺�雿㮖�摨娪曎�滚��鞉𧋦擃䀝�嚗䔶��𠰴僑�∪�蝏𤘪��批��硋虾�賜誧蝏剖��扼��笆鈭擧芦�帋葵鈭箸�韏����諹�嚗𣬚揮頝笔�閫�錇蝑𣇉������擃条滯�抵�鈭改�憒���其�銝𠾼���蝑寥�憭湛��𢠃��煾��拇踎�堒����蝵殷��舀綉�嗅��斤�擐𤥁�瘜訫���' },
    { id: '3', cat: '��暑', source: '��暑�交𥁒', title: '�亙熒��暑�孵�靚�䰻嚗�90�擧凒瘜券��餌�', desc: '���啗��交遬蝷綽�撟渲蝠鈭箏笆�亙熒擖桅����敺衤��胯����典�頨怎��單釣摨行�蝏凋�����', time: '隞𠰴予 09:00', content: '�鞟�瘣餅𠯫�亦冗隡朞��乓�𤑳緵�函��𨅯��麨�肽�霂剜�嚗�歇蝏誯�鞉郊隞舘��僑蝢支�頧祉宏�唬� 90 �𦒘��� 00 �𡒊�撟渲蝠銝�隞�澈銝𨳍��n\n�寞旿撖嫣�銝���鍦僑鈭箇�瘣颱��臭��舐�頝蠘葵蝏蠘恣嚗諹�餈���鞟��鍦僑鈭箸𥅾�劐�皜拇𡟵���銵亦��𨰜��葉�航薗擖桃�靽嘥��讛�����銁�Ｖ葩撌乩��園鵭�见�����箏��瑞��烐�銝页�霂詨��𦦵辺�齿部�尠�腈���𨅯��舀偌�枏㨃�苷誑�𪙛�𡏭蝠摨血��𤩺�隡詹�萘�敺桐��荔�甇��銝箔�隞祆�蝑穃�����冽��脩瑪���閬�𣈲�梧�撟渲蝠鈭箇��亙熒�西�甇��摰噼蓮�䀝蛹�亙虜���摨瑁䌊敺贝�銝箝��' },
    { id: '4', cat: '憡曹�', source: '憡曹��典�', title: '�烐�獢�巨�輻聦�曆瑪嚗�𤙴瞍怠�韏瑕�鈭箸釣��', desc: '隞𠰴僑�烐�獢�𤙴鈭批𢆡�餌㩞敶梯”�唬漁�潘�憭𡁻�雿𨅯����蟡冽��䔶萼�嗚��', time: '�典予 18:30', content: '�𣂼迂銋𣂼𪂹�羓𡠺摰嗥��嫘�睲�撟湔���﹝�萄蔣撣�㦤�澆��怎���⏛�單𧋦�冽錰嚗峕�餌巨�踵㺭�桀歇���頝刻��曆瑪�冽���n\n餈坔�銝哨�隞乩葉�賢𧂈�貊�霂苷蛹�脲𧋦餈𥡝��唬誨�嗘��齿�����典𤙴鈭批𢆡�餃之����賣憤嚗㚁��硋�鈭�����芣���巨�輻��栶��蔣���隞�鐯�罸�頞�� 3D 皜脫��駁𢒰��𠗠�典㦤嚗峕凒�刻��脫��踹憫�剹��犖�抒�憭齿�憭帋��找�瘛勗漲�梶ㄗ嚗諹窖敺𦯀�憭扳鸌�𧼮�摰嗆洽�扯捶���鈭箔蜓�𥟇�韐嫣犖蝢歹��齿活�睲漣銝朞��𦒘��賣憤撣�㦤��楛����賢����銝𡁏��䜘��' }
  ];

  // 韏𡁻兝靽⊥�撌格㺭�� (撌脖�靘扳��喲𡡒嚗����)
  const arbitrageList = [
    { id: '1', cat: '�臭�', source: '蝏誯�靚�', title: '撠讐滯銋血�銝鳴��桅�帋犖���餈�����摰噼楝敺�', desc: '��圾蝝牐犖�帋蜓隞� 0 �� 1 ����交�蝔页���𡠺摰帋����摰嫘����啣��株��嫘��', time: '3撠𤩺𧒄��' },
    { id: '2', cat: '�潸�', source: '�潸�蝵�', title: '蝥蹂�摰嗆�撟喳蝱�刻�嚗峕𧒄�� 100-300 ��', desc: '�渡�鈭� 5 銝芸藁蝣𤏸�憟賜��函瑪�躰�撟喳蝱嚗屸���憭批郎�笔���㦤鈭箝��', time: '隞𠰴予 11:00' },
    { id: '3', cat: '�閗�', source: '�娍𥁒', title: '�航蓮�箸��啣��剁�雿𡡞��拙��拍���', desc: '霂衣�隞讠��航蓮�箸��唳�蝔卝��釣�譍�憿對�隞亙�憒���鞾�銝剔倌����', time: '�典予 21:00' },
    { id: '4', cat: '�𥕢�', source: '���', title: '蝷曉躹�Ｚ揚���銝�銝芣㦤隡𡁜銁�芷�嚗�', desc: '���蝷曉躹�Ｚ揚撣�㦤�啁𠶖嚗峕��䀹��函�銝𧢲�撣�㦤�箔���', time: '7��26�� 16:00' }
  ];

  // �𡁜恥蝎暸�㗇㺭��
  const defaultBlogs = [
    { id: '1', cat: 'life', author: '@�堒�皞�', title: '銝�銝芯犖雿讐洵銝匧僑嚗峕�摮虫�鈭��鈭𥕢�', desc: '隞𦒘�撘�憪讠�摮斤𡠺����啁緵�函��芸銁���鈭怎𡠺撅��瘣餌�摰䂿鍂��撌扼��', time: '隞𠰴予 14:00', content: '�冽𨯬餈𥡝�銝芸�頨怠�撖梶�蝚砌�銝芸僑憭湧�嚗峕��鞉�隞擧�撘�憪讠��贝雲�䭾綳���憭𨅯迨�祆�嚗諹�皜∪�鈭��蝘齿�摨西䌊瘣賜���暑�嗆����n\n�砍�霈拇�摮虫����隞嗅之鈭页�\n1. 摮虫�鈭��銝��见末�頣�銝箄䌊撌勗�擖剜糓銝��箸�雿喟�蝎曄�瘝餅�餈��嚗屸��鞟�擐蹱��臭誑憛急說蝛粹𡢿��n2. 撱箇�鈭��鈭舘䌊撌梁�瘥𤩺𠯫�箏�瘚��嚗㇄aily Routine嚗㚁�瘥𥪜��刻絲��洵銝��舀偌����渡��劐撓嚗��隞祈悟雿删���暑�冽�鈭箇漲��𧒄靘萘�鈭蓥��㗇辺��n3. 摮虫�鈭��摮斤𡠺�⊥�閮��䕘�敶㮖���迤鈭怠��芸楛�砍���𧒄�㗇𧒄嚗䔶�隡𡁜��唬��𣬚��嗅�敺埈聢憭硋��坔�撟脣���' },
    { id: '2', cat: 'work', author: '@��㦤�燐ay', title: '隞� P6 �� P8嚗峕���燵�䔶�撟�', desc: '���臭犖憒��閫���䔶�頝臬�嚗䔶���瓲敹��鈭匧���', time: '�典予 20:00', content: '�墧��券燵��漲餈��餈嗘�撟湛���糓銝��箄��擧揢撉函�������敶枏僑�𡁜��亥�����睃��Ｙ� P6 �箔��㚁��啣�隞羓𡠺敶㮖��Ｚ�韐�瓲敹���⊥沲��� P8 �嗆�撣���嗡葉����訾��嗉繮�曆誑閮�銵具��n\n餈䠷�蝏坔嘀憭扳��舐��𤑳��删�霂𡁏�撱箄悅嚗䨵n1. �怠蘨�见仍�嗘誨���隞���芣糓撌亙�嚗諹��嗅��祈絲憭渡�皜��韐蠘提����∠��𨅯�銝帋遠�潑�嘥銁�芷���n2. 蝏𤘪��𡝗�萘輕銝𤾸�銝羓恣����睲�蝞∠���𧋦韐冽糓憸��撖寥�銝𦒘蜓�典�敹改�瘙�𥁒�嗅�霈脩�霈綽��漤�餈啗��柴��n3. 靽脲��芷店�改��交��睃��臬虜������航翮隞�翰憒�蔭瘞湛��舀��嗅�靽脲�撘箇���末憟����笆摨訫���凃�𠉛�����滢�隡𡁜銁 35 撗�𧒄�剝�鋡怠𢆡��' },
    { id: '3', cat: 'emo', author: '@����烐�', title: '30撗���擧��𡒊蒾�� 5 銝芷���', desc: '�喃��望����憪颯�������Ｘ��交�颲�翰��', time: '7��26��', content: '銝匧�撗�糓銝��枏�瘞游痍���撟嗡��航秩雿删�頨思�隡𡁶��游�撌殷��峕糓雿删�敹�惣隡𡁜銁餈蹱挾�園𡢿餈擧䔉銝�甈⊿�����n\n隞乩��舀��其����銋见�嚗�銁蝏誩�餈�郭�䀝��諹圾�𡡞��笔�������\n1. �Ｘ��伐��毺�瘥磰�敹恬��㰘捏�臬�蝟餌�蝖桃�嚗諹��臭�銝𡁶�餈偦𧫴嚗峕��堒𨭌�踹蘨隡𡁜蒂�交說�桃鱓�溻��n2. �见�銝滚�餈賣��圈�嚗𡁶移蝞�鈭文����鈭箇�銝剛��劐舅銝劐葵�臭誑�冽楛憭𨀣神�𣳇▽敹峕��菔��𥕦揑����页�撠勗歇�航緒憭抒�蝳誩���n3. 憍𡁜宏��𧋦韐冽糓�䀹��Ｗ�嚗𡁶���糓蝏帋蜇����梧�雿�憤�輻���暑��閬���寞𥅾�匧��𣬚�隞瑕�潸�銝𡒊�瘣餉�憟𧶏��𤩺��衤��瑕僎�拐��睃笆�烾��具��' },
    { id: '4', cat: 'grow', author: '@撠𤩺說', title: '�𤑳鍂銝�撟湔𧒄�湛�隞擧���5k�啣�銝𡁏���2銝�', desc: '憭滨�餈嗘�撟游�撖寧�鈭衤�頦抵������', time: '7��24��', content: '霈詨�鈭箄�敺埈��� 5k �航��箔�靚瘀�雿��摰硺�嚗諹�甇�糓雿罱�𣈯��桃��踱�脲��祆�雿汿��𧒄�湔��������𤑳������n\n餈嗘�撟湔��航��琿�朞��臭�蝒�凒���\n1. �烐��臬��啁���凒���踝��煾�㗇𥋘鈭�䌊慦雴�餈鞱𨯫��抅蝖����蝑硋���n2. ����祉��扯��𨥈��典之摰園��𤘪虜�讐��抒�銝讠号�園𡢿嚗峕��𡁏�瘥誩予颲枏枂 3 撠𤩺𧒄嚗䔶��曆遙雿閧��晞��n3. �急�閧１憯������鐝VP嚗𡁶洵銝�銝芸�摮𣂼虾�賢蘨�� 200 ���雿��霂��鈭�����銝𡁻𡡒�舀糓頝穃��𡁶���蘨閬�佅鈭𦒘��剖��䀝��吔��芰�撠曹�頞𦠜�頞𠰴之��' }
  ];

  let blogList = getLocalData('admin_blogs_db', defaultBlogs);
  // 憒��蝻枏��舐征���撠��霈斤��坔�蝻枏�
  if (getLocalData('admin_blogs_db', []).length === 0) {
    setLocalData('admin_blogs_db', defaultBlogs);
  }
  let starred = getLocalData('starred_items', []);
  let activeNewsFilter = 'all';
  let currentNews = [...newsList]; // 敶枏����銝剜葡�梶��圈鉟��

  // �瑕������粉�� Modal DOM
  const artModal = document.getElementById('modal-article-reader');
  const artModalClose = document.getElementById('btn-article-modal-close');
  const artModalTitle = document.getElementById('lbl-article-modal-title');
  const artModalBody = document.getElementById('modal-article-body');
  const artModalLink = document.getElementById('btn-article-modal-external-link');

  const openArticleReader = (item) => {
    if (artModal && artModalTitle && artModalBody && artModalLink) {
      artModalTitle.textContent = `[${item.source || '蝎暸��'}] ${item.title}`;
      artModalBody.textContent = item.content || item.desc || "���霂行���捆";
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

  // 皜脫�摰墧𧒄�硋��冽鰵�餃�銵�
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
          <span style="cursor:pointer;" class="star-btn" data-key="news-${item.id}">${isStarred ? '潃�' : '��'}</span>
        </div>
        <div style="font-size:15px; font-weight:700; margin-bottom:8px;">${item.title}</div>
        <div style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-bottom:12px;">${item.desc}</div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:10px; color:var(--text-secondary);">${item.time}</span>
          <a class="read-article-btn" style="font-size:11px; color:#2F80ED; font-weight:700; text-decoration:none; cursor:pointer;" data-id="${item.id}">�亦�霂行� ��</a>
        </div>
      `;
      list.appendChild(el);
    });
  };

  // 撘�郊�瑕�摰墧𧒄�剔��圈鉟
  const fetchRealtimeNews = () => {
    // 雿輻鍂�砍��舀�頝典�����枏��嗆鰵�� RSS-to-JSON
    const apiEndpoint = `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.163.com%2Fspecial%2F00011K6L%2Frss_newstop.xml`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    fetch(apiEndpoint, { signal: controller.signal })
      .then(response => response.json())
      .then(data => {
        clearTimeout(timeoutId);
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          currentNews = data.items.slice(0, 8).map((item, index) => {
            const cleanDesc = (item.description || item.content || "�孵稬�亦�霂行�").replace(/<\/?[^>]+(>|$)/g, "").slice(0, 80) + '...';
            // �寞旿������蝐餃�
            let category = '�嗆錇';
            if (item.title.includes('AI') || item.title.includes('蝘烐�') || item.title.includes('�舐�') || item.title.includes('�啁�')) {
              category = '蝘烐�';
            } else if (item.title.includes('��') || item.title.includes('韐�') || item.title.includes('��') || item.title.includes('撣�')) {
              category = '韐Ｙ�';
            } else if (item.title.includes('憡�') || item.title.includes('敶�') || item.title.includes('瞍�') || item.title.includes('��')) {
              category = '憡曹�';
            } else if (item.title.includes('��暑') || item.title.includes('�亙熒') || item.title.includes('��')) {
              category = '��暑';
            }
            
            return {
              id: `real-${index}`,
              cat: category,
              source: item.author || '蝵烐�摰墧𧒄',
              title: item.title,
              desc: cleanDesc,
              time: '�𡁜�',
              content: cleanDesc + '\n\n�鞟��梶��嫘�𤏸砲摰墧𧒄�剔��圈鉟撌脫���𦻖�乓��眏鈭舘楊�煺��垍��𣂼�嚗諹𥅾���磰粉瘛勗漲�暹�銝舘�霈綽�霂瑞��颱��嫖�𣈯�霂餃�雿枏����脲��桃凒�亥歲頧砍�摰䀹䲮�仿�憿菟𢒰餈𥡝���粉��',
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
        console.warn('摰墧𧒄�圈鉟蝵𤑳�霂瑟�憭梯揖嚗�歇�删��舐鍂憭�鍂蝳餌瑪�唳旿��', err);
        // 雿輻鍂暺䁅恕蝳餌瑪�唳旿
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
          <span style="cursor:pointer;" class="star-btn" data-key="arbitrage-${item.id}">${isStarred ? '潃�' : '��'}</span>
        </div>
        <div style="font-size:15px; font-weight:700; margin-bottom:8px;">${item.title}</div>
        <div style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-bottom:12px;">${item.desc}</div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:10px; color:var(--text-secondary);">${item.time}</span>
          <a style="font-size:11px; color:#2F80ED; font-weight:700; text-decoration:none;" href="#">�亦�霂行� ��</a>
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
      if (filter === '��暑') return item.cat === 'life';
      if (filter === '��㦤') return item.cat === 'work';
      if (filter === '���') return item.cat === 'emo';
      if (filter === '�鞾鵭') return item.cat === 'grow';
    });
    filtered.forEach(item => {
      const isStarred = starred.includes(`blog-${item.id}`);
      const el = document.createElement('div');
      el.className = 'card';
      el.style.marginBottom = '12px';
      el.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:12px; color:var(--theme-accent); font-weight:700;">${item.author} 繚 ${item.cat}</span>
          <span style="cursor:pointer;" class="star-btn" data-key="blog-${item.id}">${isStarred ? '潃�' : '��'}</span>
        </div>
        <div style="font-size:15px; font-weight:700; margin-bottom:8px;">${item.title}</div>
        <div style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-bottom:12px;">${item.desc}</div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:10px; color:var(--text-secondary);">${item.time}</span>
          <a class="read-blog-btn" style="font-size:11px; color:#2F80ED; font-weight:700; text-decoration:none; cursor:pointer;" data-id="${item.id}">��粉�冽� ��</a>
        </div>
      `;
      list.appendChild(el);
    });
  };

  // 蝏穃��圈鉟�孵稬��粉�其�隞� (憪娍�)
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

  // 蝏穃��𡁜恥�孵稬��粉�其�隞� (憪娍�)
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

  // �嗉��孵稬憪娍�
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('star-btn')) {
      const key = e.target.getAttribute('data-key');
      if (starred.includes(key)) {
        starred = starred.filter(k => k !== key);
      } else {
        starred.push(key);
      }
      setLocalData('starred_items', starred);
      
      // �瑟鰵�𡑒”
      renderNews(activeNewsFilter);
      renderArbitrage();
      renderBlogs();
    }
  });

  // Tabs ��掩�孵稬
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

// ------------------  // 31 憭拇��乩��齿甅�穃蘂摨�
  const bibleQuotes31 = [
    { text: "蟡䂿���銝�����删��賜�憟賬����帋�嚗峕��拇膥嚗諹��舐洵�剜𠯫��", source: "�𥕢�霈� 1:31", tip: "�典��删�擃䀹蔭嚗𣬚�摰��銝�����条�憟賤�辷�Tov Meod嚗剹���隞�”��蟡𧼮笆蟡�����删�銝𣇉���妝摨譍誑�𦠜�隞砌犖蝐餅�������𨀣����蝢𡒊��冽���" },
    { text: "�睲賑�梧��牐蛹蟡𧼮��望�隞研��", source: "蝥衣膩銝�銋� 4:19", tip: "撣諹�霂凋葉����劐��峕��嘅��臭誑�畝gape嚗���∩辣���嚗剹��hileo嚗�����蝑剹��鰵蝥血𧁋蝏譍葉蟡𧼮笆�睲賑����畝gape嚗�朖�䔶蜓�典縧�梧�銝齿��墧𥁒��𧁋�晞�溻��" },
    { text: "�嗅��擧糓�𤑳��扯����穃�銝滩秐蝻箔���", source: "霂㛖� 23:1", tip: "�典�隡舀䔉���銝哨��䀹�敹���喟撩銋謿�蹱�銝算�䀹�銝��䭾�蝻算�踺���憭抒�鈭箔��睲賑�笔𦶢����頣��睲賑撠曹�敹�蛹�𤾸予蝻箔���縉�㻫��" },
    { text: "�笔𦶢�其���仍嚗諹��笔𦶢撠望糓鈭箇��剹��", source: "蝥衣膩蝳誯𨺗 1:4", tip: "�条��賤�坔銁蝥衣膩蝳誯𨺗銝剜糓�詨�霂齿���抅��糓�笔𦶢���憭湛�銋�糓撽望袇敹��暺烐�����㚁��賜�鈭格�隞砌犖�毺�瘥譍��嗆挾��" },
    { text: "�睲賑�枏�銝���賭��豢��𨥈��怎�蟡䂿�鈭箏��𠰴���", source: "蝵烾帕銋� 8:28", tip: "�䀝��豢��𥕞�坔銁���銝剜�銝��憒��蝎曉���蝙頧株��具��朖雿輸𢒰銝湧���嚗𣬚�銋蠘��冽�銝剛��剁�雿踵�隞祉��笔𦶢敺㛖���蝏��撅䂿��𠰴���" },
    { text: "�煾������蝏蹱��偦�����∩��質��𠾼��", source: "�梶�瘥𥪯髡 4:13", tip: "餈䠷����睃𥣞鈭钅��賢��坔僎銝齿糓����芰�����𡄯��峕糓���蝵堒銁�∩�銝𠺪��㰘捏憭��雿踺����𤏸敢���擖梯雲�㚚孕擖選��賢郎隡帋��条䰻頞喇�嗵�蝘䁅���" },
    { text: "雿㰘�銝枏�隞啗��嗅��𠬍�銝滚虾�𡁻��芸楛����汿��", source: "蝞渲� 3:5", tip: "�䀝趕韏砽�嗵����撣行��睃��刻澈�漤��䀝��嗡��嗵��𤩺�腈����誩㭠���睲賑閬���其縑隞餌����撖潘��䔶��臭��凋犖�厰�����冽��颱��喳���" },
    { text: "雿��蝑匧�躰�嗅��𡒊�嚗��隞擧鰵敺堒����隞砍�憒�僭撅閧�銝𡃏���", source: "隞亥�鈭帋髡 40:31", tip: "�条��仮�坔銁撣䔶摩�交�銝剜�撣衣��毺垈�餉�蝏瓐��僭�賭��暹糓�牐蛹摰��敺烾◇摨娍�瘚��靽∪�����𥕢��其�憿箔�������撖潘��屸��㰘䌊撌梁�銵�瘞𢛵��" },
    { text: "雿删�霂脲糓�𤏸��滨��荔��舀�頝臭������", source: "霂㛖� 119:105", tip: "�斗𧒄憭𣈯𡢿�箄�����臬��𧼮虜敺桀摹嚗�蘨�賜�鈭株��箇��䀝�銝�甇乒�踺����鞟內�睲賑嚗𣬚�����航�銝滢�銝�銝见��暹��亥���𧊋�伐�雿��撖嫣����敶㮖����銝�甇乓��" },
    { text: "��隞伐�銝滩�銝箸�憭拙縉�𡢅��牐蛹�𤾸予�芣��𤾸予��縉�𡢅�銝�憭拍��曉�銝�憭拙�撠勗�鈭���", source: "撽砍云蝳誯𨺗 6:34", tip: "�嗥見�冽迨�坔紡�睲賑銝𤘪釣敶㮖����䀝�憭拙�撠勗�鈭��坔�撖潭�隞砌�閬�鍂隞𠰴予����詨縧�𤩺𣈲�𤾸予��縉�𡢅�瘥誩予�賣�銝駁��嗥�靘𥕦���" },
    { text: "�望糓�雴�敹滩�琜�����拇�嚗𤤿��臭�憳匧�嚗𣬚��臭��芸元嚗䔶�撘删���", source: "�交�憭𡁜�銋� 13:4", tip: "�睃��鐥�坔銁���銝剖虜�其�撖嫣犖�屸�撖寧㴓憓����䀹����蹱��冽萱��������漲�餃�鈭箝����暹�鈭�抅����梁�摰鮋�鈭粹�銵函緵��" },
    { text: "閬�虜撣詨�銋琜�銝滢��啁扑�𠺪��∩�靚Ｘ���", source: "撣𡝗�蝵堒側餈血�銋� 5:16-18", tip: "�䀝�雿誩𧑐蟡瑕��坔僎銝齿糓��㟲憭抵楫��銝滚僕瘣鳴��峕糓��銁敹�葉銝𦒘蜓靽脲��𤩺𧒄�函瑪����嗅鐤瘙��鈭脣��𠉛�����臭縑敺垍�瘣餃��𦦵�暺��瘜訫���" },
    { text: "蟡墧糓�睲賑����暹�嚗峕糓�睲賑����𧶏��舀��曆葉�𤩺𧒄��葬�押��", source: "霂㛖� 46:1", tip: "�㗛��嗥�撣桀𨭌�坔銁���銝剜�銝算�䁅◤霂���舀�摰寞��曉���葬�抽�踺����睲賑�Ｖ葩憌擧答�塚�蟡𧼮僎銝齿糓�乩��臬�嚗諹�峕糓餈穃銁�怠偕����冽葛皝整��" },
    { text: "蟡䂿�銝碶犖嚗𣬚��喳�隞𣇉��祉�摮鞱�蝏嗘�隞穿��思���縑隞𣇉�銝滩秐�凋滿嚗��敺埈偶�麄��", source: "蝥衣膩蝳誯𨺗 3:16", tip: "餈坔蘂鋡怎妍銝算�睃凝�讠��喇�踺���䀹偶�麨�嗘�隞���舀��園𡢿�𣳇��選��湔糓���蝘滢�蟡䂿㮾鈭斤���萼�𥕢��匧�韐函��冽鰵�笔𦶢�嗆����" },
    { text: "�����蝏梶��𨅯�嚗�停�臭��晞���銋僐���撟喋����僐������������縑摰𠺶��", source: "�䭾�憭芯髡 5:22", tip: "�䀹�摮鐥�坔銁���銝剜糓�閙㺭嚗䔶誨銵刻�銋萘�蝢𤾸噸�臭�銝芣��箇��賭���㟲雿枏��堆�撠勗���𧁋�萄銁�睲賑�笔𦶢銝剝��餃枂��抅����瑕���" },
    { text: "�穃�瘝⊥��拙�雿惩�嚗煺�敶枏�撘箏ㄝ���銝滩��扳�𤏪�銋煺�閬���嗚��", source: "蝥虫髡鈭朞扇 1:9", tip: "�睃�撘箏ㄝ���蹱糓�牐蛹�䁅�嗅��𦒘����銝𦒘���銁�踺���隞祉����銝齿糓皞𣂷��芾澈�偦���撩憭改��峕糓皞𣂷��諹����憭扯���" },
    { text: "靽∪停�舀��𥕢�鈭讠�摰𧼮�嚗峕糓�芾�銋衤���＆�柴��", source: "撣䔶摩�乩髡 11:1", tip: "�睃�摨𨰝�坔銁���銝剜��睃𧑐憟爗�嗵��思���縑敹�停�𤩺糓蟡𧼮�霈貊��睲賑����萎漣銝𡁶��啣�嚗�朖雿輻尐�𥕦��芰�閫��銋�𨘥�劐�蝖桀���鐯�柴��" },
    { text: "銝滩����餈嗘葵銝𣇉�嚗�蘨閬���𤩺凒�啗����吔��思�隞砍�撉䔶�銝箇�����胯��滲�具��虾�𨀣���秄�譌��", source: "蝵烾帕銋� 12:2", tip: "�睃��砽�坔銁���銝剜糓�䁅��覀�辷�頝��瘥𥡝臤�𤥁𧙕�諹�嚗剹���銵冽��箇边敺垍��笔𦶢�孵��舐眏���������朞��萘輕�滨�摰䂿緵敶餃�����賣凒�啜��" },
    { text: "雿牐賑蟡��嚗�停蝏嗘�隞穿�撖餅𪄳嚗�停撖餉�嚗𥕦䕪�剁�撠梁�雿牐賑撘��具��", source: "撽砍云蝳誯𨺗 7:7", tip: "�典��𠰴���葉嚗𢞖�条�瘙��踺���睃粉�撾�踺���睃䕪�兩�䠷��舐緵�冽�蝏剜𧒄����譍蛹�䀹�蝏凋��剖𧑐蟡����粉�整��䕪�兩�辷��暹�鈭�扑�羓��鍦�銝𤾸�摰𠾼��" },
    { text: "�𤑳�撣桀𨭌隞𡡞�惩予�啁��嗅��舘�峕䔉��", source: "霂㛖� 121:2", tip: "霂𦯀犖�嘥控銝曄𤌍嚗峕楛�亥�撌滚釣���撅曹�銝滩��𣂷�蝏������頣��舀�頝刻��烾�删�嚗䔶趕�偦�雿滩�頞𠰴予�啁�銝餃扇嚗峕��賢���瘞豢����蝔喋��" },
    { text: "�∩��賣�摰𡁏�嚗�予銝衤��⊿��匧��嗚��", source: "隡𣳇�銋� 3:1", tip: "�睃��麨�坔��睃��嗯�蹱遬�𦒘�蟡墧��抒�銝����妝摨譌��銁�睲賑閫匧�餈笔辣�㚚�銋望𧒄嚗𣬚��厩���蝢𤾸末��𧒄�餉”嚗峕�隞砍蘨���其縑�牐葉蝑匧�踺��" },
    { text: "蟡噼��血縧隞碶賑銝�����潭釭����齿�甇颱滿嚗䔶�銝滚��㗇�����揑�瑯��䲰�䜘��", source: "�舐內敶� 21:4", tip: "餈蹱糓�啣予�啣𧑐������霈詻���䀹𣑐�餌尐瘜芬�蹱遬�𦒘�蟡𧼮��嗡熔�祉���漲皜拇�嚗峕��匧銁銝碶���慾�� and �寞�嚗屸�撠�銁蟡䂿�����銝剛◤敶餃��餅祥��" },
    { text: "雿㰘�靽嘥�雿惩�嚗諹�餈��摰������牐蛹銝��毺��𨀣��舐眏敹���箝��", source: "蝞渲� 4:23", tip: "�典�隡舀䔉���銝哨��睃��嗘誨銵冽�敹𨰜���脲��峕��毺��駁�嚗峕糓銝�����函�皞𣂼仍���隞祈�撠誩��脣�嚗屸俈甇Ｚ��Ｙ�敹��萘聦�譍��笔𦶢皞鞉���" },
    { text: "摨𥪜�銝��䭾��𡢅��芾��∩��厩�蟡瑕����瘙���蠘陝嚗��雿牐賑��閬���𡃏�蟡𠺶��", source: "�梶�瘥𥪯髡 4:6", tip: "�䀝��䭾��爗�嗵�閫�晓�胼�睃𥣞鈭讠扑�𪙛�踺����睲賑撣衣��䀹�靚Ｔ�嗵�敹���齿�鈭斗��塚�撠曹誨銵冽�隞祉㮾靽∠�������頞𦠜�隞祆�憭���啣���" },
    { text: "�嗥見霂湛��穃停�舫�頝胯���������踝��乩��厩��𡢅�瘝⊥�鈭箄��啁�����颯��", source: "蝥衣膩蝳誯𨺗 14:6", tip: "�嗥見銝滢��舀�頝臭犖嚗𣬚��芸楛撠望糓�栞楝嚗𤤿�銝滢��臭���䰻霂��蟡�𧋦頨怠停�舐����蟡��隞�蒂�亦�摮矋�蟡�䌊撌勗停�舀偶�垍��賜�摰硺���" },
    { text: "雿牐賑��犖閬�翰敹怠𧑐�穿��Ｗ𧑐霂湛��Ｘ��啁�瘞𢛵��", source: "���銋� 1:19", tip: "�睃翰敹怠𧑐�砂�蹱�靽脲�靚血��䔶�瘜刻��祉���漲嚗𥕞�䀹��Ｗ𧑐����蹱��埝�隞穿�鈭箇��埝�銝滩��𣂼停蟡䂿�銋㚁��雴���仍�臬��菜�敹𨰜��" },
    { text: "雿惩�撠���賜��栞楝��內�㻫��銁雿𣳇𢒰�齿�皛∟雲���銋琜��其��單�銝剜�瘞貉����銋僐��", source: "霂㛖� 16:11", tip: "�䀹說頞喟��靝��坔銁���銝剜�銝算�㗛弗頞喟��靝��踺��銁�烾�删�銝剖粉�曄�敹思��舐����嚗�蘨�匧銁�删�銝駁𢒰�㵪�敹����征蝻箸�隡朞◤摰��憛急說��" },
    { text: "雿牐賑閬��銝����敹扯��貊�蟡痹��牐蛹隞㚚▽敹萎�隞研��", source: "敶澆��滢髡 5:7", tip: "�睃桊�坔銁���銝剜�銝算�条鍂�𥟇��猾�踺��停�𤩺��䔶�瘝厰������鍂�𥟇�蝏蹱�颲寞��偦��輯蝸��犖嚗��銝箇�甇�鍂��之����函溸憿曄�雿𨬭��" },
    { text: "�梢�瘝⊥��扳�𤏪��望𠳿摰��嚗�停�𦠜��閖膄�颯��", source: "蝥衣膩銝�銋� 4:18", tip: "摰𣬚����嚗㇁gape嚗㕑�撽望袇�扳�𤏪��牐蛹�函��曹葉�睲賑蝖桐縑鋡急𦻖蝥喋��◤靽脲擪����訫�敺�撣行��𤑳���▽�𡢅��𣬚�撌脣銁����嗡��芸縧鈭��蝵𠾼��" },
    { text: "�∩�靚西���萱�𢛵����琜��函�敹���詨捐摰嫘��", source: "隞亙���銋� 4:2", tip: "�睃捐摰嫖�坔銁���銝剜��睃蝦甇斗㗁���踺��銁�嗘���振摨剖𣪧憟睲葉嚗諹���閬��隞砍蒂���箇边��萱�䈑��餅𦻖蝥喳����敶潭迨��蔓撘勗�銝滚�蝢汿��" },
    { text: "敶枏�雿删�鈭衤漱�䁅�嗅��𠬍�撟嗅�𡁻�隞吔�隞硋停敹���具��", source: "霂㛖� 37:5", tip: "�䀝漱�覀�坔銁撣䔶摩�亙���葉�胼�䀹�餈�縧�嗵��𤩺�腈��停�𤩺�銝��埈�隞祈�銝滚𢆡��楊�喉��典�皛𡁶�蟡𠺶����芾��暹��𡁻�嚗𣬚�敹��鈭脰䌊�冽��𣂼停��" },
    { text: "雿牐賑敶枏�撘箏ㄝ���銝滩�摰單�𤏪��㰘�嗅��𦒘�����䔶���縧嚗䔶�敹��銝Ｗ�雿𨬭��", source: "�喳𦶢霈� 31:6", tip: "餈蹱糓蟡䂿��喳𦶢霈唬葉���韐萄�霈賂�撘訫紡�睲賑�∩�鈭斗����撘箏ㄝ����厩�雿𨅯��箇��𡒊㦛��" }
  ];�葵�唳䲮頨箔��∟�嚗𥟇��∠�鈭���帋�銝�銝芣╪���璇西�銝�銝芯犖嚗諹澈銝𡃏﹝銵怨仍銴𨥈�������芸楛��振嚗峕��峕嚉��銝��砌髡嚗諹�銝𡃏���銝�銝芣��滨���２��n\n�𤑳�閫���枏�銋佗�霂颱�韏瑟䔉嚗䔶�颲寡粉銝�颲孵揑瘜���吔�隞硋��典��嗡�雿譍�嚗䔶噶�穃枂�脣���鐤�𡃏秩嚗尠�𨀣�霂交�𦒘��𧼮𢅛嚗麨�𩄼n�刻�銝芣憤�輯���皛⊿獈蝣滨����𥪯葉嚗�𣈲�㗇�����凝撘梁�蝒�秄銋见��滩�嚗峕��航�蝳餅��凋��𡒊��臭��栞楝��'
    },
    { 
      title: '�𡃏��𧼮��麄��', 
      author: 'C.S.頝舀���', 
      tags: ['靽∩趕�斗�', '�詨��嗘�'], 
      progress: 90, 
      month: '7��髡��',
      url: 'https://vreading.com/book/64',
      sample: '蝚砌�蝭���舫�銋𧢲�\n\n憭批振�賢𨯬餈�犖�菜沲�扼����嗅�坔𨯬韏瑟䔉�箏末蝚𡢅��㗇𧒄�坔�銝滚��瓐���銝滨恣�擧甅嚗䔶�隞砍閠�嗆𧒄��霂渡�霂脲糓�澆�瘜冽������隞砌�霂湛��𨅯��𨀣�鈭箄��瑕笆雿𩤃�雿牐��劐�銋��閫㚁��脲����𣈯��舀���漣雿㵪��牐蛹�穃��啜���脲����𨅯�蝏蹱�銝��對��牐蛹餈坔��砍像���𩄼n\n�菜沲��犖霂渲�鈭𥡝�嚗䔶�隞���臬銁銵刻噢撖寞䲮���銝箔誘�芸楛銝滚翰嚗諹�峕糓�刻�霂訾�銝芯�隞祆��𥕦笆�嫣��仿�撟嗡��祈恕���銝箸������銝芣����撠望糓瘛望�鈭𦒘犖蝐餃予�找�銝剔��𨀣糓�硺�瘜𨰝�脲��𡏭䌊�嗆��腈��'
    },
    { 
      title: '�𠰴𧁋蝏誩紡霂鳴�閫���菜���', 
      author: '��蒈繚�� / �𤘪聢�㗇鱻繚�臬㦛撠𠉛鸌', 
      tags: ['���撌亙�', '閫�����'], 
      progress: 20, 
      month: '8��髡��',
      url: 'https://vreading.com/book/125',
      sample: '撘閗�嚗朞粉蝏讐��箸钟銝舘圾蝏讐�敹��\n\n������銝��瑚髡�賣糓�函鸌摰𡁶���蟮霂剖�銝哨��梁鸌摰𡁶�雿𡏭���蝏嗵鸌摰𡁏𧒄隞���峕艶��犖蝢斤����隞砌�憭拚�霂餃�嚗�停�臬銁頝刻��園𡢿����� and 霂剛���蛾瘝麄��n\n閫��撟嗡��舐頂蝏毺�摮血振�𣇉�撣��銝枏⏚嚗諹�峕糓瘥譍�銝芣葩�𥟇��賜�����暑�箔縑隞唬�鈭箇��亙虜�蠘紋��𧋦銋行秄�典葬�拐�撱箇�韏瑚舅憿寞瓲敹���辷�擐硋�嚗���啁���銁敶𤘪𧒄����砍鉄銋㚁��羓�嚗㚁��嗆活嚗�郎隡𡁜�餈躰��方����毺�摨𠉛鍂�典�銝见��条��唬誨蝷曆�銝准��'
    },
    { 
      title: '�𠹺�撣萘�餈賢粉��', 
      author: '�嗆�', 
      tags: ['撅䂿�蝏誩�', '敹��撖餅�'], 
      progress: 65, 
      month: '8��髡��',
      url: 'https://vreading.com/book/210',
      sample: '蝚砌�蝡𩤃�蝝抒揮�啗蕭�讐�\n\n�其�銝芸�皛∩�靽堒臁�喃��抵捶霂望�����䔶葉嚗䔶犖�菟���瘛勗���孕皜湛��怨�鈭𤾸笆�删�銝餃��函��笔�雿㯄����甇��靽∩趕蝏苷�摨磰砲隞���𦦵��其縑�∠�霈文�銝𦒘貌撘讐�撅亥�銝𠺪�摰�𧋦頨怠停�臭��箏��菜楛憭��瘞豢�銋讠��賊���蕭撖颱�����n\n蟡硺��游銁蝑匧����睲賑���摨䈑�隞𣇉��拙��䭾𧒄�惩�銝滚銁�澆𤧅���睲賑���隞砌���閬���圈�餈𦦵�憭拚��餃粉�曆�嚗峕�隞砍蘨��閬�蓮餈�仍嚗���躰䌊撌梁�敹���餃粉瘙����𢒰嚗䔶�撠勗��烐�隞祆遬�啜��'
    }
  ];

  let books = getLocalData('book_list', defaultBooks);
  // 蝖桐�銋血��䀹凒�嗉�憭蠘䌊�典�蝥扳𧋦�啁�摮�
  if (books.length > 0 && books.some(b => b.title.includes('�𦠜𧒄��') || b.title.includes('�烐惣��') || !b.sample)) {
    books = defaultBooks;
    setLocalData('book_list', defaultBooks);
  }

  // �瑕���粉�� Modal DOM
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

  // 蝏穃��蹱���憭批㨃�� (�祆�蝎暸�剹�𡃏�瞍删�瘜剹��) �孵稬鈭衤辣
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

    const months = ['7��髡��', '8��髡��'];
    months.forEach(m => {
      const monthHeader = document.createElement('div');
      monthHeader.style.cssText = 'font-weight:700; font-size:13px; margin:12px 0 8px 0; display:flex; align-items:center; gap:6px; color:#D81B60;';
      monthHeader.innerHTML = `<span>��</span> <span>${m}</span>`;
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
            <span class="read-ebook-btn" style="font-size:11px; color:#2F80ED; font-weight:700; cursor:pointer; margin-top:6px; display:inline-block;">�� �萄�銋西�霂�</span>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
            <div class="progress-bar-container" style="cursor:pointer;" title="�孵稬靽格㺿餈𥕦漲">
              <div class="progress-bar-fill" style="width: ${b.progress}%"></div>
            </div>
            <span style="font-size:11px; font-weight:700; color:#D81B60;">${b.progress}%</span>
          </div>
        `;
        
        // �孵稬餈𥕦漲�∩耨�寡�摨�
        el.querySelector('.progress-bar-container').addEventListener('click', (e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const width = rect.width;
          const newProgress = Math.round((clickX / width) * 100);
          
          books = books.map(item => item.title === b.title ? { ...item, progress: newProgress } : item);
          setLocalData('book_list', books);
          render();
        });

        // 蝏穃��萄�銋西�霂餌��颱�隞�
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
// 8. ��揣摮㗛兝璅∪� (霈曇恣銵亙�)
// -------------------------------------------------------------
const initFinance = () => {
  let savedList = getLocalData('savings_list', [1, 2, 4, 7, 10, 11, 15, 18, 20]); // 摮睃���聢��

  const updateDashboard = () => {
    // 霈暹��潔誨銵� 50 ��
    const totalSaved = savedList.length * 50;
    const progress = totalSaved / 3000;
    const percent = Math.round(progress * 100);

    document.getElementById('lbl-saving-percent').textContent = `${percent}%`;
    document.getElementById('lbl-saving-total').textContent = `撌脣� ${totalSaved} ��;

    const circle = document.getElementById('finance-circle');
    const circumference = 251.2;
    circle.style.strokeDashoffset = circumference - (Math.min(progress, 1) * circumference);

    document.getElementById('lbl-finance-summary').innerHTML = `
      撌脣���: ${totalSaved} ��<br>
      �拐��格�: ${Math.max(3000 - totalSaved, 0)} ��
    `;
  };

  const renderBoard = () => {
    const board = document.getElementById('board-savings');
    board.innerHTML = '';

    // ��� 48 銝芸�摮㗛兝��
    for (let i = 1; i <= 48; i++) {
      const item = document.createElement('div');
      item.className = 'saving-item';
      item.textContent = `嚙�50`;
      
      if (savedList.includes(i)) {
        item.classList.add('saved');
        item.textContent = `�𤩊;
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
// 9. 霂餌��蠘紋璅∪�
// -------------------------------------------------------------
const initBible = () => {
  let checkedDays = getLocalData('bible_checks', [1, 3, 5, 8, 12, 15, 18, 22]); // 暺䁅恕撌脫��∪予��
  let testDate = new Date().getDate(); // 暺䁅恕敶枏��交�嚗�予嚗�
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

  // 31 憭拇��乩��齿甅�穃蘂摨�
  const bibleQuotes31 = [
    "蟡䂿���銝�����删��賜�憟賬����帋�嚗峕��拇膥嚗諹��舐洵�剜𠯫�� (�𥕢�霈� 1:31)",
    "�嗅��擧糓�𤑳��扯����穃�銝滩秐蝻箔��� (霂㛖� 23:1)",
    "�笔𦶢�其���仍嚗諹��笔𦶢撠望糓鈭箇��剹�� (蝥衣膩蝳誯𨺗 1:4)",
    "�睲賑�枏�銝���賭��豢��𨥈��怎�蟡䂿�鈭箏��𠰴��� (蝵烾帕銋� 8:28)",
    "�煾������蝏蹱��偦�����∩��質��𠾼�� (�梶�瘥𥪯髡 4:13)",
    "雿㰘�銝枏�隞啗��嗅��𠬍�銝滚虾�𡁻��芸楛����汿�� (蝞渲� 3:5)",
    "雿��蝑匧�躰�嗅��𡒊�嚗��隞擧鰵敺堒����隞砍�憒�僭撅閧�銝𡃏��� (隞亥�鈭帋髡 40:31)",
    "雿删�霂脲糓�𤏸��滨��荔��舀�頝臭������ (霂㛖� 119:105)",
    "��隞伐�銝滩�銝箸�憭拙縉�𡢅��牐蛹�𤾸予�芣��𤾸予��縉�𡢅�銝�憭拍��曉�銝�憭拙�撠勗�鈭��� (撽砍云蝳誯𨺗 6:34)",
    "�望糓�雴�敹滩�琜�����拇�嚗𤤿��臭�憳匧�嚗𣬚��臭��芸元嚗䔶�撘删��� (�交�憭𡁜�銋� 13:4)",
    "閬�虜撣詨�銋琜�銝滢��啁扑�𠺪��∩�靚Ｘ��� (撣𡝗�蝵堒側餈血�銋� 5:16-18)",
    "蟡墧糓�睲賑����暹�嚗峕糓�睲賑����𧶏��舀��曆葉�𤩺𧒄��葬�押�� (霂㛖� 46:1)",
    "蟡䂿�銝碶犖嚗𣬚��喳�隞𣇉��祉�摮鞱�蝏嗘�隞穿��思���縑隞𣇉�銝滩秐�凋滿嚗��敺埈偶�麄�� (蝥衣膩蝳誯𨺗 3:16)",
    "�����蝏梶��𨅯�嚗�停�臭��晞���銋僐���撟喋����僐������������縑摰𠺶�� (�䭾�憭芯髡 5:22)",
    "�穃�瘝⊥��拙�雿惩�嚗煺�敶枏�撘箏ㄝ���銝滩��扳�𤏪�銋煺�閬���嗚�� (蝥虫髡鈭朞扇 1:9)",
    "靽∪停�舀��𥕢�鈭讠�摰𧼮�嚗峕糓�芾�銋衤���＆�柴�� (撣䔶摩�乩髡 11:1)",
    "銝滩����餈嗘葵銝𣇉�嚗�蘨閬���𤩺凒�啗����吔��思�隞砍�撉䔶�銝箇�����胯��滲�具��虾�𨀣���秄�譌�� (蝵烾帕銋� 12:2)",
    "雿牐賑蟡��嚗�停蝏嗘�隞穿�撖餅𪄳嚗�停撖餉�嚗𥕦䕪�剁�撠梁�雿牐賑撘��具�� (撽砍云蝳誯𨺗 7:7)",
    "�𤑳�撣桀𨭌隞𡡞�惩予�啁��嗅��舘�峕䔉�� (霂㛖� 121:2)",
    "�∩��賣�摰𡁏�嚗�予銝衤��⊿��匧��嗚�� (隡𣳇�銋� 3:1)",
    "蟡噼��血縧隞碶賑銝�����潭釭����齿�甇颱滿嚗䔶�銝滚��㗇�����揑�瑯��䲰�䜘�� (�舐內敶� 21:4)",
    "雿㰘�靽嘥�雿惩�嚗諹�餈��摰������牐蛹銝��毺��𨀣��舐眏敹���箝�� (蝞渲� 4:23)",
    "摨𥪜�銝��䭾��𡢅��芾��∩��厩�蟡瑕����瘙���蠘陝嚗��雿牐賑��閬���𡃏�蟡𠺶�� (�梶�瘥𥪯髡 4:6)",
    "�嗥見霂湛��穃停�舫�頝胯���������踝��乩��厩��𡢅�瘝⊥�鈭箄��啁�����颯�� (蝥衣膩蝳誯𨺗 14:6)",
    "雿牐賑��犖閬�翰敹怠𧑐�穿��Ｘ��啗秩嚗峕��Ｗ𧑐����� (���銋� 1:19)",
    "雿惩�撠���賜��栞楝��內�㻫��銁雿𣳇𢒰�齿�皛∟雲���銋琜��其��單�銝剜�瘞貉����銋僐�� (霂㛖� 16:11)",
    "雿牐賑閬��銝����敹扯��貊�蟡痹��牐蛹隞㚚▽敹萎�隞研�� (敶澆��滢髡 5:7)",
    "�梢�瘝⊥��扳�𤏪��望𠳿摰��嚗�停�𦠜��閖膄�颯�� (蝥衣膩銝�銋� 4:18)",
    "�∩�靚西���萱�𢛵����琜��函�敹���詨捐摰嫘�� (隞亙���銋� 4:2)",
    "敶枏�雿删�鈭衤漱�䁅�嗅��𠬍�撟嗅�𡁻�隞吔�隞硋停敹���具�� (霂㛖� 37:5)",
    "雿牐賑敶枏�撘箏ㄝ���銝滩�摰單�𤏪��㰘�嗅��𦒘�����䔶���縧嚗䔶�敹��銝Ｗ�雿𨬭�� (�喳𦶢霈� 31:6)"
  ];

  // �唳唂蝥衣�蝘啜���蝘啣�蝡㰘��惩��喟頂�唳旿摨�
  const oldBooks = [
    { short: "��", full: "�𥕢�霈�", key: "genesis", chapters: 50 },
    { short: "��", full: "�箏��𡃏扇", key: "exodus", chapters: 40 },
    { short: "��", full: "�拇𧊋霈�", key: "leviticus", chapters: 27 },
    { short: "瘞�", full: "瘞烐㺭霈�", key: "numbers", chapters: 36 },
    { short: "��", full: "�喳𦶢霈�", key: "deuteronomy", chapters: 34 },
    { short: "蝥�", full: "蝥虫髡鈭朞扇", key: "joshua", chapters: 24 },
    { short: "憯�", full: "憯怠�霈�", key: "judges", chapters: 21 },
    { short: "敺�", full: "頝臬�霈�", key: "ruth", chapters: 4 },
    { short: "�雴�", full: "�埝��唾扇銝�", key: "samuel1", chapters: 31 },
    { short: "霂�", full: "霂㛖�", key: "psalms", chapters: 150 }
  ];

  const newBooks = [
    { short: "憭�", full: "撽砍云蝳誯𨺗", key: "matthew", chapters: 28 },
    { short: "��", full: "撽砍虾蝳誯𨺗", key: "mark", chapters: 16 },
    { short: "頝�", full: "頝臬�蝳誯𨺗", key: "luke", chapters: 24 },
    { short: "蝥�", full: "蝥衣膩蝳誯𨺗", key: "john", chapters: 21 },
    { short: "敺�", full: "雿踹�銵䔶�", key: "acts", chapters: 28 },
    { short: "蝵�", full: "蝵烾帕銋�", key: "romans", chapters: 16 },
    { short: "��", full: "�舐內敶�", key: "revelation", chapters: 22 }
  ];

  let selectedBook = null;
  let selectedChapterNum = null;

  // �湔鰵隞𦠜𠯫霂餌�隞餃𦛚
  const updateTodayTask = () => {
    const todayPlan = window.BIBLE_DATA.plan[testDate] || { bookKey: 'genesis_1', task: '�𥕢�霈� 蝚� 1 蝡�' };
    
    // 憒��瘝⊥��见𢆡�劐髡嚗��蝷箏�憭拍�霂餌�隞餃𦛚
    if (!selectedBook) {
      taskLabel.textContent = `霂餌���凒: ${todayPlan.task}`;
    } else {
      taskLabel.textContent = `霂餌���凒: ${selectedBook.full} 蝚� ${selectedChapterNum} 蝡鮏;
    }

    // �湔鰵�枏㨃�厰僼�嗆��
    const isDone = checkedDays.includes(testDate);
    if (isDone) {
      checkinBtn.textContent = '撌脫��∪��� ��';
      checkinBtn.style.background = '#E5E5EA';
      checkinBtn.style.color = '#8E8E93';
    } else {
      checkinBtn.textContent = '�枏㨃摰峕�';
      checkinBtn.style.background = 'var(--theme-light-bg)';
      checkinBtn.style.color = 'var(--theme-accent)';
    }

    // �冽���甇交凒�啣��函���澈�穃蘂 (頝笔��齿𠯫�� testDate ��偬嚗���唳�憭拐���)
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
    } else {
        activeQuoteObj = bibleQuotes31[(testDate - 1) % 31];
      }

      quoteText.textContent = `"${activeQuoteObj.text}"`;
      const quoteSource = document.getElementById('bible-quote-source');
      if (quoteSource) {
        quoteSource.textContent = activeQuoteObj.source;
      }
      
      const quoteTip = document.getElementById('bible-quote-tip');
      if (quoteTip) {
        quoteTip.textContent = activeQuoteObj.tip || "每日神的话语，是我们脚前的灯，路上的光。";
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

  // �嘥��𡝗�霂閙𠯫�煺��㕑���
  if (selectEl) {
    selectEl.innerHTML = '';
    for (let i = 1; i <= 31; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `8��${i}�匝;
      if (i === testDate) opt.selected = true;
      selectEl.appendChild(opt);
    }

    selectEl.addEventListener('change', (e) => {
      testDate = parseInt(e.target.value);
      selectedBook = null; // ����交��嗉䌊�冽�憭漤�霈支��乩遙��
      selectedChapterNum = null;
      updateTodayTask();
      renderCalendar();
      if (readerCard) readerCard.style.display = 'none';
      
      // �湔鰵蝡㰘��劐葉擃䀝漁
      document.querySelectorAll('.bible-book-btn').forEach(btn => btn.classList.remove('active'));
      const chGrid = document.getElementById('bible-chapters-grid');
      if (chGrid) chGrid.style.display = 'none';
    });
  }

  // --- �亦���粉皜脫�撘閙� ---
  const loadBibleVerses = (bookName, bookKey, chapterNum) => {
    if (!readerCard || !textContainer || !readerTitle) return;

    readerTitle.textContent = `${bookName} 蝚� ${chapterNum} 蝡鮏;
    textContainer.innerHTML = '';

    // 隞� bible_data.js 銝剖粉�曄鸌摰𡁶���蔭畾菔氜 (靘见�: genesis_1, john_1, matthew_1)
    const targetKey = `${bookKey}_${chapterNum}`;
    const bookData = window.BIBLE_DATA.books[targetKey];

    if (bookData) {
      // 1. 憒����蔭鈭�砲蝡𩤃��湔𦻖皜脫�
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
      // 2. 憒���芸��伐�撘��舫�靽萘�璅⊥��滨漣皜脫�嚗�遬蝷箄砲�瑞洵銝�蝡𣳇�𡁶鍂蟡萘�蝏𤩺�嚗䔶��𨀣�蝷箏�蝢𠬍�
      const mockVerses = [
        { num: 1, text: "憭芸��厰�嚗屸�銝𡒊���銁嚗屸�撠望糓蟡𠺶����枏云�苷�蟡𧼮��具��" },
        { num: 2, text: "銝���航���隞㚚�删�嚗𥕦𥣞鋡恍�删�嚗峕瓷�劐��瑚��航���隞㚚�删���" },
        { num: 3, text: "�笔𦶢�其���仍嚗諹��笔𦶢撠望糓鈭箇��剹����批銁暺烐��䕘�暺烐��港��亙��剹��" },
        { num: 4, text: "敺𧢲��祆糓�厩��抵正隡删�嚗𥟇��詨��毺��賣糓�梯�嗥見�箇边�亦���" },
        { num: 5, text: "�睲賑�枏�銝���賭��豢��𨥈��怎�蟡䂿�鈭箏��𠰴�嚗�停�舀�隞𡝗秄�讛◤�祉�鈭箝��" }
      ];
      mockVerses.forEach(v => {
        const row = document.createElement('div');
        row.className = 'bible-verse-row';
        row.innerHTML = `
          <span class="bible-verse-num">${v.num}</span>
          <span class="bible-verse-text">[${bookName}${chapterNum}蝡髗 ${v.text}</span>
        `;
        textContainer.appendChild(row);
      });
    }

    readerCard.style.display = 'block';
    textContainer.scrollTop = 0;
  };

  // 撘�憪钅�霂鳴�隞𦠜𠯫隞餃𦛚嚗�
  if (readStartBtn) {
    readStartBtn.addEventListener('click', () => {
      if (selectedBook && selectedChapterNum) {
        loadBibleVerses(selectedBook.full, selectedBook.key, selectedChapterNum);
      } else {
        const todayPlan = window.BIBLE_DATA.plan[testDate] || { bookKey: 'genesis_1', task: '�𥕢�霈� 蝚� 1 蝡�' };
        // 閫�� bookKey 憒� genesis_1
        const parts = todayPlan.bookKey.split('_');
        const bKey = parts[0];
        const cNum = parts[1] || '1';
        const bookData = window.BIBLE_DATA.books[todayPlan.bookKey];
        const bName = bookData ? bookData.title.split(' ')[0] : '�𥕢�霈�';

        loadBibleVerses(bName, bKey, cNum);
      }
    });
  }

  // --- �亦��㗇𥋘�券��湧𢒰�踵��牐漱鈭� ---
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

  // �唳唂蝥血之�臭虜 Tab ��揢銝𡒊�蝘啁��潭葡��
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

  // 皜脫�蝡㰘��𡑒”蝵烐聢
  const renderChaptersGrid = (book) => {
    const chGrid = document.getElementById('bible-chapters-grid');
    if (!chGrid) return;
    chGrid.innerHTML = '';
    chGrid.style.display = 'grid';

    // 銝箔��垍�嚗峕�憭批㭘銋衣�蝡㰘��𣂼��冽�撣貊鍂��� 12 蝡惩�蝷綽��踹�頞�鵭璅芸��劐撓
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

        // �芸𢆡�㕑絲��粉�典�頧賜���
        loadBibleVerses(book.full, book.key, c);
      });

      chGrid.appendChild(btn);
    }
  };

  // �嘥��𣇉�摰𡁏鰵�抒漲 Tabs ��揢
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

  // 暺䁅恕皜脫��抒漲
  renderBooksGrid('old');

  // 摮堒噡憭批�靚��
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

  // �枏㨃摰峕��厰僼
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

  // 皜脫�霂餌����霈啣�
  const renderCalendar = () => {
    const grid = document.getElementById('grid-bible-calendar');
    if (!grid) return;
    grid.innerHTML = '';

    const daysName = ['��', '銝�', '鈭�', '銝�', '��', '鈭�', '��'];
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
    if (lblDays) lblDays.textContent = `�祆�撌脣��� ${checkedDays.length} 憭奈;
  };

  // ��澈�穃蘂�厰僼 (頝�𠯫�� testDate ���蝏穃�嚗���唳�憭拐���)
  const shareQuoteBtn = document.getElementById('btn-share-bible-quote');
  if (shareQuoteBtn) {
    shareQuoteBtn.addEventListener('click', () => {
      const dayQuote = bibleQuotes31[(testDate - 1) % 31];
      const match = dayQuote.match(/^(.*?)\s*\((.*?)\)\s*$/);
      const textOnly = match ? match[1].trim() : dayQuote;
      const sourceOnly = match ? match[2].trim() : '';
      const shareText = `"${textOnly}" — ${sourceOnly}`;
      
      navigator.clipboard.writeText(shareText).then(() => {
        alert(`✨ 每日金句已成功复制至剪贴板，愿主的话语常伴随你！\n\n${shareText}`);
      }).catch(err => {
        console.warn('剪切板写入失败，降级弹框展示：', err);
        alert(`✨ 每日金句：\n${shareText}`);
      });
    });
  }

  updateTodayTask();
  renderCalendar();
};
const initWellness = () => {
  const defaultItems = [
    { title: '�佂 �嘥� 8 �舀偌', done: false },
    { title: '�𪆓 �∪�瘜∟� 15 ���', done: false },
    { title: '�狍 23:00 �滚���', done: false },
    { title: '�枤 銝��舐滯��㚬�噼薗', done: false },
    { title: '��儭� �鍦云�� 15 ���', done: false }
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
    document.getElementById('lbl-wellness-percent').textContent = `${percent}% 撌脣��㦀;
  };

  render();
};

// -------------------------------------------------------------
// 11. �𤑳��烐�璅∪�
// -------------------------------------------------------------
const initTreehole = () => {
  let list = getLocalData('treehole_notes', [
    { id: '1', emotion: '撘�敹�', content: '隞𠰴予摰峕�鈭��銝芸之憿寧𤌍嚗�����憟踝�', time: '隞𠰴予 18:00' },
    { id: '2', emotion: '撟喲�', content: '�冽錰銝�銝芯犖�餃��剜袇甇伐��砍𨯬憌𡒊�憯圈𨺗��', time: '�典予 16:00' }
  ]);

  let selectedEmotion = '撘�敹�';

  // ��貌蝎曄��𧼮����
  const replies = {
    '撘�敹�': '憭芯蛹雿𣳇��港�嚗��憟賜�鈭𧢲��澆�蝏����㭠嚗峕�餈嗘遢�𨀣�憟賢末�坔�嚗䔶�憭拐��臭蛹雿删�韏䂿�銝�憭抬���',
    '�曇�': '��捂�芸楛�曇�銝�隡𡁜��扼��瓷�喟頂嚗𣬚尐瘜芣糓蝏坔��菜�瞉～���霈箏��煺�銋���烐��賭��刻��屸�暺㗛臁��雿𨬭����',
    '�西�': '瘛勗鐤��... 頧餉蝠�唳��滩���������嚗峕�隞砌���閬�����劐����蝡见��𡁜�嚗䔶�甈∪蘨韏唬�甇伐�憟賢�嚗跔��',
    '���': '�潘��毺�憭芾悟鈭箸��支�嚗�����厩�憪𥪜��峕��㘾�銝Ｗ銁�烐���嫃嚗峕�瘣䂿移�萄葬雿䭾�摰�賑�见銁瘜亙��䎚����',
    '撟喲�': '撟喲��臬��菜�蝢𡒊�皝𡝗偌����典像瘛∠��亙��峕��堒�摰匧�嚗䔶��臭�蝘漤�撣豢�����賢���銁',
    '�脫�': '隞𠰴予�毺�颲𥡝㜃�艾���撌脩��𡁜��𧼮虜憟賭�嚗𣬚緵�冽���２�曆�嚗屸𡡒銝羓尐�𥕦末憟賜辺銝�閫匧嫃���摰㚁��帋葵憟賣╪����'
  };

  const render = () => {
    const container = document.getElementById('list-treehole');
    const count = document.getElementById('lbl-treehole-count');
    container.innerHTML = '';

    count.textContent = `${list.length} �︶;

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
            ${item.emotion} 繚 ${item.time}
          </div>
        </div>
        <button class="btn-pill btn-delete" data-id="${item.id}">�𣳇膄</button>
      `;
      container.appendChild(el);
    });
  };

  // �㗇𥋘��貌
  document.getElementById('emotions-treehole').addEventListener('click', (e) => {
    if (e.target.classList.contains('emotion-bubble')) {
      document.querySelectorAll('#emotions-treehole .emotion-bubble').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      selectedEmotion = e.target.getAttribute('data-emotion');
    }
  });

  // �閖�鍦�鈭�
  document.getElementById('btn-treehole-submit').addEventListener('click', () => {
    const input = document.getElementById('txt-treehole');
    const text = input.value.trim();
    if (!text) return alert('敹��銝滚虾隞乩蛹蝛箏𣑐嚚�');

    const newItem = {
      id: Date.now().toString(),
      emotion: selectedEmotion,
      content: text,
      time: '隞𠰴予 ' + new Date().toTimeString().slice(0, 5)
    };

    list.unshift(newItem);
    setLocalData('treehole_notes', list);

    // 蝎曄��𧼮�
    document.getElementById('lbl-treehole-reply-content').textContent = replies[selectedEmotion];
    document.getElementById('card-treehole-reply').style.display = 'block';

    input.value = '';
    render();
  });

  // �𣳇膄�閙辺
  document.getElementById('list-treehole').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
      const id = e.target.getAttribute('data-id');
      list = list.filter(item => item.id !== id);
      setLocalData('treehole_notes', list);
      render();
    }
  });

  // 皜�征
  document.getElementById('fab-treehole-clear').addEventListener('click', () => {
    if (confirm('蝖桀�閬��蝛箸��厩�敹��霈啣��梹�')) {
      list = [];
      setLocalData('treehole_notes', list);
      document.getElementById('card-treehole-reply').style.display = 'none';
      render();
    }
  });

  render();
};

// -------------------------------------------------------------
// 12. ���霂埈�璅∪�
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
      listContainer.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-secondary); font-size:13px;">瘝⊥��曉��詨�霂埈�</div>`;
      return;
    }

    filtered.forEach(h => {
      const el = document.createElement('div');
      el.className = 'hymn-item';
      el.innerHTML = `
        <div class="hymn-meta">
          <span class="hymn-number">蝚� ${h.num} 擐�</span>
          <span class="hymn-title">${h.title}</span>
        </div>
        <span class="hymn-arrow">��</span>
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
      detailInfo.textContent = `${hymn.author || '���蝎暸��'} 繚 ���霂埈�蝚� ${hymn.num} 擐飜;
      lyricsContainer.textContent = hymn.lyrics;
      
      dirView.style.display = 'none';
      detailView.style.display = 'block';
    }
  };

  // 撘�郊�瑕�憭㚚� JSON �冽𧋦霂埈��唳旿摨�
  const fetchHymnDatabase = () => {
    if (isLoaded) return;
    const cachedHymns = getLocalData('admin_hymns_db', []);
    if (cachedHymns.length > 0) {
      hymnData = cachedHymns;
      isLoaded = true;
      renderList(searchInput ? searchInput.value : '');
      return;
    }
    
    // 憒��蝻枏�瘝⊥�嚗���𤏸絲�匧�撟嗅��交𧋦�啁�摮�

    if (listContainer) {
      listContainer.innerHTML = `
        <div style="text-align:center; padding:30px 10px; color:var(--text-secondary);">
          <div style="display:inline-block; width:24px; height:24px; border:3px solid var(--theme-light-bg); border-top-color:var(--theme-accent); border-radius:50%; animation: spin 1s linear infinite; margin-bottom:10px;"></div>
          <div style="font-size:12px; font-weight:700;">甇�銁�㰘蝸�冽𧋦���霂埈��唳旿摨�...</div>
        </div>
      `;
    }

    fetch('./hymns_db.json')
      .then(response => {
        if (!response.ok) throw new Error('蝵𤑳��躰秤');
        return response.json();
      })
      .then(data => {
        hymnData = data;
        setLocalData('admin_hymns_db', data);
        isLoaded = true;
        renderList(searchInput ? searchInput.value : '');
      })
      .catch(err => {
        console.warn('霂埈��其髡撘�郊�㰘蝸憭梯揖嚗�歇�芸𢆡�滨漣�舐鍂蝳餌瑪�唳旿��', err);
        hymnData = [
          {
            num: 32,
            title: "憭扯��� (�嗥見憸��) [蝳餌瑪蝻枏�]",
            author: "�匧���",
            lyrics: "1. �嗥見憸��嚗峕���洽�頣�甇方�皛⊥�憭拐�摰㗇�嚗�n銝滩捏雿訫�嚗䔶�霈箔�鈭页�撅硺蜓憭扯��钅��穃���n\n(�舀�)\n銝駁��𡢅�銝駁��𡢅�銝餌鍂憭扯��钅��𡢅�\n�烐�敹惩�頝罸��睲蜓嚗��銝餃之�賣�憸����"
          },
          {
            num: 120,
            title: "憟���拙� (Amazing Grace) [蝳餌瑪蝻枏�]",
            author: "蝥衣膩繚�偦▼",
            lyrics: "1. 憟���拙�嚗䔶�蝑厩��頣��𤑳蔽撌脣�韏血�嚗鞸n�齿�憭曹葷嚗䔶�鋡怠粉�痹��𡒊尐隞𠰴��贝���"
          }
        ];
        isLoaded = true;
        renderList(searchInput ? searchInput.value : '');
      });
  };

  // 蝏穃�頝舐眏��揢�園�甈∠��餃�頧�
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

  // �瑟鰵�園俈銝ｇ�憒���臬��滨��嘥�璅∪�嚗諹䌊�冽���
  if (localStorage.getItem('activeModule') === 'hymns') {
    fetchHymnDatabase();
  }
};

// -------------------------------------------------------------
// �嘥��硋���
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
// 13. �典��𤾸蝱蝞∠�璅∪� (PC 銝枏�)
// -------------------------------------------------------------
const initAdmin = () => {
  // 蝞∠��𤾸蝱 TAB ��揢
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



  // 1. ���霂埈�蝞∠�
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
        <span class="admin-list-item-title">蝚� ${h.num} 擐� - ${h.title} (${h.author})</span>
        <span class="admin-list-item-action" data-index="${index}">�</span>
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
        return alert('霂瑕��游‵�躰�甇𣬚��瑯���憸睃�甇諹�甇��嚗�');
      }

      const hymns = getLocalData('admin_hymns_db', []);
      if (hymns.some(h => h.num === num)) {
        return alert('撌脣��刻砲蝻硋噡 of 霂埈�嚗�');
      }

      hymns.push({ num, title, author: author || '���蝎暸��', lyrics });
      hymns.sort((a, b) => a.num - b.num);
      setLocalData('admin_hymns_db', hymns);

      numInput.value = '';
      titleInput.value = '';
      authorInput.value = '';
      lyricsInput.value = '';

      refreshAdminHymns();
      alert('霂埈�敶訫��𣂼�嚗�𧋦�啣歇靽嘥�嚗�縧�𨅯𧁋敺坿�甇𢞖�肽��訫朖�舐凒�仿�閫��');
    });
  }

  // 2. 銋衣�蝞∠�
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
        <span class="admin-list-item-action" data-index="${index}">�</span>
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
        return alert('霂瑕��游‵�嗘髡蝐滢縑�臭�霂閗粉甇��嚗�');
      }

      const books = getLocalData('book_list', []);
      books.push({
        title: `��${title.replace(/[�𨳍�尜/g, '')}�㞗,
        author,
        tags: ['蝏誩��萎耨', '�冽��刻�'],
        progress: 0,
        month: '�冽�銝枏�',
        url: '#',
        sample: preview
      });

      setLocalData('book_list', books);

      titleInput.value = '';
      authorInput.value = '';
      descInput.value = '';
      previewInput.value = '';

      refreshAdminBooks();
      alert('銋衣��刻��𣂼�嚗�');
    });
  }

  // 3. RSS & �𡁜恥蝞∠�
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
        alert('RSS 霈ａ�皞𣂼𧑐���湔鰵�𣂼�嚗�');
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
      const source = document.getElementById('txt-admin-blog-source').value.trim() || '蝞∠���';
      const desc = document.getElementById('txt-admin-blog-desc').value.trim();
      const content = document.getElementById('txt-admin-blog-content').value.trim();

      if (!title || !desc || !content) {
        return alert('霂瑕��游‵�坔�摰Ｘ�蝡䭾�憸塩���閬��甇����捆嚗�');
      }

      const blogs = getLocalData('admin_blogs_db', []);
      blogs.unshift({
        id: Date.now().toString(),
        cat,
        author: `@${source}`,
        title,
        desc,
        time: '�𡁜�',
        content
      });

      setLocalData('admin_blogs_db', blogs);

      document.getElementById('txt-admin-blog-title').value = '';
      document.getElementById('txt-admin-blog-cat').value = '';
      document.getElementById('txt-admin-blog-source').value = '';
      document.getElementById('txt-admin-blog-desc').value = '';
      document.getElementById('txt-admin-blog-content').value = '';

      alert('�𡁜恥敶訫��𣂼�嚗���Ｗ��剔��圈鉟 �� �𡁜恥��掩 �喳虾�湔𦻖��粉嚗�');
    });
  }

  // 4. 銝芯犖靽⊥�霈曄蔭
  const profileNameInput = document.getElementById('txt-admin-profile-name');
  const fileAvatarUpload = document.getElementById('file-admin-avatar-upload');
  const avatarPreview = document.getElementById('admin-profile-avatar-preview');
  const btnSaveProfile = document.getElementById('btn-admin-save-profile');

  // �嘥��碶葵鈭箄��蹱㺭��
  if (profileNameInput) profileNameInput.value = localStorage.getItem('admin_profile_name') || '��極';
  
  let selectedAvatarUrl = localStorage.getItem('admin_profile_avatar') || 'https://img.icons8.com/color/512/user-male-circle.png';
  if (avatarPreview) {
    avatarPreview.style.backgroundImage = `url('${selectedAvatarUrl}')`;
  }

  // �穃𨯬�砍𧑐憭游���辣銝𠹺�嚗�僎雿輻鍂 Canvas �典�蝡臬撩�芾��讠憬銝� 128x128 �讐�
  if (fileAvatarUpload) {
    fileAvatarUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // �拍鍂 Canvas 鋆��銝箏𤐄摰𡁶� 128x128 ��耦憭游��唳旿
          const canvas = document.createElement('canvas');
          canvas.width = 128;
          canvas.height = 128;
          const ctx = canvas.getContext('2d');

          // 霈∠�蝑㗇�撅�葉甇�䲮敶�
          const size = Math.min(img.width, img.height);
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;

          ctx.drawImage(img, sx, sy, size, size, 0, 0, 128, 128);

          // �讠憬銝� JPEG base64 (��捶霈曄蔭銝� 0.85)
          const compressedData = canvas.toDataURL('image/jpeg', 0.85);

          // �湔鰵�嗆����屸𢒰
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
        return alert('姓名不能为空！');
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

  // �𠒣 �唳旿��誘憭�遢撖澆枂銝擧�憭滚紡��btn-admin-export-data');
  const btnImportData = document.getElementById('btn-admin-import-data');
  const txtImportCode = document.getElementById('txt-admin-import-code');

  if (btnExportData) {
    btnExportData.addEventListener('click', () => {
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
        const jsonStr = JSON.stringify(backupObj);
        const base64Code = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        }));

        navigator.clipboard.writeText(base64Code).then(() => {
          alert('🎉 备份成功！已将你所有的打卡和资料数据口令成功复制到剪贴板。请前往桌面 App 的设置页粘贴并恢复。');
        }).catch(err => {
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
        const jsonStr = decodeURIComponent(atob(codeVal).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const backupObj = JSON.parse(jsonStr);

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

  // 5. 零散资源添加与管理 (添加+管理)
  const listAdminSpeech = document.getElementById('list-admin-speech');
  const btnAddSpeech = document.getElementById('btn-admin-add-speech');

  // 刷新自定义口语列表
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
  };listAdminQuotes.appendChild(item);
    });
  };

  // �瑟鰵�芸�銋匧藁霂剖蘂摮𣂼�銵�
  const refreshAdminSpeech = () => {
    if (!listAdminSpeech) return;
    listAdminSpeech.innerHTML = '';
    const customSpeech = getLocalData('custom_speech_phrases', []);
    if (customSpeech.length === 0) {
      listAdminSpeech.innerHTML = '<div style="font-size:11px; color:var(--text-secondary); text-align:center; padding:10px;">����芸�銋匧藁霂哨��臬銁銝𦠜䲮敶訫���</div>';
      return;
    }
    const langNames = { en: '�梯祗', es: '镼輯祗', ja: '�亥祗', fr: '瘜閗祗' };
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
          <div style="font-size:9px; color:var(--theme-accent); margin-top:2px; font-weight:700; text-transform:uppercase;">霂剔�: ${langNames[s.lang] || s.lang}</div>
        </div>
        <button class="btn-pill" style="background:#FFEbee; color:#D32F2F; border:none; padding:4px 8px; font-size:10px; cursor:pointer; font-weight:700; border-radius:4px;">�𣳇膄</button>
      `;
      item.querySelector('button').addEventListener('click', () => {
        if (confirm('蝖桀�閬���方��亙藁霂剔�銋惩蘂�梹�')) {
          customSpeech.splice(index, 1);
          setLocalData('custom_speech_phrases', customSpeech);
          refreshAdminSpeech();
          renderSpeechModule();
        }
      });
      listAdminSpeech.appendChild(item);
    });
  };

  // 蝏穃��穃蘂敶訫�靽嘥�
  if (btnAddQuote) {
    const newBtn = btnAddQuote.cloneNode(true);
    btnAddQuote.parentNode.replaceChild(newBtn, btnAddQuote);
    newBtn.addEventListener('click', () => {
      const quoteTextVal = document.getElementById('txt-admin-quote-text').value.trim();
      const quoteSourceVal = document.getElementById('txt-admin-quote-source').value.trim() || '雿𡁜�';

      if (!quoteTextVal) {
        return alert('�穃蘂甇��銝滩�銝箇征嚗�');
      }

      const customQuotes = getLocalData('custom_bible_quotes', []);
      customQuotes.push({ text: quoteTextVal, source: quoteSourceVal });
      setLocalData('custom_bible_quotes', customQuotes);

      document.getElementById('txt-admin-quote-text').value = '';
      document.getElementById('txt-admin-quote-source').value = '';

      refreshAdminQuotes();
      alert('�� �萎耨�穃蘂靽嘥��𣂼�嚗�歇摮睃�雿删��穃蘂韏��摨瓐��');
      
      // �峕郊�瑟鰵霂餌��枏㨃�∠�銝羓�隞𦠜𠯫�穃蘂
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

  // 蝏穃���祗敶訫�靽嘥�
  if (btnAddSpeech) {
    const newBtn = btnAddSpeech.cloneNode(true);
    btnAddSpeech.parentNode.replaceChild(newBtn, btnAddSpeech);
    newBtn.addEventListener('click', () => {
      const langVal = document.getElementById('sel-admin-speech-lang').value;
      const speechTextVal = document.getElementById('txt-admin-speech-text').value.trim();
      const speechCnVal = document.getElementById('txt-admin-speech-cn').value.trim();

      if (!speechTextVal || !speechCnVal) {
        return alert('��祗����䔶葉��蕃霂睲��賭蛹蝛綽�');
      }

      const customSpeech = getLocalData('custom_speech_phrases', []);
      customSpeech.push({ lang: langVal, text: speechTextVal, cn: speechCnVal });
      setLocalData('custom_speech_phrases', customSpeech);

      document.getElementById('txt-admin-speech-text').value = '';
      document.getElementById('txt-admin-speech-cn').value = '';

      refreshAdminSpeech();
      renderSpeechModule();
      alert('�� ��祗蝏���乩�摮䀹����撌脣��亙笆摨磰祗閮�摮虫�摨瓐��');
    });
  }

  // 擐𡝗活餈鞱�
  refreshAdminHymns();
  refreshAdminBooks();
  refreshAdminQuotes();
  refreshAdminSpeech();
};


  initHymns();
  initAdmin();
  updateProfileUI();
});