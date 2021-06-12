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
        const storedValue = localStorage.getItem('searchQuery') ;
        if (storedValue != null)
            this.searchQuery = storedValue;

        this.$nextTick(() => {
            this.$refs.searchBox.focus();
            this.$refs.searchBox.setSelectionRange(0, this.$refs.searchBox.value.length)
            console.log(this.$refs.searchBox.value.length)
        });

    },
    methods: {

        clearIt: function(){
            this.searchQuery = "";
        },

        filteredItems: _.debounce(function () {
            if (this.searchQuery == null)
                return;

            console.log("Generating list...");
            var list = [];
            localStorage.setItem('searchQuery', this.searchQuery);
            var terms = this.searchQuery.split(" ");
            var termsRe = terms.map(function(t){ return new RegExp(t, "i"); });
            //productRe = new RegExp(this.searchQuery, "i");


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
        }, 500)
    }

});