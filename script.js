const patientInfo = {
  name: "Sunita Sharma",
  age: 65,
};

const medications = [
  { name: "Exercise ", interval: 1 }, // Every 1 hour
  { name: "Drink Water", interval: 1 }, // Every 1 hour
  { name: "Lunch", interval: 3 }, // Every 3 hours
  { name: "Tablet", interval: 4 }, // Every 4 hours
  { name: "Sleeping Time", interval: 5 },
];

let currentMedicationIndex = 0;
let nextDoseTime = calculateNextDoseTime(medications[currentMedicationIndex]);
let alarmTimeout;

function calculateNextDoseTime(medication) {
  const now = new Date();
  return new Date(
    now.getTime() + medication.interval * 60 * 60 * 1000
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimeOfDay() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 6 && hour < 12) {
    return "Morning";
  } else if (hour >= 12 && hour < 18) {
    return "Afternoon";
  } else if (hour >= 18 && hour < 24) {
    return "Evening";
  } else {
    return "Night";
  }
}

function updateNextDoseTime() {
  const timeOfDay = getTimeOfDay();
  const medicationNameElement = document.getElementById("medication-name");
  const nextDoseTimeElement = document.getElementById("next-dose-time");

  medicationNameElement.innerText = `Medication: ${medications[currentMedicationIndex].name}`;
  nextDoseTimeElement.innerText = `Next dose at ${timeOfDay}: ${nextDoseTime}`;
}

function takeMedication() {
  alert(`Medication ${medications[currentMedicationIndex].name} taken!`);
  currentMedicationIndex++;
  stopAlarm();

  if (currentMedicationIndex < medications.length) {
    nextDoseTime = calculateNextDoseTime(medications[currentMedicationIndex]);
    updateNextDoseTime();
    highlightCurrentMedication();
  } else {
    alert("All medications taken for the day.");
  }
}

function playAlarm() {
  const audio = new Audio("assets/Alarm-ringtone.mp3");

  // Define the function to be used as a reference for removal
  function playAudio() {
    audio
      .play()
      .then(() => {
        console.log("Audio played successfully");
        alarmTimeout = setTimeout(() => {
          stopAlarm();
        }, 20000); // 20 seconds
      })
      .catch((error) => console.error("Error playing audio:", error));

    // Remove the click event listener to avoid multiple plays
    document.removeEventListener("click", playAudio);
  }

  // Add the event listener
  document.addEventListener("click", playAudio);
}

function stopAlarm() {
  clearTimeout(alarmTimeout);
  console.log("Alarm stopped");
}

function checkAlarm() {
  playAlarm();
  const now = new Date();
  const nextDose = new Date(
    now.getTime() +
      medications[currentMedicationIndex].interval * 60 * 60 * 1000
  );

  console.log("Current Time:", now.toLocaleTimeString());
  console.log("Next Dose Time:", nextDose.toLocaleTimeString());

  if (now >= nextDose) {
    console.log(
      `Alarm triggered for ${medications[currentMedicationIndex].name}`
    );
    playAlarm();

    currentMedicationIndex++;

    if (currentMedicationIndex < medications.length) {
      nextDoseTime = calculateNextDoseTime(medications[currentMedicationIndex]);
      updateNextDoseTime();
      highlightCurrentMedication();
    } else {
      alert("All medications taken for the day.");
    }
  }
}

function highlightCurrentMedication() {
  const medicationItems = document.querySelectorAll(".medication-item");
  medicationItems.forEach((item, index) => {
    item.classList.toggle(
      "current-medication",
      index === currentMedicationIndex
    );
  });
}

setInterval(checkAlarm, 60000);

// Initial setup
renderPatientInfo();
updateNextDoseTime();

// Display the initial medication information
updateMedicationInfo();

function updateMedicationInfo() {
  const medicationNameElement = document.getElementById("medication-name");
  const nextDoseTimeElement = document.getElementById("next-dose-time");

  medicationNameElement.innerText = `Medication: ${medications[currentMedicationIndex].name}`;
  nextDoseTimeElement.innerText = `Next dose at: ${nextDoseTime}`;
}

// Highlight the current medication (Exercise) initially
highlightCurrentMedication();
