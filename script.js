// ========================================
// LOGIN SYSTEM
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value;

        const email =
            document.getElementById("email").value;

        localStorage.setItem("iotUserName", username);
        localStorage.setItem("iotUserEmail", email);

        if (!localStorage.getItem("iotXP")) {
            localStorage.setItem("iotXP", "0");
        }

        window.location.href = "dashboard.html";

    });

}

// ========================================
// DASHBOARD
// ========================================

const dashboardName =
    document.getElementById("dashboardName");

if (dashboardName) {

    const username =
        localStorage.getItem("iotUserName");

    if (username) {
        dashboardName.textContent = username;
    }

    const xp =
        Number(localStorage.getItem("iotXP") || 0);

    // XP DISPLAY
    const xpDisplay =
        document.getElementById("xpDisplay");

    if (xpDisplay) {
        xpDisplay.textContent = xp;
    }

    // ========================================
    // LEVEL SYSTEM
    // ========================================

    let level = 1;
    let levelTitle = "IoT Beginner";

    if (xp >= 400) {
        level = 5;
        levelTitle = "IoT Master";
    }
    else if (xp >= 300) {
        level = 4;
        levelTitle = "IoT Engineer";
    }
    else if (xp >= 200) {
        level = 3;
        levelTitle = "IoT Builder";
    }
    else if (xp >= 100) {
        level = 2;
        levelTitle = "Sensor Explorer";
    }

    const levelNumber =
        document.querySelector(".level-number");

    const levelTitleElement =
        document.querySelector(".level-title");

    if (levelNumber) {
        levelNumber.textContent =
            "Level " + level;
    }

    if (levelTitleElement) {
        levelTitleElement.textContent =
            levelTitle;

    }const progressLevelTitle =
    document.getElementById("progressLevelTitle");

if (progressLevelTitle) {
    progressLevelTitle.textContent =
        levelTitle;
}

const totalXP =
    document.getElementById("totalXP");

if (totalXP) {
    totalXP.textContent =
        xp;
}
    // ========================================
    // CURRENT LEVEL XP
    // ========================================

    const xpForCurrentLevel =
        (level - 1) * 100;

    const xpInCurrentLevel =
        xp - xpForCurrentLevel;

    const xpProgress =
        document.getElementById("xpProgress");

    if (xpProgress) {
        xpProgress.textContent =
            xpInCurrentLevel + " / 100 XP";
    }

    const xpBar =
        document.getElementById("xpBar");

    if (xpBar) {
        xpBar.style.width =
            Math.min(xpInCurrentLevel, 100) + "%";
    }
}
    

    // ========================================
// MODULE 2 UNLOCK SYSTEM
// ========================================

const module2 =
    document.getElementById("module2");

const module2Button =
    document.getElementById("module2Button");

const module2Message =
    document.getElementById("module2Message");


if (module2 && module2Button) {

    const currentXP =
        Number(localStorage.getItem("iotXP") || 0);


    // Check if user has earned 100 XP

    if (currentXP >= 100) {

        // Change locked appearance

        module2.classList.remove("locked-module");

        module2.classList.add("unlocked-module");


        // Change icon

        const moduleIcon =
            module2.querySelector(".module-icon");

        if (moduleIcon) {
            moduleIcon.textContent = "🔓";
        }


        // Change message

        if (module2Message) {

            module2Message.textContent =
                "🎉 Module unlocked! Learn about sensors and actuators.";

        }


        // Unlock button

        module2Button.disabled = false;

        module2Button.textContent =
            "Start Module →";

        module2Button.classList.add(
            "unlocked-button"
        );


        // Open Module 2

        module2Button.onclick = function() {

            window.location.href =
                "module2.html";

        };

    }

}




// ========================================
// MODULE 1
// ========================================

function startQuiz() {

    window.location.href = "quiz.html";

}


// ========================================
// QUIZ QUESTIONS
// ========================================

