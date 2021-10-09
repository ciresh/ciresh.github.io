
Parse.initialize("gfJsg1LSUS8hn3KXB1D5SoGaGUjvbd67cQUbW3rm", "SmwTlhFBTtsKqAYdbn3hwPOYlR6wCyNfq4mOUJeH"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "https://parseapi.back4app.com/";
const FreezerList = Parse.Object.extend("FreezerList");

/*
Visibility of during editing is controlled by the css in dinner_vue.css
 */

// localStorage persistence
var STORAGE_KEY = "freezerList";
var todoStorage = {
    fetch: function(vueObject) {

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

            // Update Data Coming in
            /*
            todos.forEach(function(todo, index) {
                todo.id = index;
                todo.date = (new Date(todo.date)).toISOString().substr(0,10);
                if (!todo.hasOwnProperty("location"))
                    todo.location = "Basement"
            });
            */

            todos.sort(vueObject.sortfn);

            /*
            todos.sort(function(a, b){
                var result =  b.date.localeCompare(a.date);
                if (result === 0)
                    result = b.description.localeCompare(a.description);
                return result;
            });
            */
            todoStorage.uid = todos.length;
            vueObject.todos = todos
            return todos;
        });
    },
    save: function(todos) {
        //localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));

        const query = new Parse.Query(FreezerList);
        query.equalTo('user', 'ciresh');

        if (todos.length === 0){
            alert("List is zero! Not saving!")
            return;
        }


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
                console.log('Updated Freezer list', response);
            }, (error) => {
                // if (typeof document !== 'undefined') document.write(`Error while updating GameScore: ${JSON.stringify(error)}`);
                console.error('Error while updating Freezer', error);
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
    },
    kitchen: function(todos) {
        return todos.filter(function(todo) {
            return todo.location === 'Kitchen';
        });
    },
    basement: function(todos) {
        return todos.filter(function(todo) {
            //if (!todo.description.startsWith(this.app.searchTerm))
            //    return false
            return todo.location === 'Basement';
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
        visibility: "all",
        sortType: "SortDate",
        sortAscending: false,
        showType: "Both",
        searchTerm: "",
        termsRe: null,
        editableTodo: {description:"",date:"1971-03-17",location:"Kitchen"}
    },

    mounted: function() {
        todoStorage.fetch(this);


    },

    // Watch variables for changes
    watch: {
        todos: {
            /*  */
            handler: function(todos) {
                //todoStorage.save(todos);
            },
            deep: true

        },
        sortType: {
            handler: function (sortType) {
                console.log("sortType changed!");
                if (sortType === "SortName")
                    this.todos.sort(this.sortNameFn);
                else if (sortType === "SortLocation")
                    this.todos.sort(this.sortLocationFn);
                else
                    this.todos.sort(this.sortDateFn);

            }
        },
        showType: {
            handler: function (sortType) {
                console.log("Show Type changed!");
                if (sortType === "ShowBasement")
                    app.visibility = "basement";
                else if (sortType === "ShowKitchen")
                    app.visibility = "kitchen";
                else
                    app.visibility = "all";
            }
        },
        searchTerm:{
            handler: function (searchTerm) {

                //_.debounce(function () {
                if (searchTerm === "") {
                    this.termsRe = null;
                    return;
                }
                var terms = searchTerm.split(" ");
                this.termsRe = terms.map(function(t){ return new RegExp(t, "i"); });

            }
        }
    },

    // computed properties
    // http://vuejs.org/guide/computed.html
    computed: {
        // This is the list used in the html for display
        filteredTodos: function() {
            var filteredList = this.filteredList();

            var list = filters[this.visibility](filteredList)
/**/
            if (this.sortType === "SortName")
                list.sort(this.sortNameFn);
            else if (this.sortType === "SortLocation")
                list.sort(this.sortLocationFn);
            else
                list.sort(this.sortDateFn);

            if (this.sortAscending)
                list.reverse();

            return list;

            //return filters[this.visibility](this.todos);
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
                return  (d.getMonth()+1) + "/" + d.getDate();
            if (typeof d === "string")
                if (d.length === 10)
                    if (d.length === 10)
                        return d.substr(5);

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

            var dateString = (new Date()).toISOString().substr(0,10);

            // Search description for date in mm/dd/yy format
            var re = /(\d{1,2}\/\d{1,2}\/\d{2})/;
            var hasDate = re.exec(value);
            if (hasDate){
                value = value.replace(re, "").trim();
                dateString = (new Date(hasDate[0])).toISOString().substr(0,10);
            }

            this.todos.unshift({
                id: todoStorage.uid++,
                description: value,
                //date: new Date().toLocaleDateString('en-US'),
                date: dateString,
                location: "Basement",
                completed: false,
            });
            this.newTodo = "";
            todoStorage.save(this.todos);
        },

        sortLocationFn: function(a, b) {

            var result = b.location.localeCompare(a.location)
            if (result !== 0)
                return result;

            result =  b.date.localeCompare(a.date);
            if (result !== 0)
                return result;

            result = b.description.localeCompare(a.description);
            return result;
        },

        sortDateFn: function(a, b) {
            var result =  b.date.localeCompare(a.date);
            if (result !== 0)
                return result;

            result = b.description.localeCompare(a.description);
            return result;
        },

        sortNameFn: function(a, b) {

            result = b.description.localeCompare(a.description);
            if (result !== 0)
                return -1 * result;
            result =  b.date.localeCompare(a.date);

            /*
            var result = b.location.localeCompare(a.location)
            if (result !== 0)
                return result;

            result =  b.date.localeCompare(a.date);
            if (result !== 0)
                return result;

            result = b.description.localeCompare(a.description);

             */
            return result;
        },

        setStort: function(value) {
            this.cancelEdit();
            if (this.sortType === value)
                sortType = !sortType;
            this.sortType = value;
        },
/*

        sort: function() {
            todos.sort(this.sortDateFn);
        },
*/
        removeTodo: function(todo) {
            // No delete!
            this.todos.splice(this.todos.indexOf(todo), 1);
            todoStorage.save(this.todos);
        },

        editTodo: function(todo) {
            console.log("editTodo")
            this.beforeEditCache = todo.description;
            this.editedTodo = todo;

            this.editableTodo.description = todo.description;
            this.editableTodo.date = todo.date;
            this.editableTodo.location = todo.location;
        },
/*
        editTodoDate: function(todo) {
            console.log("editTodoDate")
            this.beforeEditCacheDate = todo.date;
            this.beforeEditCache = todo.description;
            this.editedTodo = todo;
        },
*/
        doneEdit: function(todo) {
            console.log("doneEdit")
            if (!this.editedTodo) {
                return;
            }
            this.editedTodo = null;

            todo.description = this.editableTodo.description.trim();
            todo.date = this.editableTodo.date;
            todo.location = this.editableTodo.location;

            todoStorage.save(this.todos);
            if (!todo.description) {
                this.removeTodo(todo);
            }
        },

        cancelEdit: function(todo) {
            console.log("Cancel Edit")
            this.editedTodo = null;
            if (todo !== undefined)
                todo.description = this.beforeEditCache;
        },

        removeCompleted: function() {
            this.todos = filters.active(this.todos);
        },

        filteredList: function()
        {
            if (this.termsRe === null)
                return this.todos;

            list = []
            this.todos.forEach(function (entry) {

                var add = this.app.termsRe.every(function(re){
                    return entry.description.match(re)
                });

                if (add) {
                    list.push(entry)
                }
            });

            return list;

        }

    },

    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/custom-directive.html
    directives: {
        /*
        "todo-focus": function(el, binding) {
            if (binding.value) {
                el.focus();
            }
        }
       */
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