'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Yo, ' +  chalk.cyan('Adrian') + '. Welcome to the generator!'
    ));

    var prompts = [{
      name: 'appName',
      message: 'What is your app\'s name ?'
    }, {
      type: 'confirm',
      name: 'addDemoSection',
      message: 'Would you like to generate a demo section ?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.addDemoSection = props.addDemoSection;
      done();
    }.bind(this));
  },

  configuring: function() {
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );
    this.fs.copy(
      this.templatePath('jshintrc'),
      this.destinationPath('.jshintrc')
    );  
  },

  writing: {
    scaffoldFolders: function() {
      this.mkdir("app");
      this.mkdir("app/css");
      this.mkdir("app/sections");
      this.mkdir("build");
    },
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
      this.fs.copy(
        this.templatePath('_footer.html'),
        this.destinationPath('app/footer.html')
      );
      this.fs.copy(
        this.templatePath('_gruntfile.js'),
        this.destinationPath('Gruntfile.js')
      );
      this.fs.copy(
        this.templatePath('_main.css'),
        this.destinationPath('app/css/main.css')
      );

      var context = {
        site_name: this.appName
      };

      this.fs.copyTpl(
        this.templatePath('_header.html'),
        this.destinationPath('app/header.html'),
        context
      );
    },

    generateDemoSection: function() {
      if (this.addDemoSection) {
        this.composeWith("adrian:section", {args: ["Demo Section"]}, {});
      } else {
        this.write(
          this.destinationPath("app/menu.html"),
          ""
        );
      }
    },
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