const quizQuestions = [

    {
        question: "What does IoT stand for?",

        options: [
            "Internet of Things",
            "Input of Technology",
            "Internet of Technology",
            "Integration of Things"
        ],

        answer: 0
    },


    {
        question: "Which device is commonly used to measure temperature?",

        options: [
            "Temperature sensor",
            "Speaker",
            "LED",
            "Motor"
        ],

        answer: 0
    },


    {
        question: "Which of these is a popular IoT development board?",

        options: [
            "ESP32",
            "Keyboard",
            "Monitor",
            "Printer"
        ],

        answer: 0
    },


    {
        question: "Which technology can be used to connect an IoT device to the internet?",

        options: [
            "Wi-Fi",
            "HDMI",
            "VGA",
            "USB keyboard"
        ],

        answer: 0
    },


    {
        question: "What is the main purpose of a sensor in an IoT system?",

        options: [
            "To collect information from the environment",
            "To display movies",
            "To print documents",
            "To store electricity"
        ],

        answer: 0
    }

];


// ========================================
// QUIZ VARIABLES
// ========================================

let currentQuestion = 0;

let score = 0;

let selectedAnswer = -1;


// ========================================
// LOAD QUIZ
// ========================================

const questionElement =
    document.getElementById("question");

const optionsElement =
    document.getElementById("options");

const questionNumberElement =
    document.getElementById("questionNumber");

const nextButton =
    document.getElementById("nextButton");

const quizResult =
    document.getElementById("quizResult");


if (questionElement) {

    loadQuestion();

}


// ========================================
// LOAD QUESTION
// ========================================

function loadQuestion() {

    selectedAnswer = -1;

    const current =
        quizQuestions[currentQuestion];

    questionNumberElement.textContent =
        "Question " +
        (currentQuestion + 1) +
        " of " +
        quizQuestions.length;

    questionElement.textContent =
        current.question;

    optionsElement.innerHTML = "";


    current.options.forEach(function(option, index) {

        const button =
            document.createElement("button");

        button.className =
            "quiz-option";

        button.textContent =
            option;

        button.onclick =
            function() {

                selectAnswer(index, button);

            };

        optionsElement.appendChild(button);

    });

}


// ========================================
// SELECT ANSWER
// ========================================

function selectAnswer(index, button) {

    if (selectedAnswer !== -1) {
        return;
    }

    selectedAnswer = index;

    const correctAnswer =
        quizQuestions[currentQuestion].answer;


    const allOptions =
        document.querySelectorAll(".quiz-option");


    allOptions.forEach(function(option) {

        option.disabled = true;

    });


    if (index === correctAnswer) {

        button.classList.add("correct");

        score++;

    } else {

        button.classList.add("wrong");

        allOptions[correctAnswer]
            .classList.add("correct");

    }

}


// ========================================
// NEXT QUESTION
// ========================================

function nextQuestion() {

    if (selectedAnswer === -1) {

        alert("Please select an answer first.");

        return;

    }


    currentQuestion++;


    if (currentQuestion <
        quizQuestions.length) {

        loadQuestion();

    } else {

        finishQuiz();

    }

}


// ========================================
// FINISH QUIZ
// ========================================

function finishQuiz() {

    questionElement.textContent =
        "Quiz Completed! 🎉";

    questionNumberElement.textContent =
        "Your Result";


    optionsElement.innerHTML = "";


    nextButton.style.display =
        "none";


    const xpEarned =
        score * 20;


    addXP(xpEarned);


    quizResult.innerHTML =

        "You scored " +
        score +
        " / " +
        quizQuestions.length +
        "<br><br>" +

        "⭐ You earned " +
        xpEarned +
        " XP!";


}


// ========================================
// ADD XP
// ========================================

function addXP(amount) {

    let currentXP =
        Number(localStorage.getItem("iotXP") || 0);


    currentXP += amount;


    localStorage.setItem(
        "iotXP",
        currentXP
    );

}


// ========================================
// LOGOUT
// ========================================

