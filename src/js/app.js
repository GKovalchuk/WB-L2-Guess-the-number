const game = document.getElementById("game");
const startingField = document.getElementById("startingField");
const recordField = document.getElementById("recordField");
const resetRecord = document.getElementById("resetRecord");
const setMin = document.getElementById("setMin");
const setMax = document.getElementById("setMax");
const guessInput = document.getElementById("guessInput");
const startButton = document.getElementById("startButton");
const guessButton = document.getElementById("guessButton");
const response = document.getElementById("response");
const attemptsCounter = document.getElementById("attemptsCounter");
const hint = document.getElementById("hint");
const restartButton = document.getElementById("restartButton");

// Объявляем переменные для границ числа, загаданного числа и количества попыток.
let min = 1;
let max = 100;
let hiddenNumber;
let counter;

// Получаем текущий рекорд.
let record = Number(localStorage.getItem("gameGTNRecord"));
if (!record) {
	record = "У вас пока нет рекорда.";
	recordField.textContent = record;
} else {
	recordField.textContent = `Ваш рекорд: ${record} попыток`;
}

// Функция, запрещающая ввод не чисел.
const filterInputsChar = (e) => {
	const value = e.target.value;
	const key = e.key;

	if (
		(key >= "0" && key <= "9" && value.length < 14) ||
		key == "Backspace" ||
		key == "Tab" ||
		key == "Enter" ||
		key == "Delete"
	) {
		e.target.value = value;
	} else {
		e.preventDefault();
		return false;
	}
};

// Даем подсказку каждую третью неправильную попытку.
function giveHint() {
	if (counter % 3 === 0) {
		if (hiddenNumber % 2 === 0) {
			hint.textContent = "Подсказка: число четное";
		} else {
			hint.textContent = "Подсказка: число нечетное";
		}
	} else {
		hint.textContent = "";
	}
}

// Функция для рестарта игры.
const restartGame = () => {
	// Очищаем поля ввода.
	setMin.value = "1";
	setMax.value = "100";
	guessInput.value = "";

	// Отключаем поле и кнопку для угадывания.
	guessInput.disabled = true;
	guessButton.disabled = true;

	// Отключаем кнопку старта игры.
	startButton.textContent = "Начнем";
	startButton.onclick = startGame;

	// Отображаем текущее поле игры.
	startingField.style.display = "flex";
	game.style.display = "none";

	// Очищаем поля.
	response.textContent = "";
	hint.textContent = "";
	attemptsCounter.textContent = "Попыток: 0";
};

// Функция для запуска игры.
const startGame = () => {
	// Получаем значения границ для загадываемого числа.
	min = Number(setMin.value);
	max = Number(setMax.value);

	// Проверяем и обрабатываем ввод пользователя.
	if (max < min) [min, max] = [max, min];
	else if (max === min) {
		response.textContent = "Числа не должны быть равны";
		return;
	}

	// Получаем рандомное число в указанных границах.
	hiddenNumber = Math.floor(Math.random() * (max - min + 1)) + min;
	console.log(hiddenNumber);

	// Обнуляем счетчик попыток.
	counter = 0;

	// Отключаем кнопку старта игры.
	startButton.textContent = "Заново";
	startButton.onclick = restartGame;

	// Отображаем текущее поле игры.
	startingField.style.display = "none";
	game.style.display = "flex";

	// Активируем инпут для угадывания.
	guessInput.disabled = false;
	guessButton.disabled = false;

	// Очищаем поля ответа и подсказок.
	response.textContent = "";
	hint.textContent = "";
};

// Функция для проверки попытки угадать.
const checkGuess = () => {
	// Получаем число от пользователя.
	const guess = Number(guessInput.value);

	// Проверяем и обрабатываем ввод пользователя.
	if (guess < min || guess > max) {
		response.textContent = `Число должно быть от ${min} до ${max}!`;
		return;
	} else {
		response.textContent = "";
	}

	// Увеличиваем счетчик попыток и обновляем его на странице.
	counter += 1;
	attemptsCounter.textContent = `Попыток: ${counter}`;

	// Проверяем введенное число.
	if (guess === hiddenNumber) {
		response.textContent = "Ты угадал!";
		// Отключаем поле и кнопку для угадывания.
		guessInput.disabled = true;
		guessButton.disabled = true;
		// Очищаем поле подсказки
		hint.textContent = "";
		// Обрабатываем рекорд.
		if (counter < record || typeof record === "string") {
			localStorage.setItem("gameGTNRecord", `${counter}`);
			recordField.textContent = `Ваш рекорд: ${counter} попыток`;
		}
	} else if (guess < hiddenNumber) {
		// Даем подсказку.
		giveHint();
		response.textContent = "Загаданное число больше";
	} else {
		// Даем подсказку.
		giveHint();
		response.textContent = "Загаданное число меньше";
	}
};

// Добавляем обработчики событий на поля ввода цифр.
setMin.addEventListener("keydown", filterInputsChar);
setMax.addEventListener("keydown", filterInputsChar);
guessInput.addEventListener("keydown", filterInputsChar);

// Кнопка начала игры.
startButton.onclick = startGame;

// Кнопки проверки ответа.
guessButton.addEventListener("click", checkGuess);

// Кнопки проверки ответа.
resetRecord.addEventListener("click", () => {
	record = "У вас пока нет рекорда.";
	recordField.textContent = record;
	localStorage.removeItem("gameGTNRecord");
});
