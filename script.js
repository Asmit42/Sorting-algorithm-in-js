 let bars = [];
  const TOTALBAR = 30;
  let isPaused = false;
  let stopSorting = false;
  let pausePromise;
 
function BARCREATE() {
  const container = document.getElementById('bars-container');
  for (let i = 0; i < TOTALBAR; i++) {
    const barWrapper = document.createElement('div');
    barWrapper.className = 'bar-wrapper';

    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${Math.floor(Math.random() * 200) + 10}px`;

    const value = document.createElement('div');
    value.className = 'bar-value';
    value.textContent = bar.style.height.replace('px', '');

    barWrapper.appendChild(bar);
    barWrapper.appendChild(value);

    container.appendChild(barWrapper);
    bars.push({ bar, value });
  }
}

function randomizeArray() {
  bars.forEach(({ bar, value }) => {
    const newHeight = `${Math.floor(Math.random() * 200) + 10}px`;
    bar.style.height = newHeight;
    value.textContent = newHeight.replace('px', '');
  });
}

async function insertionSort() {
  isPaused = false;
  stopSorting = false;
  const n = bars.length;
  for (let i = 1; i < n && !stopSorting; i++) {
    const keyHeight = parseInt(bars[i].bar.style.height);
    let j = i - 1;

    while (j >= 0 && parseInt(bars[j].bar.style.height) > keyHeight) {
      bars[j + 1].bar.style.height = bars[j].bar.style.height;
      bars[j + 1].value.textContent = bars[j].value.textContent;
      j = j - 1;
      await delay(50);
      if (isPaused) {
        await pause();
      }
    }

    bars[j + 1].bar.style.height = `${keyHeight}px`;
    bars[j + 1].value.textContent = `${keyHeight}px`;
  }
}

async function selectionSort() {
  isPaused = false;
  stopSorting = false;
  const n = bars.length;
  for (let i = 0; i < n - 1 && !stopSorting; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (parseInt(bars[j].bar.style.height) < parseInt(bars[minIdx].bar.style.height)) {
        minIdx = j;
      }
    }
    const tempHeight = bars[minIdx].bar.style.height;
    const tempValue = bars[minIdx].value.textContent;
    bars[minIdx].bar.style.height = bars[i].bar.style.height;
    bars[minIdx].value.textContent = bars[i].value.textContent;
    bars[i].bar.style.height = tempHeight;
    bars[i].value.textContent = tempValue;
    await delay(50);
  }
}

async function bubbleSort() {
  isPaused = false;
  stopSorting = false;
  const n = bars.length;
  for (let i = 0; i < n - 1 && !stopSorting; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (parseInt(bars[j].bar.style.height) > parseInt(bars[j + 1].bar.style.height)) {
        await swap(j, j + 1);
      }
    }
  }
}

async function quickSort(start = 0, end = bars.length - 1) {
  if (start < end && !stopSorting) {
    const partitionIndex = await partition(start, end);
    await Promise.all([
      quickSort(start, partitionIndex - 1),
      quickSort(partitionIndex + 1, end)
    ]);
  }
}

async function partition(start, end) {
  const pivotHeight = parseInt(bars[end].bar.style.height);
  let i = start - 1;

  for (let j = start; j < end; j++) {
    if (parseInt(bars[j].bar.style.height) < pivotHeight) {
      i++;
      await swap(i, j);
    }
  }

  await swap(i + 1, end);

  return i + 1;
}

async function mergeSort() {
  await mergeSortRecursive(0, bars.length - 1);
}

async function mergeSortRecursive(start, end) {
  if (start < end && !stopSorting) {
    const mid = Math.floor((start + end) / 2);
    await Promise.all([
      mergeSortRecursive(start, mid),
      mergeSortRecursive(mid + 1, end),
      merge(start, mid, end)
    ]);
  }
}

async function merge(start, mid, end) {
  const n1 = mid - start + 1;
  const n2 = end - mid;

  const leftArray = new Array(n1);
  const rightArray = new Array(n2);

  for (let i = 0; i < n1; i++) {
    leftArray[i] = {
      height: bars[start + i].bar.style.height,
      value: bars[start + i].value.textContent
    };
  }

  for (let j = 0; j < n2; j++) {
    rightArray[j] = {
      height: bars[mid + 1 + j].bar.style.height,
      value: bars[mid + 1 + j].value.textContent
    };
  }

  let i = 0;
  let j = 0;
  let k = start;

  while (i < n1 && j < n2) {
    if (parseInt(leftArray[i].height) <= parseInt(rightArray[j].height)) {
      bars[k].bar.style.height = leftArray[i].height;
      bars[k].value.textContent = leftArray[i].value;
      i++;
    } else {
      bars[k].bar.style.height = rightArray[j].height;
      bars[k].value.textContent = rightArray[j].value;
      j++;
    }

    await delay(50);
    k++;
  }

  while (i < n1) {
    bars[k].bar.style.height = leftArray[i].height;
    bars[k].value.textContent = leftArray[i].value;
    await delay(50);
    i++;
    k++;
  }

  while (j < n2) {
    bars[k].bar.style.height = rightArray[j].height;
    bars[k].value.textContent = rightArray[j].value;
    await delay(50);
    j++;
    k++;
  }
}

async function shellSort() {
  const n = bars.length;
  for (let gap = Math.floor(n / 2); gap > 0 && !stopSorting; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n && !stopSorting; i++) {
      const tempHeight = bars[i].bar.style.height;
      const tempValue = bars[i].value.textContent;
      let j = i;
      while (j >= gap && parseInt(bars[j - gap].bar.style.height) > parseInt(tempHeight)) {
        await swap(j - gap, j);
        j -= gap;
      }
      bars[j].bar.style.height = tempHeight;
      bars[j].value.textContent = tempValue;
    }
  }
}


document.getElementById('randomize-button').addEventListener('click', randomizeArray);
document.getElementById('insertion-sort-button').addEventListener('click', insertionSort);
document.getElementById('selection-sort-button').addEventListener('click', selectionSort);
document.getElementById('bubble-sort-button').addEventListener('click', bubbleSort);
document.getElementById('quick-sort-button').addEventListener('click', () => quickSort());
document.getElementById('merge-sort-button').addEventListener('click', mergeSort);
document.getElementById('shell-sort-button').addEventListener('click', shellSort);
document.getElementById('change-size-button').addEventListener('click', changeSize);
document.getElementById('pause-button').addEventListener('click', togglePause);
document.getElementById('stop-button').addEventListener('click', stop);


async function swap(index1, index2) {
  const tempHeight = bars[index1].bar.style.height;
  const tempValue = bars[index1].value.textContent;
  bars[index1].bar.style.height = bars[index2].bar.style.height;
  bars[index1].value.textContent = bars[index2].value.textContent;
  bars[index2].bar.style.height = tempHeight;
  bars[index2].value.textContent = tempValue;
  await delay(50);
}

function togglePause() {
  isPaused = !isPaused;
  if (!isPaused) {
    resume();
  }
}

function pause() {
  return new Promise(resolve => {
    pausePromise = resolve;
  });
}

function resume() {
  if (pausePromise) {
    pausePromise();
    pausePromise = null;
  }
}

function stop() {
  stopSorting = true;
  isPaused = false;
  resume();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function changeSize() {
  bars.forEach(({ bar }) => {
    const currentHeight = parseInt(bar.style.height);
    bar.style.height = `${currentHeight / 2}px`;
  });
}

BARCREATE();