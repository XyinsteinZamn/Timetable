// 📅 Final script.js — Daily Timetable Tracker with Accurate Timing

// === Utility Functions ===
function formatTime(date) {
  return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return (h > 0 ? `${h} hour${h > 1 ? 's' : ''} ` : '') + `${m} minute${m !== 1 ? 's' : ''}`;
}

function getCurrentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

// === Time & Date Bar ===
function updateTimeBar() {
  const now = new Date();
  document.getElementById("timeDateBar").innerText = `📆 ${now.toDateString()} | 🕒 ${formatTime(now)}`;
}
setInterval(updateTimeBar, 1000);
updateTimeBar();

// === Timetable Data (Minutes from Midnight) ===
const timetableData = {
  holiday: [
    { label: "🛌 Wake and freshen up", time: "6:50 AM – 7:00 AM", start: 410, end: 420 },
    { label: "📺 Watch something", time: "7:00 AM – 8:00 AM", start: 420, end: 480 },
    { label: "😌 Free time", time: "8:00 AM – 8:15 AM", start: 480, end: 495 },
    { label: "📚 Study Session 1", time: "8:15 AM – 9:25 AM", start: 495, end: 565 },
    { label: "☕ Break", time: "9:25 AM – 9:45 AM", start: 565, end: 585 },
    { label: "📖 Study Session 2", time: "9:45 AM – 10:45 AM", start: 585, end: 645 },
    { label: "🛁 Bath", time: "10:45 AM – 11:10 AM", start: 645, end: 670 },
    { label: "🍽️ Eat breakfast", time: "11:15 AM – 11:45 AM", start: 675, end: 705 },
    { label: "📖 Study Session 3", time: "11:45 AM – 12:55 PM", start: 705, end: 775 },
    { label: "😌 Free time", time: "12:55 PM – 1:15 PM", start: 775, end: 795 },
    { label: "📖 Study Session 4", time: "1:15 PM – 2:30 PM", start: 795, end: 870 },
    { label: "🍛 Lunch", time: "2:30 PM – 4:00 PM", start: 870, end: 960 },
    { label: "📝 Homework", time: "4:00 PM – 5:00 PM", start: 960, end: 1020 },
    { label: "🏋️ Workout", time: "5:00 PM – 5:30 PM", start: 1020, end: 1050 },
    { label: "🏀 Play Outside (optional)", time: "5:30 PM – 7:30 PM", start: 1050, end: 1170 },
    { label: "😌 Free Time", time: "7:30 PM – 8:00 PM", start: 1170, end: 1200 },
    { label: "📝 Remaining homework / Study Session 5", time: "8:00 PM – 9:00 PM", start: 1200, end: 1260 },
    { label: "🍽️ Dinner", time: "9:00 PM – 10:30 PM", start: 1260, end: 1350 },
    { label: "🔁 Revision", time: "10:30 PM – 11:10 PM", start: 1350, end: 1410 }
  ],
  school: [
    { label: "🛌 Wake Up", time: "5:00 AM – 5:10 AM", start: 300, end: 310 },
    { label: "📚 Study Session 1", time: "5:10 AM – 6:20 AM", start: 310, end: 380 },
    { label: "🏫 School (No checkbox)", time: "6:20 AM – 3:00 PM", noCheckbox: true },
    { label: "🍛 Lunch", time: "3:00 PM – 3:40 PM", start: 900, end: 940 },
    { label: "🏋️ Workout", time: "3:45 PM – 4:30 PM", start: 945, end: 990 },
    { label: "😌 Relax", time: "4:30 PM – 5:30 PM", start: 990, end: 1050 },
    { label: "📚 Study Session 2", time: "5:30 PM – 6:50 PM", start: 1050, end: 1130 },
    { label: "☕ Break", time: "6:50 PM – 7:10 PM", start: 1130, end: 1150 },
    { label: "📝 Homework / Study Session 3", time: "7:10 PM – 8:10 PM", start: 1150, end: 1230 },
    { label: "☕ Break", time: "8:10 PM – 8:30 PM", start: 1230, end: 1250 },
    { label: "📖 Study Session 3 / 4", time: "8:30 PM – 9:30 PM", start: 1250, end: 1310 },
    { label: "🍽️ Dinner", time: "9:30 PM – 10:30 PM", start: 1290, end: 1350 }
  ]
};

let taskStatus = [];