function logout() {

    localStorage.removeItem("iotUserName");

    localStorage.removeItem("iotUserEmail");

    window.location.href = "index.html";

}
// ========================================
// MODULE 2 QUIZ
// ========================================

function startQuiz2() {

    window.location.href = "quiz2.html";

}


// ========================================
// MODULE 2 QUESTIONS
// ========================================

const quiz2Questions = [

    {
        question:
            "What is the main purpose of a sensor?",

        options: [
            "To collect information from the environment",
            "To produce electricity",
            "To display a webpage",
            "To store files"
        ],

        answer: 0
    },


    {
        question:
            "Which of these is an actuator?",

        options: [
            "Temperature sensor",
            "Light sensor",
            "Motor",
            "Humidity sensor"
        ],

        answer: 2
    },


    {
        question:
            "Which device can detect movement?",

        options: [
            "Motion sensor",
            "LED",
            "Motor",
            "Buzzer"
        ],

        answer: 0
    },


    {
        question:
            "What does an actuator do?",

        options: [
            "Collects environmental data",
            "Performs a physical action",
            "Stores sensor data",
            "Connects to a database"
        ],

        answer: 1
    },


    {
        question:
            "Which sequence represents a basic IoT system?",

        options: [
            "Actuator → Sensor → Controller",
            "Sensor → Controller → Actuator",
            "Controller → Sensor → Actuator",
            "Actuator → Controller → Sensor"
        ],

        answer: 1
    }

];


// ========================================
// MODULE 2 QUIZ VARIABLES
// ========================================

let currentQuestion2 = 0;

let score2 = 0;

let selectedAnswer2 = -1;


// ========================================
// MODULE 2 QUIZ ELEMENTS
// ========================================

const questionElement2 =
    document.getElementById("question2");

const optionsElement2 =
    document.getElementById("options2");

const questionNumberElement2 =
    document.getElementById("questionNumber2");

const nextButton2 =
    document.getElementById("nextButton2");

const quizResult2 =
    document.getElementById("quizResult2");


if (questionElement2) {

    loadQuestion2();

}


// ========================================
// LOAD MODULE 2 QUESTION
// ========================================

function loadQuestion2() {

    selectedAnswer2 = -1;

    const current =
        quiz2Questions[currentQuestion2];


    questionNumberElement2.textContent =
        "Question " +
        (currentQuestion2 + 1) +
        " of " +
        quiz2Questions.length;


    questionElement2.textContent =
        current.question;


    optionsElement2.innerHTML = "";


    current.options.forEach(
        function(option, index) {

            const button =
                document.createElement("button");


            button.className =
                "quiz-option";


            button.textContent =
                option;


            button.onclick =
                function() {

                    selectAnswer2(
                        index,
                        button
                    );

                };


            optionsElement2.appendChild(button);

        }
    );

}


// ========================================
// SELECT MODULE 2 ANSWER
// ========================================

function selectAnswer2(index, button) {

    if (selectedAnswer2 !== -1) {

        return;

    }


    selectedAnswer2 = index;


    const correctAnswer =
        quiz2Questions[currentQuestion2].answer;


    const allOptions =
        document.querySelectorAll(
            "#options2 .quiz-option"
        );


    allOptions.forEach(
        function(option) {

            option.disabled = true;

        }
    );


    if (index === correctAnswer) {

        button.classList.add("correct");

        score2++;

    }

    else {

        button.classList.add("wrong");

        allOptions[correctAnswer]
            .classList.add("correct");

    }

}


// ========================================
// NEXT MODULE 2 QUESTION
// ========================================

function nextQuestion2() {

    if (selectedAnswer2 === -1) {

        alert(
            "Please select an answer first."
        );

        return;

    }


    currentQuestion2++;


    if (
        currentQuestion2 <
        quiz2Questions.length
    ) {

        loadQuestion2();

    }

    else {

        finishQuiz2();

    }

}


