module.exports = function (grunt) {

    if (!grunt.option("gulp")) {
        grunt.fail.fatal("Do not call grunt directly. Please use gulp instead.")
        return;
    }

    grunt.initConfig({
        pkg : require("./package.json"),
        atpackager : {
            packaging : {
                options : {
                    sourceFiles : [ "**/*" ],
                    sourceDirectories : [ "build/client/statics-dev" ],
                    outputDirectory : "build/client/statics",
                    visitors : [ {
                        type : "TextReplace",
                        cfg : {
                            files : "index.html",
                            replacements : [ {
                                find : /\/statics-dev\/noder-js\/noder.js/g,
                                replace : "/statics/openarms-<%= pkg.version %>.js"
                            }, {
                                find : /\/statics-dev\//g,
                                replace : "/statics/"
                            } ]
                        }
                    }, {
                        type : "CheckDependencies",
                        cfg : {
                            noCircularDependencies : false,
                            checkPackagesOrder : false
                        }
                    }, {
                        type : "JSMinify",
                        cfg : {
                            files : [ "**/*.js", "!sqlite.js" ]
                        }
                    }, {
                        type : "JSMinify",
                        cfg : {
                            files : [ "sqlite.js" ],
                            mangle : false
                        }
                    }, "NoderMap", {
                        type : "Hash",
                        cfg : {
                            hash : "murmur3",
                            files : [ "**/*.js", "!openarms-<%= pkg.version %>.js" ]
                        }
                    }, {
                        type : "NoderDependencies",
                        cfg : {
                            externalDependencies : [ "noder-js/**" ]
                        }
                    }, {
                        type : "CopyUnpackaged",
                        cfg : {
                            files : [ "images/**", "css/**", "bootstrap/**", "vis/**" ]
                        }
                    }, {
                        type : "CopyUnpackaged",
                        cfg : {
                            builder : "Concat",
                            files : [ "index.html" ]
                        }
                    } ],
                    packages : [ {
                        name : "openarms-<%= pkg.version %>.js",
                        builder : "NoderBootstrapPackage",
                        files : [ "**/*.js", "!noder-js/**", "!noderError/**", "!sqlite.js" ]
                    }, {
                        name : "sqlite.js",
                        builder : "NoderPackage",
                        files : [ "sqlite.js" ]
                    } ]
                }
            }
        }
    });

    grunt.loadNpmTasks("atpackager");
    require("atpackager").loadNpmPlugin("noder-js");

    grunt.registerTask("default", [ "atpackager:packaging" ]);
};