// === Rendering Timetable ===
function renderTimetable(dayType) {
  const container = document.getElementById("timetableContainer");
  container.innerHTML = "";
  const tasks = timetableData[dayType];
  const savedData = JSON.parse(localStorage.getItem("todayTasks") || "{}");
  taskStatus = savedData[dayType] || Array(tasks.length).fill(null);

  let earlyStart = 0, lateStart = 0, earlyEnd = 0, lateEnd = 0;

  tasks.forEach((task, i) => {
    const div = document.createElement("div");
    div.className = "task-block";
    div.innerHTML = `<strong>${task.label}</strong> - <span>${task.time}</span>`;

    if (!task.noCheckbox) {
      const status = taskStatus[i] || { started: false, ended: false, early: 0, late: 0, endedEarly: 0, endedLate: 0 };
      div.innerHTML += `
        <br>
        <label>Start <input type="checkbox" data-type="start" data-index="${i}" ${status.started ? "checked" : ""}></label>
        <label>End <input type="checkbox" data-type="end" data-index="${i}" ${status.ended ? "checked" : ""}></label>
      `;

      earlyStart += status.early || 0;
      lateStart += status.late || 0;
      earlyEnd += status.endedEarly || 0;
      lateEnd += status.endedLate || 0;
    }

    container.appendChild(div);
  });

  updateStats(earlyStart, lateStart, earlyEnd, lateEnd);

  document.querySelectorAll("input[type='checkbox']").forEach((box) =>
    box.addEventListener("change", handleCheckbox)
  );
}

function handleCheckbox(e) {
  const index = +e.target.dataset.index;
  const type = e.target.dataset.type;
  const checked = e.target.checked;
  const day = document.getElementById("dayTypeSelect").value;
  const task = timetableData[day][index];
  const now = getCurrentMinutes();

  if (!taskStatus[index]) taskStatus[index] = {};

  const status = taskStatus[index];

  if (type === "start") {
    if (checked) {
      const delta = now - task.start;
      if (delta < 0) status.early = Math.abs(delta);
      else status.late = delta;
      status.started = true;
    } else {
      status.started = false;
      status.early = 0;
      status.late = 0;
    }
  } else if (type === "end") {
    if (!status.started) {
      alert("⛔ Start the task first!");
      e.target.checked = false;
      return;
    }
    const deltaEnd = now - task.end;
    if (deltaEnd < 0) status.endedEarly = Math.abs(deltaEnd);
    else status.endedLate = deltaEnd;
    status.ended = checked;
  }

  const allData = JSON.parse(localStorage.getItem("todayTasks") || "{}");
  allData[day] = taskStatus;
  localStorage.setItem("todayTasks", JSON.stringify(allData));

  renderTimetable(day);
}

function updateStats(eStart, lStart, eEnd, lEnd) {
  const started = taskStatus.filter(t => t?.started).length;
  const ended = taskStatus.filter(t => t?.ended).length;
  const total = timetableData[document.getElementById("dayTypeSelect").value].filter(t => !t.noCheckbox).length;

  document.getElementById("totalCompleted").innerText = ended;
  document.getElementById("totalRemaining").innerText = total - ended;
  document.getElementById("completionPercent").innerText = Math.round((ended / total) * 100) + "%";
  document.getElementById("timeStartedEarly").innerText = formatMinutes(eStart);
  document.getElementById("timeStartedLate").innerText = formatMinutes(lStart);
  document.getElementById("timeEndedEarly").innerText = formatMinutes(eEnd);
  document.getElementById("timeEndedLate").innerText = formatMinutes(lEnd);
}

// === Event Bindings ===
document.getElementById("dayTypeSelect").addEventListener("change", (e) => {
  const day = e.target.value;
  if (day) {
    localStorage.setItem("selectedDay", day);
    localStorage.setItem("lastAccessedDate", new Date().toDateString());
    renderTimetable(day);
  }
});

document.getElementById("clearDailyBtn").addEventListener("click", () => {
  const day = document.getElementById("dayTypeSelect").value;
  const data = JSON.parse(localStorage.getItem("todayTasks") || "{}");
  delete data[day];
  localStorage.setItem("todayTasks", JSON.stringify(data));
  renderTimetable(day);
});

document.getElementById("refreshBtn").addEventListener("click", () => location.reload());

window.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toDateString();
  const last = localStorage.getItem("lastAccessedDate");
  const savedDay = localStorage.getItem("selectedDay");

  if (last && last !== today) {
    localStorage.removeItem("todayTasks");
  }

  if (savedDay) {
    document.getElementById("dayTypeSelect").value = savedDay;
    localStorage.setItem("lastAccessedDate", today);
    renderTimetable(savedDay);
  }
});
