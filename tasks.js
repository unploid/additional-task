let xhr = new XMLHttpRequest();
let app = "https://script.gogle.com/macros/s/AKfycbyPyFg12jExguodJy_Iz4D75nLnW-j-gjTn-Q0600uVko6_L4gx/exec"; // ссылка на веб-приложение, опубликованное на основе гугловского скрипта, параметров не требует.

createTasksTable();

/**
 * Получение данных о дополнительных заданиях. 
 */
function createTasksTable() {
    let requestIndicator = document.getElementById("requestIndicator");
    let descriptionElememt = document.getElementById("description");
    let additionTasksElement = document.getElementById("additionTasks");

    let output = "";
    xhr.open('GET', app);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 0 || xhr.readyState === 1 || xhr.readyState === 2) {
            return;
        }

        if (xhr.readyState === 3) {
            //console.log("Loading...");
            requestIndicator.innerHTML = "Обработка данных...";
        }

        if (xhr.readyState === 4 && xhr.status === 200) {
            //console.log("Loaded.");
            requestIndicator.innerHTML = "Данные загружены.";
            requestIndicator.style.display = "none";

            try {
                localStorage.setItem("data", xhr.responseText);// сохранение данных, полученных из запроса

                let response = JSON.parse(xhr.responseText);
                descriptionElememt.innerHTML = response.additionTasks.description;
                let tasks = response.additionTasks.taskList;
                for (var i = 0; i < tasks.length; i++) {
                    output += "<tr class=\"task-header\"><td>" + tasks[i].title + "</td><th>" + tasks[i].estimate + "</th></tr><tr><td colspan=\"2\" class=\"accordion task-description\"><input type=\"checkbox\" id=\"accordion-" + i + "\"><label for=\"accordion-" + i + "\">Описание</label><div class=\"content\">" + tasks[i].description + "</div></td></tr>";
                }

            } catch (e) {
                console.log("Error. " + e);
                console.log(xhr.responseText);
                requestIndicator.innerHTML = "Ошибка обработки данных.";
                requestIndicator.style.display = "block";
            }
        }
        additionTasksElement.innerHTML = output;
    };

    xhr.onerror = function () {
        alert("Упс..Технические неполадки на сервере, загружаю сохраненные данные до поломки!");
        try {
            requestIndicator.innerHTML = "Обработка данных...";
            requestIndicator.innerHTML = "Данные загружены.";
            requestIndicator.style.display = "none";

            let response = JSON.parse(localStorage.getItem("data"));//получаем ранее сохраненные данные
            if (response) {
                descriptionElememt.innerHTML = response.additionTasks.description;
                let tasks = response.additionTasks.taskList;
                for (let i = 0; i < tasks.length; i++) {
                    output += "<tr class=\"task-header\"><td>" + tasks[i].title + "</td><th>" + tasks[i].estimate + "</th></tr><tr><td colspan=\"2\" class=\"accordion task-description\"><input type=\"checkbox\" id=\"accordion-" + i + "\"><label for=\"accordion-" + i + "\">Описание</label><div class=\"content\">" + tasks[i].description + "</div></td></tr>";
                }
            } else {
                descriptionElememt.innerHTML = "<h2 style = \"color: red\"> Данные не обнаружены :(</h2> <p> Попробуйте, пожалуйста, позже </p> ";
            }

        } catch (e) {
            console.log("Error. " + e);
            console.log(xhr.responseText);
            requestIndicator.innerHTML = "Ошибка обработки данных.";
            requestIndicator.style.display = "block";
        }
        additionTasksElement.innerHTML = output;
    };

    xhr.send();
}