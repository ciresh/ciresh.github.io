function wtf()
{
    console.log("hello");
}

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
        this.filterSimple();
    },
    methods: {
        filteredItems: _.debounce(function () {
            console.log("Generating list...");
            var list = [];
            var terms = this.searchQuery.split(" ");
            var termsRe = terms.map(function(t){ return new RegExp(t, "i"); });
            productRe = new RegExp(this.searchQuery, "i");


            this.masterList.forEach(function (recipe) {
                //var add = recipe.name.match(productRe);
                var add = termsRe.every(function(re){
                    return recipe.name.match(re)
                });

                if (add) {
                    list.push(recipe)
                }
            });

            this.recipes = list;
        }, 500),

        filterSimple: function(){
            console.log("Generating list...");
            var list = [];
            var terms = this.searchQuery.split(" ");
            var termsRe = terms.map(function(t){ return new RegExp(t, "i"); });
            productRe = new RegExp(this.searchQuery, "i");


            this.masterList.forEach(function (recipe) {
                //var add = recipe.name.match(productRe);
                var add = termsRe.every(function(re){
                    return recipe.name.match(re)
                });

                if (add) {
                    list.push(recipe)
                }
            });

            this.recipes = list;
        }

    }

});