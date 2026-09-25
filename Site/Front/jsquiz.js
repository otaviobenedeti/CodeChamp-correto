const questions = [
    {
        question: "Qual palavra-chave é usada para declarar uma variável que pode ser alterada?",
        answers: [
            { id: 1, text: "const", correct: false },
            { id: 2, text: "let", correct: true },
            { id: 3, text: "varia", correct: false },
            { id: 4, text: "variable", correct: false }
        ]
    },
    {
        question: "Qual comando exibe uma mensagem no console?",
        answers: [
            { id: 1, text: "print()", correct: false },
            { id: 2, text: "console.log()", correct: true },
            { id: 3, text: "show()", correct: false },
            { id: 4, text: "display()", correct: false }
        ]
    },
    {
        question: "Qual operador é usado para atribuir um valor a uma variável?",
        answers: [
            { id: 1, text: "==", correct: false },
            { id: 2, text: "===", correct: false },
            { id: 3, text: "=", correct: true },
            { id: 4, text: "!=", correct: false }
        ]
    },
    {
        question: "Qual tipo de dado representa texto em JavaScript?",
        answers: [
            { id: 1, text: "Number", correct: false },
            { id: 2, text: "Boolean", correct: false },
            { id: 3, text: "String", correct: true },
            { id: 4, text: "Object", correct: false }
        ]
    },
    {
        question: "Qual tipo de dado representa verdadeiro ou falso?",
        answers: [
            { id: 1, text: "String", correct: false },
            { id: 2, text: "Boolean", correct: true },
            { id: 3, text: "Number", correct: false },
            { id: 4, text: "Array", correct: false }
        ]
    },
    {
        question: "Qual estrutura é usada para executar um código dependendo de uma condição?",
        answers: [
            { id: 1, text: "if", correct: true },
            { id: 2, text: "loop", correct: false },
            { id: 3, text: "case", correct: false },
            { id: 4, text: "check", correct: false }
        ]
    },
    {
        question: "Qual estrutura é usada para repetir um código enquanto uma condição for verdadeira?",
        answers: [
            { id: 1, text: "if", correct: false },
            { id: 2, text: "while", correct: true },
            { id: 3, text: "switch", correct: false },
            { id: 4, text: "condition", correct: false }
        ]
    },
    {
        question: "Qual método adiciona um elemento ao final de um array?",
        answers: [
            { id: 1, text: "push()", correct: true },
            { id: 2, text: "add()", correct: false },
            { id: 3, text: "insert()", correct: false },
            { id: 4, text: "append()", correct: false }
        ]
    },
    {
        question: "Qual método remove o último elemento de um array?",
        answers: [
            { id: 1, text: "remove()", correct: false },
            { id: 2, text: "delete()", correct: false },
            { id: 3, text: "pop()", correct: true },
            { id: 4, text: "last()", correct: false }
        ]
    },
    {
        question: "Qual comando é usado para criar uma função?",
        answers: [
            { id: 1, text: "function", correct: true },
            { id: 2, text: "create", correct: false },
            { id: 3, text: "method", correct: false },
            { id: 4, text: "func", correct: false }
        ]
    },
    {
        question: "Qual método seleciona um elemento HTML pelo seu ID?",
        answers: [
            { id: 1, text: "document.getElementById()", correct: true },
            { id: 2, text: "document.getId()", correct: false },
            { id: 3, text: "document.selectId()", correct: false },
            { id: 4, text: "document.findId()", correct: false }
        ]
    },
    {
        question: "Qual palavra-chave cria uma variável que não pode ser reatribuída?",
        answers: [
            { id: 1, text: "let", correct: false },
            { id: 2, text: "var", correct: false },
            { id: 3, text: "const", correct: true },
            { id: 4, text: "fixed", correct: false }
        ]
    },
    {
        question: "Qual operador verifica se dois valores são iguais e possuem o mesmo tipo?",
        answers: [
            { id: 1, text: "=", correct: false },
            { id: 2, text: "==", correct: false },
            { id: 3, text: "===", correct: true },
            { id: 4, text: "!=", correct: false }
        ]
    },
    {
        question: "Qual função converte uma string em número inteiro?",
        answers: [
            { id: 1, text: "NumberText()", correct: false },
            { id: 2, text: "parseInt()", correct: true },
            { id: 3, text: "toInteger()", correct: false },
            { id: 4, text: "stringToNumber()", correct: false }
        ]
    },
    {
        question: "Qual objeto representa o documento HTML atual em JavaScript?",
        answers: [
            { id: 1, text: "window", correct: false },
            { id: 2, text: "html", correct: false },
            { id: 3, text: "document", correct: true },
            { id: 4, text: "page", correct: false }
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Próxima";
    showQuestion();
}

function showQuestion() {
    resetState();

    const currentQuestion = questions[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;

    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);

        button.dataset.id = answer.id;
        button.dataset.correct = answer.correct;

        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";

    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const answers = questions[currentQuestionIndex].answers;
    const correctAnswer = answers.find((answer) => answer.correct);
    const selectedBtn = e.target;
    const isCorrect = Number(selectedBtn.dataset.id) === correctAnswer.id;

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }

    Array.from(answerButtons.children).forEach((button) => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }

        button.disabled = true;
    });

    nextButton.style.display = "block";
}

function showScore() {
    resetState();

    questionElement.innerHTML = `Você acertou ${score} de ${questions.length}!`;

    nextButton.innerHTML = "Jogar Novamente";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();
