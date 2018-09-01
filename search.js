const app = new Vue({
    el: '#app',
    data: {
        searchQuery: '',
        searchQueryIsDirty: false,
        masterList: recipes,
        recipes: recipes,
        showLoading: true
    },
    computed: {},
    watch: {
        searchQuery: function () {
            this.searchQueryIsDirty = true;
            this.filteredItems()
        },
        searchPlatform: function () {
            this.searchQueryIsDirty = true;
            this.filteredItems()
        },
        checkedProducts: function () {
            this.searchQueryIsDirty = true;
            this.filteredItems()
        },
        checkedPlatforms: function () {
            this.searchQueryIsDirty = true;
            this.filteredItems()
        }
    },
    mounted: function () {
        this.showLoading = false;
    },
    methods: {
        filteredItems: _.debounce(function () {
            console.log("Generating list...");
            var list = [];
            productRe = new RegExp(this.searchQuery, "i");
            //platformRe = new RegExp(this.checkedPlatforms.join("|"), "i");

            this.masterList.forEach(function (recipe) {
                var add = recipe.name.match(productRe);
                if (add) {
                    list.push(recipe)
                }
            });

            this.recipes = list;
        }, 1000)
    }

});