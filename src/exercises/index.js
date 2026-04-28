// Exercise registry — order here defines linear navigation.

import drawingOrder    from './drawing-order.js';
import barOrientation  from './bar-orientation.js';
import enterVsJoin     from './enter-vs-join.js';
import styleVsAttr     from './style-vs-attr.js';
import dataAsObjects   from './data-as-objects.js';
import loadingData     from './loading-data.js';
import twoScales       from './two-scales.js';
import scalebandEx     from './scaleband.js';
import axes            from './axes.js';
import colorByCategory from './color-by-category.js';
import groupPerDatum   from './group-per-datum.js';
import smiley          from './smiley.js';
import lineChart       from './line-chart.js';
import bonus           from './bonus.js';

const raw = [
  drawingOrder,
  barOrientation,
  enterVsJoin,
  styleVsAttr,
  dataAsObjects,
  loadingData,
  twoScales,
  scalebandEx,
  axes,
  colorByCategory,
  groupPerDatum,
  smiley,
  lineChart,
  bonus
];

/** Normalize an exercise config so it always has a tasks[] array.
 *  Legacy single-task exercises (with starterCode / hint / solution at top level)
 *  are auto-wrapped into a single-element tasks array. */
function normalize(ex) {
  if (Array.isArray(ex.tasks) && ex.tasks.length > 0) return ex;
  // Legacy shape — wrap in a synthetic single task.
  return {
    id: ex.id,
    title: ex.title,
    preTask: ex.preTask,
    postTask: ex.postTask,
    tasks: [
      {
        id: `${ex.id}__t1`,
        title: '',
        description: '',
        starterCode: ex.starterCode ?? '',
        lockedRanges: ex.lockedRanges ?? [],
        hint: ex.hint,
        solution: ex.solution,
        autorun: ex.autorun,
        iframe: ex.iframe,
        check: ex.check
      }
    ]
  };
}

export const exercises = raw.map(normalize);
export const exerciseMap = Object.fromEntries(exercises.map((e) => [e.id, e]));

/** Returns { exercise, prev, next, index, total } for an exercise id. */
export function findExercise(id) {
  const idx = exercises.findIndex((e) => e.id === id);
  if (idx < 0) return null;
  return {
    exercise: exercises[idx],
    prev: idx > 0 ? { id: exercises[idx - 1].id, title: exercises[idx - 1].title } : null,
    next: idx < exercises.length - 1 ? { id: exercises[idx + 1].id, title: exercises[idx + 1].title } : null,
    index: idx,
    total: exercises.length
  };
}
