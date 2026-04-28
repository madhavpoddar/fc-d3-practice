// localStorage-backed progress store.
// Strictly per-browser. No login. One student cannot see another's progress.
// Session export/import/clear lets students carry progress between machines.

const STORAGE_KEY = 'd3-practice-tasks::v1';
const SESSION_VERSION = 1;

const emptyState = () => ({
  version: SESSION_VERSION,
  savedAt: new Date().toISOString(),
  lastVisited: null,
  // exercises[exerciseId] = { completed, tasks: { [taskId]: { hintRevealed, solutionRevealed, code } } }
  exercises: {}
});

const emptyExercise = () => ({ completed: false, tasks: {} });
const emptyTask = () => ({ hintRevealed: false, solutionRevealed: false, code: null });

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function readState() {
  if (!isBrowser()) return emptyState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    if (parsed?.version !== SESSION_VERSION) return emptyState();
    return parsed;
  } catch {
    return emptyState();
  }
}

function writeState(state) {
  if (!isBrowser()) return;
  state.savedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getExerciseProgress(exerciseId) {
  const state = readState();
  return { ...emptyExercise(), ...(state.exercises[exerciseId] ?? {}) };
}

export function getTaskProgress(exerciseId, taskId) {
  const ex = getExerciseProgress(exerciseId);
  return { ...emptyTask(), ...(ex.tasks?.[taskId] ?? {}) };
}

export function updateTaskProgress(exerciseId, taskId, patch) {
  const state = readState();
  const ex = state.exercises[exerciseId] ?? emptyExercise();
  ex.tasks = ex.tasks ?? {};
  const cur = { ...emptyTask(), ...(ex.tasks[taskId] ?? {}) };
  ex.tasks[taskId] = { ...cur, ...patch };
  state.exercises[exerciseId] = ex;
  writeState(state);
}

export function markExerciseCompleted(exerciseId, completed = true) {
  const state = readState();
  const ex = state.exercises[exerciseId] ?? emptyExercise();
  ex.completed = completed;
  state.exercises[exerciseId] = ex;
  writeState(state);
}

export function setLastVisited(exerciseId) {
  const state = readState();
  state.lastVisited = exerciseId;
  writeState(state);
}

export function exportSession() {
  const state = readState();
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `d3-session-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importSession(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (parsed?.version !== SESSION_VERSION) {
    throw new Error(`Unsupported session version: ${parsed?.version}`);
  }
  if (!parsed.exercises || typeof parsed.exercises !== 'object') {
    throw new Error('Session file is missing exercises object');
  }
  writeState(parsed);
}

export function clearSession() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}
