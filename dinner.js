
Parse.initialize("gfJsg1LSUS8hn3KXB1D5SoGaGUjvbd67cQUbW3rm", "SmwTlhFBTtsKqAYdbn3hwPOYlR6wCyNfq4mOUJeH"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "https://parseapi.back4app.com/";
const FreezerList = Parse.Object.extend("FreezerList");

// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~120 effective lines of JavaScript.

// localStorage persistence
var STORAGE_KEY = "todos-vuejs-2.0";
var todoStorage = {
    fetch: function(vueObject) {
        //var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        var todos = [];

        const query = new Parse.Query(FreezerList);
        query.equalTo('user', 'ciresh');

        // here you put the objectId that you want to update
        query.first().then((freezerList) => {
            if (freezerList === undefined) {
                todos = []
            }
            else {
                var itemsString = freezerList.get("items");
                console.log(itemsString);
                todos = JSON.parse(itemsString);
            }


            todos.forEach(function(todo, index) {
                todo.id = index;
                todo.date = new Date(todo.date);
            });
            todoStorage.uid = todos.length;
            vueObject.todos = todos
            return todos;
        });
    },
    save: function(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));




        const query = new Parse.Query(FreezerList);
        query.equalTo('user', 'ciresh');

        // here you put the objectId that you want to update
        query.first().then((freezerList) => {
            if (freezerList === undefined){
                freezerList = new FreezerList();
                freezerList.set("user",'ciresh');
            }
            freezerList.set("items",JSON.stringify(todos));
            freezerList.save().then((response) => {
                // You can use the "get" method to get the value of an attribute
                // Ex: response.get("<ATTRIBUTE_NAME>")
                // if (typeof document !== 'undefined') document.write(`Updated GameScore: ${JSON.stringify(response)}`);
                console.log('Updated GameScore', response);
            }, (error) => {
                // if (typeof document !== 'undefined') document.write(`Error while updating GameScore: ${JSON.stringify(error)}`);
                console.error('Error while updating GameScore', error);
            });
        });
    }
};

// visibility filters
var filters = {
    all: function(todos) {
        return todos;
    },
    active: function(todos) {
        return todos.filter(function(todo) {
            return !todo.completed;
        });
    },
    completed: function(todos) {
        return todos.filter(function(todo) {
            return todo.completed;
        });
    }
};

// app Vue instance
var app = new Vue({
    // app initial state
    data: {
        todos: [],//todoStorage.fetch(),
        newTodo: "",
        editedTodo: null,
        visibility: "all"
    },

    mounted: function() {
        todoStorage.fetch(this);
    },

    // watch todos change for localStorage persistence
    watch: {
        todos: {
            handler: function(todos) {
                todoStorage.save(todos);
            },
            deep: true
        }
    },

    // computed properties
    // http://vuejs.org/guide/computed.html
    computed: {
        filteredTodos: function() {
            return filters[this.visibility](this.todos);
        },
        remaining: function() {
            return filters.active(this.todos).length;
        },
        allDone: {
            get: function() {
                return this.remaining === 0;
            },
            set: function(value) {
                this.todos.forEach(function(todo) {
                    todo.completed = value;
                });
            }
        }
    },

    filters: {
        pluralize: function(n) {
            return n === 1 ? "item" : "items";
        },
        dformat: function(d) {
            if (d instanceof Date)
                return  (d.getMonth()+1) + "-" + d.getDate()  + "-" + d.getFullYear();
            return d;
        }

    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {
        addTodo: function() {
            var value = this.newTodo && this.newTodo.trim();
            if (!value) {
                return;
            }
            this.todos.unshift({
                id: todoStorage.uid++,
                description: value,
                date: new Date(),
                completed: false
            });
            this.newTodo = "";
        },

        removeTodo: function(todo) {
            this.todos.splice(this.todos.indexOf(todo), 1);
        },

        editTodo: function(todo) {
            this.beforeEditCache = todo.description;
            this.editedTodo = todo;
        },

        doneEdit: function(todo) {
            if (!this.editedTodo) {
                return;
            }
            this.editedTodo = null;
            todo.description = todo.description.trim();
            if (!todo.description) {
                this.removeTodo(todo);
            }
        },

        cancelEdit: function(todo) {
            this.editedTodo = null;
            todo.description = this.beforeEditCache;
        },

        removeCompleted: function() {
            this.todos = filters.active(this.todos);
        }
    },

    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/custom-directive.html
    directives: {
        "todo-focus": function(el, binding) {
            if (binding.value) {
                el.focus();
            }
        }
    }
});

// handle routing
function onHashChange() {
    var visibility = window.location.hash.replace(/#\/?/, "");
    if (filters[visibility]) {
        app.visibility = visibility;
    } else {
        window.location.hash = "";
        app.visibility = "all";
    }
}

window.addEventListener("hashchange", onHashChange);
onHashChange();

// mount
app.$mount(".todoapp");