'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The subgenerator name'
    });

    this.log('You called the Adrian subgenerator with the argument ' + this.name + '.');
  },

  writing: {
    generateSection: function() {
      var context = {
        content: this.name,
        id: this._.classify(this.name)
      };

      var fileBase = Date.now() + '_' + this._.underscored(this.name);
      var htmlFile = "app/sections/" + fileBase + ".html";
      var cssFile = "app/css/" + fileBase + ".css";

      this.fs.copyTpl(
        this.templatePath('_section.html'),
        this.destinationPath(htmlFile),
        context
      );
      this.fs.copyTpl(
        this.templatePath('_section.css'),
        this.destinationPath(cssFile),
        context
      );
    },
    
    generateMenu: function() {
      var menu = this.read("_menu.html");

      var t = '<a><%= name %></a>';
      var files = this.expand('app/sections/*.html');

      for (var i = 0; i < files.length; i++) {
        var name = this._.chain(files[i]).strRight("_").strLeftBack(".html").humanize().value();
        
        var context = {
          name: name,
          id: this._.classify(name)
        };

        var link = this.engine(t, context);
        menu = this.append(menu, "div.menu", link);          
      }

      this.write(
        this.destinationPath("app/menu.html"),
        menu
      );
    }
  }
});
