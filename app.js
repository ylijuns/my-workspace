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

  const btnExportData = document.getElementById('btn-admin-export-data');
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

  if (btnAddSpeech) {
    const newBtn = btnAddSpeech.cloneNode(true);
    btnAddSpeech.parentNode.replaceChild(newBtn, btnAddSpeech);
    newBtn.addEventListener('click', () => {
      const langVal = document.getElementById('sel-admin-speech-lang').value;
      const speechTextVal = document.getElementById('txt-admin-speech-text').value.trim();
      const speechCnVal = document.getElementById('txt-admin-speech-cn').value.trim();

      if (!speechTextVal || !speechCnVal) {
        return alert('口语内容和中文翻译均不能为空！');
      }

      const customSpeech = getLocalData('custom_speech_phrases', []);
      customSpeech.push({ lang: langVal, text: speechTextVal, cn: speechCnVal });
      setLocalData('custom_speech_phrases', customSpeech);

      document.getElementById('txt-admin-speech-text').value = '';
      document.getElementById('txt-admin-speech-cn').value = '';

      refreshAdminSpeech();
      renderSpeechModule();
      alert('🎉 自定义口语句子保存成功！');
    });
  }

  // 首次运行
  refreshAdminHymns();
  refreshAdminBooks();
  refreshAdminSpeech();

;
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