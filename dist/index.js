function list() {
    fetch('https://api.quran.sutanlab.id/surah')
        .then(response => response.json())
        .then(data => {
            let element = document.getElementById('listsurah')
            data.data.map((value, index) => {
                let surah = value.name.transliteration.id
                let newOption = document.createElement('option')
                newOption.setAttribute('value', surah)
                newOption.innerHTML = surah
                element.appendChild(newOption)
            })
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
function app() {
    list()
    return {
        hadists: [],
        todos: JSON.parse(localStorage.getItem("database")) || [],
        todoSurah: "",
        todoFrom: 0,
        todoTo: 0,
        todoId: 1,
        addNote() {
            if (this.todoSurah.trim() === "") {
                return;
            }
            var hari = new Array("Minngu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu");
            var bulan = new Array("Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember");
            let tgl = new Date(Date.now())
            let count = parseInt(this.todoTo) - parseInt(this.todoFrom) + 1
            let date = hari[tgl.getDay()] + ' ' + tgl.getDate() + ' ' + bulan[tgl.getMonth()] + " " + tgl.getFullYear()
            // Text Color
            let color
            if (count >= 50) {
                color = 'text-blue-500'
            }else if(count >= 100){
                color = 'text-blue-600'
            }else if(count >= 200){
                color = 'text-green-400'
            }else if(count >= 500){
                color = 'text-green-500'
            }
            // Check if Date Already
            if (this.todos.length !== 0) {
                this.todos.map(todo => {
                    if (todo.date.includes(date)) {
                        todo.count = parseInt(todo.count) + parseInt(count)
                        if (todo.count >= 500) {
                            todo.isComplete = true
                        }
                        if (!todo.surah.includes(this.todoSurah)) {
                            todo.surah = todo.surah + ', ' + this.todoSurah
                        }
                        if (todo.count >= 50) {
                            todo.class = 'text-blue-500'
                        }else if(todo.count >= 100){
                            todo.class = 'text-blue-600'
                        }else if(todo.count >= 200){
                            todo.class = 'text-green-400'
                        }else if(todo.count >= 500){
                            todo.class = 'text-green-500'
                        }
                    } else {
                        this.todos.push({
                            id: this.todoId,
                            surah: todo.surah + ',' + this.todoSurah,
                            count: count,
                            date: date,
                            class : color,
                            isComplete: false
                        });
                    }
                })
            } else {
                this.todos.push({
                    id: this.todoId,
                    surah: this.todoSurah,
                    count: count,
                    date: date,
                    class : color,
                    isComplete: (count >= 500) ? true : false
                });
            }

            // Add To LocalStorage
            localStorage.setItem('database', JSON.stringify(this.todos))

            // Get Data LocalStorage
            var storedData = JSON.parse(localStorage.getItem("database"));
            this.todoId++;
            this.todoSurah = "";
            this.todoFrom = "";
            this.todoTo = "";
        },
        deleteNote(id) {
            // this.todos = this.todos.filter((todo) => id !== todo.id);
            var storedData = JSON.parse(localStorage.getItem("database")) || [];
            storedData.map((val, index) => {
                if (val.id == id) {
                    storedData.splice(index, 1);
                    localStorage.setItem('database', JSON.stringify(storedData));
                    this.todos = JSON.parse(localStorage.getItem("database")) || []
                }
            })
        },
        hadist() {
            fetch('https://aibnuhibban.github.io/CQur-an/dist/hadist.json')
                .then(response => response.json())
                .then(data => {
                    data.data.map(val => {
                        console.log(val)
                        this.hadists.push({
                            id      : val.id,
                            title   : val.title,
                            source  : val.source,
                            body    : val.body,
                        })
                    })
                    this.hadists.map(val => {
                        console.log(val)
                    })
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };
}