// ========================================
// FINISH MODULE 2 QUIZ
// ========================================

function finishQuiz2() {

    questionElement2.textContent =
        "Module 2 Completed! 🎉";


    questionNumberElement2.textContent =
        "Your Result";


    optionsElement2.innerHTML = "";


    nextButton2.style.display =
        "none";


    const xpEarned2 =
        score2 * 20;


    // Give XP only once

    const alreadyCompleted =
        localStorage.getItem(
            "iotModule2Completed"
        );


    if (!alreadyCompleted) {

        addXP(xpEarned2);

        localStorage.setItem(
            "iotModule2Completed",
            "true"
        );

    }


    quizResult2.innerHTML =

        "You scored " +
        score2 +
        " / " +
        quiz2Questions.length +
        "<br><br>" +

        "⭐ You earned " +
        xpEarned2 +
        " XP!";


}

// ========================================
// MODULE 3 UNLOCK SYSTEM
// ========================================

function updateModule3() {

    const module3 =
        document.getElementById("module3");

    const module3Button =
        document.getElementById("module3Button");

    const module3Message =
        document.getElementById("module3Message");


    if (!module3 || !module3Button) {
        return;
    }


    const currentXP =
        Number(
            localStorage.getItem("iotXP") || 0
        );


    if (currentXP >= 300) {

        module3.classList.remove(
            "locked-module"
        );

        module3.classList.add(
            "unlocked-module"
        );


        const moduleIcon =
            module3.querySelector(".module-icon");


        if (moduleIcon) {

            moduleIcon.textContent =
                "🔓";

        }


        if (module3Message) {

            module3Message.textContent =
                "🎉 Module unlocked! Start learning about microcontrollers.";

        }


        module3Button.disabled = false;

        module3Button.textContent =
            "Start Module →";


        module3Button.classList.add(
            "unlocked-button"
        );


        module3Button.onclick =
            function() {

                window.location.href =
                    "module3.html";

            };

    }

}


// Run Module 3 check

updateModule3();
// ========================================
// MODULE 4 QUIZ
// ========================================

function startQuiz4() {

    window.location.href = "quiz4.html";

}


// ========================================
// MODULE 4 QUESTIONS
// ========================================

const quiz4Questions = [

    {
        question:
            "Which technology is commonly used to connect IoT devices to the internet?",

        options: [
            "Wi-Fi",
            "HDMI",
            "VGA",
            "USB"
        ],

        answer: 0
    },

    {
        question:
            "Which communication technology is designed for long-range, low-power IoT communication?",

        options: [
            "Bluetooth",
            "LoRa",
            "HDMI",
            "VGA"
        ],

        answer: 1
    },

    {
        question:
            "What does MQTT stand for?",

        options: [
            "Message Queuing Telemetry Transport",
            "Machine Quality Transfer Technology",
            "Message Quick Transfer Terminal",
            "Mobile Queue Transmission Technology"
        ],

        answer: 0
    },

    {
        question:
            "In MQTT, which component receives and distributes messages?",

        options: [
            "Sensor",
            "Actuator",
            "Broker",
            "Microcontroller"
        ],

        answer: 2
    },

    {
        question:
            "Which sequence represents a basic IoT communication flow?",

        options: [
            "User → Sensor → Network → Cloud",
            "Sensor → Network → Cloud → User",
            "Cloud → Sensor → Network → User",
            "Network → User → Sensor → Cloud"
        ],

        answer: 1
    }

];

let currentQuestion4 = 0;
let score4 = 0;
let selectedAnswer4 = -1;

const questionElement4 =
    document.getElementById("question4");

const optionsElement4 =
    document.getElementById("options4");

const questionNumberElement4 =
    document.getElementById("questionNumber4");

const nextButton4 =
    document.getElementById("nextButton4");

const quizResult4 =
    document.getElementById("quizResult4");

if (questionElement4) {

    loadQuestion4();

}


