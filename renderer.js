const listBtn = document.getElementById('list-btn');
const dirPath = document.getElementById('dir-path');
const dirList = document.getElementById('dir-list');
const sysBtn = document.getElementById('sys-btn');
const sysBody = document.querySelector('#sys-table tbody');

// Задание 3: вывод содержимого каталога
listBtn.addEventListener('click', async () => {
  dirList.innerHTML = '';
  try {
    const { path, entries } = await window.api.listDir('.');
    dirPath.textContent = path;
    entries
      .sort((a, b) => b.isDir - a.isDir || a.name.localeCompare(b.name))
      .forEach(e => {
        const li = document.createElement('li');
        li.textContent = (e.isDir ? '📁 ' : '📄 ') + e.name;
        if (e.isDir) li.classList.add('dir');
        dirList.appendChild(li);
      });
  } catch (err) {
    dirPath.textContent = 'Ошибка: ' + err.message;
  }
});

// Задание 4 (вариант 2): панель «Информация о системе»
const GB = 1024 ** 3;

async function showSystemInfo() {
  const info = await window.api.getSystemInfo();
  const rows = [
    ['Платформа', info.platform],
    ['Версия ядра ОС', info.release],
    ['Архитектура', info.arch],
    ['Число ядер (логических)', info.cpuCount],
    ['Процессор', info.cpuModel],
    ['Оперативная память', (info.totalMem / GB).toFixed(1) + ' ГБ'],
    ['Свободно', (info.freeMem / GB).toFixed(1) + ' ГБ']
  ];
  sysBody.innerHTML = '';
  rows.forEach(([key, value]) => {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    const td = document.createElement('td');
    th.textContent = key;
    td.textContent = value;
    tr.append(th, td);
    sysBody.appendChild(tr);
  });
}

sysBtn.addEventListener('click', showSystemInfo);
showSystemInfo();
