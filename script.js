const STORAGE_KEY = 'heroTrainingState';

const rankTable = [
  { minDay: 1, label: 'Civil' },
  { minDay: 10, label: 'Aprendiz de Herói' },
  { minDay: 25, label: 'Classe C' },
  { minDay: 45, label: 'Classe B' },
  { minDay: 65, label: 'Classe A' },
  { minDay: 85, label: 'Classe S' },
];

const motivationPhrases = [
  'Cada repetição é um passo rumo ao nível lendário! ⚡',
  'Herói de verdade treina até quando a preguiça ataca! ��',
  'Seu poder aumenta a cada tarefa concluída! 🏆',
  'Hoje você venceu o maior inimigo: desistir. 👊',
  'Seu futuro eu agradece pelo treino de hoje! 🔥',
];

const classicWorkout = [
  '100 flexões',
  '100 abdominais',
  '100 agachamentos',
  '10 km de corrida',
];

const adaptedWorkout = [
  '20 flexões',
  '20 abdominais',
  '20 agachamentos',
  '2 km de corrida',
];

const state = loadState();

const dayInput = document.getElementById('dayInput');
const adaptedMode = document.getElementById('adaptedMode');
const checklist = document.getElementById('checklist');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const modeDescription = document.getElementById('modeDescription');
const motivationText = document.getElementById('motivationText');
const rankLabel = document.getElementById('rankLabel');
const calendar = document.getElementById('calendar');
const finalMessage = document.getElementById('finalMessage');
const resetButton = document.getElementById('resetButton');

init();

function init() {
  dayInput.value = state.day;
  adaptedMode.checked = state.adapted;
  renderChecklist();
  renderProgress();
  renderRank();
  renderCalendar();
  renderFinalMessage();

  dayInput.addEventListener('change', handleDayChange);
  adaptedMode.addEventListener('change', handleModeToggle);
  resetButton.addEventListener('click', handleReset);
}

function getWorkout() {
  return state.adapted ? adaptedWorkout : classicWorkout;
}

function getCurrentTasks() {
  if (!state.tasksByDay[state.day]) {
    state.tasksByDay[state.day] = [false, false, false, false];
  }
  return state.tasksByDay[state.day];
}

function renderChecklist() {
  checklist.innerHTML = '';
  const tasks = getCurrentTasks();

  getWorkout().forEach((taskLabel, index) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'check-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = tasks[index];
    checkbox.addEventListener('change', () => {
      tasks[index] = checkbox.checked;
      maybeMarkDayDone();
      renderProgress();
      renderCalendar();
      renderFinalMessage();
      showMotivation();
      saveState();
    });

    const text = document.createElement('span');
    text.textContent = taskLabel;

    wrapper.append(checkbox, text);
    checklist.appendChild(wrapper);
  });

  modeDescription.textContent = state.adapted
    ? 'Modo adaptado ativo: 20/20/20 + 2 km para construir constância.'
    : 'Modo clássico ativo: 100/100/100 + 10 km.';
}

function renderProgress() {
  const tasks = getCurrentTasks();
  const doneCount = tasks.filter(Boolean).length;
  const progress = Math.round((doneCount / tasks.length) * 100);
  progressText.textContent = `${progress}%`;
  progressFill.style.width = `${progress}%`;
  progressFill.parentElement.setAttribute('aria-valuenow', String(progress));
}

function renderRank() {
  const currentRank = [...rankTable].reverse().find((rank) => state.day >= rank.minDay);
  rankLabel.textContent = currentRank ? currentRank.label : 'Civil';
}

function renderCalendar() {
  calendar.innerHTML = '';

  for (let day = 1; day <= 100; day += 1) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';
    if (day === state.day) {
      cell.classList.add('current');
    }
    if (state.completedDays.includes(day)) {
      cell.classList.add('done');
    }
    cell.textContent = day;
    calendar.appendChild(cell);
  }
}

function renderFinalMessage() {
  const completedDay100 = state.completedDays.includes(100);
  finalMessage.classList.toggle('hidden', !completedDay100);
}

function handleDayChange() {
  const parsed = Number(dayInput.value);
  const clamped = Number.isFinite(parsed) ? Math.min(100, Math.max(1, Math.trunc(parsed))) : 1;
  state.day = clamped;
  dayInput.value = clamped;
  renderChecklist();
  renderProgress();
  renderRank();
  renderCalendar();
  renderFinalMessage();
  saveState();
}

function handleModeToggle() {
  state.adapted = adaptedMode.checked;
  renderChecklist();
  renderProgress();
  saveState();
}

function maybeMarkDayDone() {
  const allDone = getCurrentTasks().every(Boolean);
  const alreadyDone = state.completedDays.includes(state.day);

  if (allDone && !alreadyDone) {
    state.completedDays.push(state.day);
    state.completedDays.sort((a, b) => a - b);
  }
  if (!allDone && alreadyDone) {
    state.completedDays = state.completedDays.filter((d) => d !== state.day);
  }
}

function showMotivation() {
  const randomIndex = Math.floor(Math.random() * motivationPhrases.length);
  motivationText.textContent = motivationPhrases[randomIndex];
}

function handleReset() {
  const confirmed = window.confirm('Deseja realmente reiniciar todo o progresso?');
  if (!confirmed) {
    return;
  }

  state.day = 1;
  state.adapted = false;
  state.tasksByDay = {};
  state.completedDays = [];
  motivationText.textContent = 'Progresso resetado. Recomece com foco total!';

  dayInput.value = 1;
  adaptedMode.checked = false;
  renderChecklist();
  renderProgress();
  renderRank();
  renderCalendar();
  renderFinalMessage();
  saveState();
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      day: 1,
      adapted: false,
      tasksByDay: {},
      completedDays: [],
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      day: sanitizeDay(parsed.day),
      adapted: Boolean(parsed.adapted),
      tasksByDay: sanitizeTasksByDay(parsed.tasksByDay),
      completedDays: sanitizeCompletedDays(parsed.completedDays),
    };
  } catch {
    return {
      day: 1,
      adapted: false,
      tasksByDay: {},
      completedDays: [],
    };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sanitizeDay(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 1;
  }
  return Math.min(100, Math.max(1, Math.trunc(numeric)));
}

function sanitizeTasksByDay(tasksByDay) {
  if (!tasksByDay || typeof tasksByDay !== 'object') {
    return {};
  }

  const safe = {};
  Object.keys(tasksByDay).forEach((key) => {
    const day = sanitizeDay(key);
    const entry = Array.isArray(tasksByDay[key]) ? tasksByDay[key].slice(0, 4) : [];
    safe[day] = [0, 1, 2, 3].map((index) => Boolean(entry[index]));
  });

  return safe;
}

function sanitizeCompletedDays(days) {
  if (!Array.isArray(days)) {
    return [];
  }
  const unique = new Set(days.map(sanitizeDay));
  return [...unique].sort((a, b) => a - b);
}
