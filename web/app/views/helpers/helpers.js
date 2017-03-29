const Handlebars = require('handlebars');



const helpers = {
    aboutLink: function () {
        return '/about';
    },
    contactLink: function () {
        return '/contact';
    },
    postListLink: function () {
        return '/posts';
    },
    postCategoryLink : function(category){
        return `/posts/${category.slug}`;
    },
    postDetailLink: function (post) {
        return `/post/${post.slug}`;
    },
    
    json: function(context){
        return JSON.stringify(context);
    }
};

for (let key in helpers) {
    Handlebars.registerHelper(key, helpers[key]);
}
module.exports = {};
