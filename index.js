"use strict";
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const phantomjs = require('phantomjs-prebuilt');
const phantomBin = phantomjs.path;

class HighchartsExporter {
    constructor(chart = {}, filename = '') {
        this.width = 600;
        this.chart = chart;
        this.type = 'Chart';
        this.filename = filename;
    };

    setWidth(width) {
        this.width = width;
        return this;
    };

    setFileName(filename) {
        this.filename = filename;
        return this;
    };

    setType(type) {
        this.type = type;
        return this;
    };

    getArgs() {
        return [
            path.join(__dirname, 'lib/highcharts-convert.js'),
            '-options', JSON.stringify(this.chart),
            '-outfile', this.filename,
            '-width', this.width,
            '-constr', this.type
        ];
    };

    processResult(buffer) {
        let result = buffer.toString().split('\n');

        return {
            created: result.length > 2,
            message: result.length > 2?result[4]:result[0]
        };
    };

    exportSync() {
        return this.processResult(childProcess.execFileSync(phantomBin, this.getArgs()));
    };

    export() {
        let self = this;

        return new Promise(function (resolve, reject) {
            childProcess.execFile(phantomBin, self.getArgs(), function(err, stdout) {
                if (err) {
                    reject(self.processResult(err));
                } else {
                    resolve(self.processResult(stdout));
                }
            });
        });
    };
};

module.exports = HighchartsExporter;