function loadQuestion4() {

    selectedAnswer4 = -1;

    const current =
        quiz4Questions[currentQuestion4];

    questionNumberElement4.textContent =
        "Question " +
        (currentQuestion4 + 1) +
        " of " +
        quiz4Questions.length;

    questionElement4.textContent =
        current.question;

    optionsElement4.innerHTML = "";

    current.options.forEach(
        function(option, index) {

            const button =
                document.createElement("button");

            button.className =
                "quiz-option";

            button.textContent =
                option;

            button.onclick =
                function() {

                    selectAnswer4(
                        index,
                        button
                    );

                };

            optionsElement4.appendChild(button);

        }
    );

}


function selectAnswer4(index, button) {

    if (selectedAnswer4 !== -1) {

        return;

    }

    selectedAnswer4 = index;

    const correctAnswer =
        quiz4Questions[currentQuestion4].answer;

    const allOptions =
        document.querySelectorAll(
            "#options4 .quiz-option"
        );

    allOptions.forEach(
        function(option) {

            option.disabled = true;

        }
    );

    if (index === correctAnswer) {

        button.classList.add("correct");

        score4++;

    } else {

        button.classList.add("wrong");

        allOptions[correctAnswer]
            .classList.add("correct");

    }

}


function nextQuestion4() {

    if (selectedAnswer4 === -1) {

        alert(
            "Please select an answer first."
        );

        return;

    }

    currentQuestion4++;

    if (
        currentQuestion4 <
        quiz4Questions.length
    ) {

        loadQuestion4();

    } else {

        finishQuiz4();

    }

}


function finishQuiz4() {

    questionElement4.textContent =
        "Module 4 Completed! 🎉";

    questionNumberElement4.textContent =
        "Your Result";

    optionsElement4.innerHTML = "";

    nextButton4.style.display =
        "none";

    const xpEarned4 =
        score4 * 20;

    const alreadyCompleted =
        localStorage.getItem(
            "iotModule4Completed"
        );

    if (!alreadyCompleted) {

        addXP(xpEarned4);

        localStorage.setItem(
            "iotModule4Completed",
            "true"
        );

    }

    quizResult4.innerHTML =

        "You scored " +
        score4 +
        " / " +
        quiz4Questions.length +
        "<br><br>" +

        "⭐ You earned " +
        xpEarned4 +
        " XP!";
}
// ========================================
// MODULE 3 QUIZ
// ========================================

function startQuiz3() {

    window.location.href = "quiz3.html";

}


// ========================================
// MODULE 3 QUESTIONS
// ========================================

const quiz3Questions = [

    {
        question:
            "What is a microcontroller?",

        options: [
            "A small computer used to control electronic devices",
            "A type of internet connection",
            "A database used to store websites",
            "A wireless communication protocol"
        ],

        answer: 0
    },

    {
        question:
            "Which board is commonly used for IoT projects and has built-in Wi-Fi and Bluetooth?",

        options: [
            "ESP32",
            "VGA",
            "HDMI",
            "Ethernet cable"
        ],

        answer: 0
    },

    {
        question:
            "What is the main function of a microcontroller in an IoT system?",

        options: [
            "Only display information",
            "Process inputs and control outputs",
            "Only provide internet access",
            "Only store photographs"
        ],

        answer: 1
    },

    {
        question:
            "Which of the following can be connected to a microcontroller as an input?",

        options: [
            "Temperature sensor",
            "LED",
            "Motor",
            "Buzzer"
        ],

        answer: 0
    },

    {
        question:
            "Which component can be controlled by a microcontroller to perform a physical action?",

        options: [
            "Sensor",
            "Actuator",
            "Wi-Fi signal",
            "Database"
        ],

        answer: 1
    }

];

let currentQuestion3 = 0;
let score3 = 0;
let selectedAnswer3 = -1;

const questionElement3 =
    document.getElementById("question3");

const optionsElement3 =
    document.getElementById("options3");

const questionNumberElement3 =
    document.getElementById("questionNumber3");

const nextButton3 =
    document.getElementById("nextButton3");

const quizResult3 =
    document.getElementById("quizResult3");


// Start quiz only when quiz3.html is open

if (questionElement3) {

    loadQuestion3();

}


// ========================================
// LOAD QUESTION
// ========================================

function loadQuestion3() {

    selectedAnswer3 = -1;

    const current =
        quiz3Questions[currentQuestion3];

    questionNumberElement3.textContent =
        "Question " +
        (currentQuestion3 + 1) +
        " of " +
        quiz3Questions.length;

    questionElement3.textContent =
        current.question;

    optionsElement3.innerHTML = "";

    current.options.forEach(
        function(option, index) {

            const button =
                document.createElement("button");

            button.className =
                "quiz-option";

            button.textContent =
                option;

            button.onclick =
                function() {

                    selectAnswer3(
                        index,
                        button
                    );

                };

            optionsElement3.appendChild(button);

        }
    );

}


// ========================================
// SELECT ANSWER
// ========================================

function selectAnswer3(index, button) {

    if (selectedAnswer3 !== -1) {

        return;

    }

    selectedAnswer3 = index;

    const correctAnswer =
        quiz3Questions[currentQuestion3].answer;

    const allOptions =
        document.querySelectorAll(
            "#options3 .quiz-option"
        );

    allOptions.forEach(
        function(option) {

            option.disabled = true;

        }
    );


    if (index === correctAnswer) {

        button.classList.add("correct");

        score3++;

    } else {

        button.classList.add("wrong");

        allOptions[correctAnswer]
            .classList.add("correct");

    }

}


// ========================================
// NEXT QUESTION
// ========================================

function nextQuestion3() {

    if (selectedAnswer3 === -1) {

        alert(
            "Please select an answer first."
        );

        return;

    }

    currentQuestion3++;

    if (
        currentQuestion3 <
        quiz3Questions.length
    ) {

        loadQuestion3();

    } else {

        finishQuiz3();

    }

}


// ========================================
// FINISH QUIZ
// ========================================

function finishQuiz3() {

    questionElement3.textContent =
        "Module 3 Completed! 🎉";

    questionNumberElement3.textContent =
        "Your Result";

    optionsElement3.innerHTML = "";

    nextButton3.style.display =
        "none";

    const xpEarned3 =
        score3 * 20;

    const alreadyCompleted =
        localStorage.getItem(
            "iotModule3Completed"
        );


    if (!alreadyCompleted) {

        addXP(xpEarned3);

        localStorage.setItem(
            "iotModule3Completed",
            "true"
        );

    }


    quizResult3.innerHTML =

        "You scored " +
        score3 +
        " / " +
        quiz3Questions.length +

        "<br><br>" +

        "⭐ You earned " +
        xpEarned3 +
        " XP!";
}
// ========================================
// MODULE 4 UNLOCK SYSTEM
// ========================================

function updateModule4() {

    const module4 =
        document.getElementById("module4");

    const module4Button =
        document.getElementById("module4Button");

    const module4Message =
        document.getElementById("module4Message");

    if (!module4 || !module4Button) {
        return;
    }

    const currentXP =
        Number(
            localStorage.getItem("iotXP") || 0
        );

    if (currentXP >= 400) {

        module4.classList.remove(
            "locked-module"
        );

        module4.classList.add(
            "unlocked-module"
        );

        const moduleIcon =
            module4.querySelector(".module-icon");

        if (moduleIcon) {
            moduleIcon.textContent = "🔓";
        }

        if (module4Message) {

            module4Message.textContent =
                "🎉 Module unlocked! Learn about IoT communication and networking.";

        }

        module4Button.disabled = false;

        module4Button.textContent =
            "Start Module →";

        module4Button.classList.add(
            "unlocked-button"
        );

        module4Button.onclick =
            function() {

                window.location.href =
                    "module4.html";

            };
    }
}

updateModule4();